import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UPIPaymentSchema, PaymentApiResponse, PaymentStatus, PaymentMethodType } from '../../types/payment.types';
import {
  initiateEKQRPayment,
  verifyEKQRPayment,
  getUPIIntentLinks
} from '../../services/payment/upiGateway.service';
import {
  getUserDataByAuthToken,
  cancelPendingDeposits,
  generateOrderId,
  getMinimumDepositAmount
} from '../../services/payment/paymentHelpers.service';
import { createDepositRecord } from '../../services/payment/deposit.service';
import { findDepositByOrderId, updateDepositStatus } from '../../db/payment.queries';
import { getDMYDateOfTodayField, getCurrentTimeForTodayField } from '../../utils/payment.helpers';
import { processDepositCredit } from '../../services/payment/paymentHelpers.service';

/**
 * Initiate UPI Gateway Payment (EKQR)
 */
export const initiateUPIPaymentHandler = (db: Pool) => async (
  req: Request,
  res: Response<PaymentApiResponse>
): Promise<void> => {
  try {
    // 1. Validate input with Zod
    const parsed = UPIPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Invalid input: ' + parsed.error.errors.map(e => e.message).join(', '),
        status: false
      });
      return;
    }

    const { money } = parsed.data;
    const auth = req.cookies.auth;
    const timeNow = new Date().toISOString();

    // 2. Check minimum amount
    const minimumMoney = getMinimumDepositAmount();
    if (money < minimumMoney) {
      res.status(400).json({
        message: `Money is required and it should be ₹${minimumMoney} or above!`,
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    // 3. Get user data
    const user = await getUserDataByAuthToken(db, auth);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow });
      return;
    }

    // 4. Cancel pending deposits
    await cancelPendingDeposits(db, user.phone);

    // 5. Generate order ID
    const orderId = generateOrderId();

    // 6. Call EKQR API
    const ekqrResponse = await initiateEKQRPayment({
      key: process.env.UPI_GATEWAY_PAYMENT_KEY || '',
      client_txn_id: orderId,
      amount: String(money),
      p_info: process.env.PAYMENT_INFO || '99BigDaddy',
      customer_name: user.userName,
      customer_email: process.env.PAYMENT_EMAIL || 'support@99bigdaddy.com',
      customer_mobile: user.phone,
      redirect_url: `${process.env.APP_BASE_URL}/wallet/verify/upi`,
    });

    // 7. Handle error
    if (!ekqrResponse || !ekqrResponse.status) {
      console.error('Gateway error from ekqr!', ekqrResponse);
      if (ekqrResponse?.msg === 'Plan Expired. Please Renew Plan') {
        res.status(400).json({
          message: 'Payment gateway plan has expired. Please contact support to renew the plan.',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }
      throw new Error(ekqrResponse?.msg || 'Gateway error from ekqr!');
    }

    // 8. Create deposit record
    const deposit = await createDepositRecord(db, {
      orderId,
      transactionId: null,
      utr: null,
      phone: user.phone,
      money,
      type: PaymentMethodType.UPI_GATEWAY,
      status: PaymentStatus.PENDING,
      today: getCurrentTimeForTodayField(),
      url: ekqrResponse.data.payment_url,
      time: timeNow,
      ipAddress: req.ip || null,
    });

    // 9. Get UPI intent links
    const upiLinks = getUPIIntentLinks(ekqrResponse);

    // 10. Return success
    res.status(200).json({
      message: 'Payment initiated successfully',
      recharge: deposit,
      urls: upiLinks,
      status: true,
      timeStamp: timeNow,
    });

  } catch (error) {
    console.error('Error executing payment initiation:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Verify UPI Payment Status (Callback/Return URL)
 */
export const verifyUPIPaymentHandler = (db: Pool) => async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const auth = req.cookies.auth;
    const orderId = req.query.client_txn_id as string;
    const timeNow = new Date().toISOString();

    // 1. Validate input
    if (!auth || !orderId) {
      res.status(400).json({ message: 'orderId is Required!', status: false, timeStamp: timeNow });
      return;
    }

    // 2. Get user and deposit
    const user = await getUserDataByAuthToken(db, auth);
    const deposit = await findDepositByOrderId(db, orderId);

    if (!deposit) {
      res.status(400).json({
        message: 'Unable to find recharge with this order id!',
        status: false,
        timeStamp: timeNow
      });
      return;
    }

    // 3. Verify with EKQR
    const txnDate = getDMYDateOfTodayField(deposit.today || getCurrentTimeForTodayField());
    const ekqrResponse = await verifyEKQRPayment(orderId, txnDate);

    if (!ekqrResponse || !ekqrResponse.status) {
      throw new Error('Gateway error from ekqr!');
    }

    // 4. Handle different statuses
    if (ekqrResponse.data.status === 'created') {
      res.status(200).json({
        message: 'Your payment request is just created',
        status: false,
        timeStamp: timeNow
      });
      return;
    }

    if (ekqrResponse.data.status === 'scanning') {
      res.status(200).json({
        message: 'Waiting for confirmation',
        status: false,
        timeStamp: timeNow
      });
      return;
    }

    if (ekqrResponse.data.status === 'success') {
      // 5. Update deposit status if pending
      if (deposit.status === PaymentStatus.PENDING || deposit.status === PaymentStatus.CANCELLED) {
        await updateDepositStatus(db, deposit.id, PaymentStatus.COMPLETED);
        await processDepositCredit(db, deposit);
      }

      // 6. Redirect to record page
      res.redirect('/wallet/rechargerecord');
      return;
    }

    // 7. Handle failure
    if (ekqrResponse.data.status === 'failure' || ekqrResponse.data.status === 'close') {
      await updateDepositStatus(db, deposit.id, PaymentStatus.FAILED);
      res.status(200).json({
        message: 'Payment failed',
        status: false,
        timeStamp: timeNow
      });
      return;
    }

    // Unknown status
    res.status(400).json({
      message: 'Unknown payment status',
      status: false,
      timeStamp: timeNow
    });

  } catch (error) {
    console.error('verifyUPIPaymentHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
