
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse } from '../../../types/user.types';
import { findUserByToken, getUserWithdrawals } from '../../../db/user.queries';

/\*\*

- Get withdrawal history
  \
 */
  export const listWithdrawHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
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

        // Get all withdrawals ordered by date
        const withdrawals = await getUserWithdrawals(db, user.id);

        res.status(200).json({
          message: 'Success',
          status: true,
          data: {
            withdrawals: withdrawals.map(w => ({
              id: w.id,
              order_id: w.orderId,
              amount: w.amount,
              status: w.status,
              rejection_reason: w.rejectionReason,
              requested_at: w.requestedAt,
            })),
            total_withdrawals: withdrawals.length,
            total_amount: withdrawals.reduce((sum, w) => sum + w.amount, 0),
            pending_count: withdrawals.filter(w => w.status === 0).length,
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('listWithdrawHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
