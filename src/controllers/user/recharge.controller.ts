
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, UserRechargeSchema, DepositStatus, PaymentMethodType } from '../../types/user.types';
import { findUserByToken, deletePendingDeposits, createDeposit } from '../../db/user.queries';
import { generateOrderId, getCurrentTimeForTodayField } from '../../utils/user.helpers';
import { getMinimumDepositAmount } from '../../services/payment/paymentHelpers.service';
import { initiateEKQRPayment, getUPIIntentLinks } from '../../services/payment/upiGateway.service';

/\*\*

- Initiate recharge/deposit
  \*/
  export const rechargeHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  const parsed = UserRechargeSchema.safeParse(req.body);
  if (!parsed.success) {
  res.status(400).json({
  message: parsed.error.errors.map(e => e.message).join(', '),
  status: false,
  timeStamp: Date.now(),
  });
  return;
  }

        const { money, type } = parsed.data;
        const auth = req.cookies.auth;
        const timeNow = new Date().toISOString();

        const user = await findUserByToken(db, auth);
        if (!user) {
          res.status(401).json({
            message: 'Unauthorized',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Check minimum amount
        const minimumMoney = getMinimumDepositAmount();
        if (money < minimumMoney) {
          res.status(400).json({
            message: `Minimum deposit amount is ₹${minimumMoney}`,
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Cancel pending deposits unless explicitly cancelling
        if (type !== 'cancel') {
          await deletePendingDeposits(db, user.id);
        }

        // Generate order ID
        const orderId = generateOrderId();

        // For UPI gateway integration
        if (type === 'upi_gateway') {
          try {
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

            if (!ekqrResponse.status) {
              throw new Error(ekqrResponse.msg || 'Gateway error');
            }

            // Create deposit record
            const deposit = await createDeposit(db, {
              userId: user.id,
              orderId,
              amount: money,
              status: DepositStatus.PENDING,
            });

            const upiLinks = getUPIIntentLinks(ekqrResponse);

            res.status(200).json({
              message: 'Payment initiated',
              status: true,
              data: {
                order_id: orderId,
                deposit_id: deposit.id,
                payment_url: ekqrResponse.data.payment_url,
                upi_links: upiLinks,
              },
              timeStamp: timeNow,
            });
            return;
          } catch (gatewayError) {
            console.error('Gateway error:', gatewayError);
            res.status(400).json({
              message: gatewayError instanceof Error ? gatewayError.message : 'Payment gateway error',
              status: false,
              timeStamp: timeNow,
            });
            return;
          }
        }

        // For manual payments (UPI, USDT)
        const deposit = await createDeposit(db, {
          userId: user.id,
          orderId,
          amount: money,
          status: DepositStatus.PENDING,
        });

        res.status(200).json({
          message: 'Deposit request created',
          status: true,
          data: {
            order_id: orderId,
            deposit_id: deposit.id,
            amount: money,
            status: 'pending',
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('rechargeHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
