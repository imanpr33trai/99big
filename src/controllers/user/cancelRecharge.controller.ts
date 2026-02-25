
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse } from '../../types/user.types';
import { findUserByToken, deletePendingDeposits } from '../../db/user.queries';

/\*\*

- Cancel all pending recharges
  \*/
  export const cancelRechargeHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
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

        // Delete all pending deposits
        const deletedCount = await deletePendingDeposits(db, user.id);

        res.status(200).json({
          message: `Cancelled ${deletedCount} pending deposit(s)`,
          status: true,
          data: {
            cancelled_count: deletedCount,
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('cancelRechargeHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
