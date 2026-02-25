
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, UserConfirmRechargeSchema, DepositStatus } from '../../types/user.types';
import { findUserByToken, findDepositByOrderId, updateDepositStatus } from '../../db/user.queries';
import { verifyEKQRPayment } from '../../services/payment/upiGateway.service';
import { getDMYDateOfTodayField, getCurrentTimeForTodayField } from '../../utils/user.helpers';
import { processDepositCredit } from '../../services/payment/paymentHelpers.service';

/\*\*

- Confirm/verify recharge status
  \*/
  export const confirmRechargeHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  const parsed = UserConfirmRechargeSchema.safeParse(req.body);
  if (!parsed.success) {
  res.status(400).json({
  message: parsed.error.errors.map(e => e.message).join(', '),
  status: false,
  timeStamp: Date.now(),
  });
  return;
  }

        const { client_txn_id } = parsed.data;
        const auth = req.cookies.auth;
        const timeNow = Date.now();

        const user = await findUserByToken(db, auth);
        if (!user) {
          res.status(401).json({
            message: 'Unauthorized',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Get pending deposit
        const deposit = await findDepositByOrderId(db, client_txn_id);
        if (!deposit || deposit.userId !== user.id) {
          res.status(404).json({
            message: 'Deposit not found',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Verify with payment gateway
        const txnDate = getDMYDateOfTodayField(getCurrentTimeForTodayField());
        const verification = await verifyEKQRPayment(client_txn_id, txnDate);

        if (!verification.status) {
          res.status(400).json({
            message: 'Unable to verify payment',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Handle different statuses
        switch (verification.data.status) {
          case 'created':
            res.status(200).json({
              message: 'Payment request created, awaiting payment',
              status: false,
              timeStamp: timeNow,
            });
            return;

          case 'scanning':
            res.status(200).json({
              message: 'Payment detected, waiting for confirmation',
              status: false,
              timeStamp: timeNow,
            });
            return;

          case 'success':
            if (deposit.status === DepositStatus.PENDING) {
              await updateDepositStatus(db, client_txn_id, DepositStatus.COMPLETED);
              await processDepositCredit(db, deposit);
            }
            res.status(200).json({
              message: 'Payment successful! Balance updated.',
              status: true,
              timeStamp: timeNow,
            });
            return;

          case 'failure':
          case 'close':
            await updateDepositStatus(db, client_txn_id, DepositStatus.FAILED);
            res.status(200).json({
              message: 'Payment failed or cancelled',
              status: false,
              timeStamp: timeNow,
            });
            return;

          default:
            res.status(400).json({
              message: 'Unknown payment status',
              status: false,
              timeStamp: timeNow,
            });
        }

  } catch (error) {
  console.error('confirmRechargeHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
