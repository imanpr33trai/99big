
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, DepositStatus } from '../../../types/user.types';
import { findDepositByOrderId, updateDepositStatus } from '../../../db/user.queries';
import { processDepositCredit } from '../../../services/payment/paymentHelpers.service';

/\*\*

- Handle bank transfer callback from payment gateway
  \
 */
  export const callbackBankHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  // Extract callback data (format varies by gateway)
  const { orderId, status, transactionId, amount, signature } = req.body;

        // Validate required fields
        if (!orderId || !status) {
          res.status(400).json({
            message: 'Missing required fields',
            status: false,
            timeStamp: Date.now(),
          });
          return;
        }

        // TODO: Validate signature based on your gateway's algorithm
        // const isValidSignature = validateCallbackSignature(req.body, signature);
        // if (!isValidSignature) {
        //   res.status(400).json({ message: 'Invalid signature', status: false });
        //   return;
        // }

        // Find deposit
        const deposit = await findDepositByOrderId(db, orderId);
        if (!deposit) {
          res.status(404).json({
            message: 'Deposit not found',
            status: false,
            timeStamp: Date.now(),
          });
          return;
        }

        // Process based on status
        if (status === 'success' || status === 'completed') {
          if (deposit.status === DepositStatus.PENDING) {
            await updateDepositStatus(db, orderId, DepositStatus.COMPLETED);
            await processDepositCredit(db, deposit);
          }

          res.status(200).json({
            message: 'Callback processed successfully',
            status: true,
            timeStamp: Date.now(),
          });
          return;
        }

        if (status === 'failed' || status === 'cancelled') {
          await updateDepositStatus(db, orderId, DepositStatus.FAILED);

          res.status(200).json({
            message: 'Payment marked as failed',
            status: true,
            timeStamp: Date.now(),
          });
          return;
        }

        // Pending or processing
        res.status(200).json({
          message: 'Callback received',
          status: true,
          timeStamp: Date.now(),
        });

  } catch (error) {
  console.error('callbackBankHandler error:', error);
  res.status(500).json({
  message: 'Internal server error',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
