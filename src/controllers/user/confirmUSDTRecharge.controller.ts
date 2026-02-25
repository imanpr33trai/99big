
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, DepositStatus } from '../../types/user.types';
import { findUserByToken, findDepositByOrderId, updateDepositStatus } from '../../db/user.queries';
import { processDepositCredit } from '../../services/payment/paymentHelpers.service';

/\*\*

- Confirm USDT recharge (manual verification)
  \*/
  export const confirmUSDTRechargeHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  const { order_id, tx_hash, status } = req.body;
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

      // Find deposit
      const deposit = await findDepositByOrderId(db, order_id);
      if (!deposit || deposit.userId !== user.id) {
        res.status(404).json({
          message: 'Deposit not found',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      // Update with transaction hash
      await db.execute(
        'UPDATE deposits SET utrNumber = ? WHERE id = ?',
        [tx_hash, deposit.id]
      );

      // If admin manually confirms
      if (status === 'confirmed') {
        await updateDepositStatus(db, order_id, DepositStatus.COMPLETED);
        await processDepositCredit(db, deposit);

        res.status(200).json({
          message: 'USDT deposit confirmed successfully',
          status: true,
          timeStamp: timeNow,
        });
        return;
      }

      res.status(200).json({
        message: 'Transaction hash submitted for verification',
        status: true,
        timeStamp: timeNow,
      });

  } catch (error) {
  console.error('confirmUSDTRechargeHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
