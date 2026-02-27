import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { PaymentApiResponse, PaymentMethodType, PaymentStatus } from '../../../types/payment.types';
import {
  getUserDataByAuthToken,
  cancelPendingDeposits,
  generateOrderId
} from '../../services/payment/paymentHelpers.service';
import { createDepositRecord } from '../../services/payment/deposit.service';
import { initiateWowPayPayment, verifyWowPayCallback, parseWowPayCallback } from '../../services/payment/wowpay.service';
import { getCurrentTimeForTodayField, getCurrentDate } from '../../../utils';


/**
 * 
 * Initiate WowPay Payment
 * 
 */
export const initiateWowPayPaymentHandler = (db: Pool) => async (
  req: Request,
  res: Response<PaymentApiResponse>
): Promise<void> => {
  try {
    const { money } = req.query;
    const auth = req.cookies.auth;
    const timeNow = new Date().toISOString();

    // 1. Validate input
    const minimumMoney = getMinimumDepositAmount();
    const moneyNum = parseInt(money as string);

    if (!moneyNum || moneyNum < minimumMoney) {
      res.status(400).json({
        message: `Money is Required and it should be ₹${minimumMoney} or above!`,
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    // 2. Get user
    const user = await getUserDataByAuthToken(db, auth);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow });
      return;
    }

    // 3. Cancel pending deposits
    await cancelPendingDeposits(db, user.phone);

    // 4. Generate order ID and date
    const orderId = generateOrderId();
    const date = getCurrentDate();

    // 5. Prepare WowPay parameters
    const params = {
      version: '1.0',
      mch_id: process.env.WOWPAY_MERCHANT_ID || '',
      mch_order_no: orderId,
      pay_type: '151',
      trade_amount: moneyNum,
      order_date: date,
      goods_name: user.phone,
      notify_url: `${process.env.APP_BASE_URL}/wallet/verify/wowpay`,
      mch_return_msg: user.phone,
      page_url: `${process.env.APP_BASE_URL}/wallet/verify/wowpay`,
    };

    // 6. Generate signature
    const sign = generateWowPaySign(params, process.env.WOWPAY_MERCHANT_KEY || '');
    params.sign = sign;
    params.sign_type = 'MD5';

    // 7. Call WowPay API
    const response = await initiateWowPayPayment(params);

    // 8. Handle response
    if (response.respCode === 'SUCCESS' && response.payInfo) {
      res.status(200).json({
        message: 'Payment requested Successfully',
        payment_url: response.payInfo,
        status: true,
        timeStamp: timeNow,
      });
      return;
    }

    res.status(400).json({
      message: 'Payment request failed. Please try again or check details.',
      status: false,
      timeStamp: timeNow,
    });

  } catch (error) {
    console.error('initiateWowPayPaymentHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
    });
  }
};


/**
 * 
 * Verify WowPay Callback
 * 
 */
export const verifyWowPayPaymentHandler = (db: Pool) => async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let data = req.body;
    if (!req.body) {
      data = req.query;
    }

    const timeNow = Date.now();

    // 1. Parse callback parameters
    const params = parseWowPayCallback(data);

    // 2. Verify signature
    const isValid = await verifyWowPayCallback(params);
    if (!isValid) {
      console.error('WowPay signature validation failed');
      res.status(400).json({
        status: false,
        message: 'Something went wrong!',
        timeStamp: timeNow,
      });
      return;
    }

    // 3. Check if already processed
    const existingDeposit = await findDepositByOrderId(db, params.mchOrderNo);
    if (existingDeposit) {
      res.status(400).json({
        message: 'Recharge already verified!',
        status: true,
        timeStamp: timeNow,
      });
      return;
    }

    // 4. Check if payment was successful
    if (!isWowPaySuccess(params.tradeResult)) {
      res.status(400).json({
        message: 'Payment failed',
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    // 5. Create deposit record
    const deposit = await createDepositRecord(db, {
      orderId: params.mchOrderNo,
      transactionId: null,
      utr: null,
      phone: params.merRetMsg,
      money: parseFloat(params.amount),
      type: PaymentMethodType.WOW_PAY,
      status: PaymentStatus.COMPLETED,
      today: getCurrentTimeForTodayField(),
      url: 'NULL',
      time: timeNow,
    });

    // 6. Process deposit credit
    await processDepositCredit(db, deposit);

    // 7. Redirect to record page
    res.redirect('/wallet/rechargerecord');

  } catch (error) {
    console.error('verifyWowPayPaymentHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
    });
  }
};


/**
 * 
 * Helper function to check WowPay success
 * 
 */
const isWowPaySuccess = (tradeResult: string): boolean => {
  return tradeResult === '1' || tradeResult === 'SUCCESS';
};


/**
 * 
 * Get minimum deposit amount
 * 
 */
const getMinimumDepositAmount = (): number => {
  return parseInt(process.env.MINIMUM_MONEY || '100', 10);
};


/**
 * 
 * Generate WowPay sign (imported from service)
 * 
 */
const generateWowPaySign = (params: Record<string, unknown>, secretKey: string): string => {
  const keys = Object.keys(params).sort();
  const stringArr: string[] = [];

  for (const key of keys) {
    if (key === 'sign' || key === 'signType') continue;
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      stringArr.push(`${key}=${value}`);
    }
  }

  const signStr = stringArr.join('&') + '&key=' + secretKey;
  return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
};

import crypto from 'crypto';
import { findDepositByOrderId } from '../../../db/payment.queries';
import { processDepositCredit } from '../../services/payment/paymentHelpers.service';
