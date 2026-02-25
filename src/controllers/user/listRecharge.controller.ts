
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse } from '../../types/user.types';
import { findUserByToken, getUserDeposits } from '../../db/user.queries';

/\*\*

- Get recharge/deposit history
  \*/
  export const listRechargeHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
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

        // Get all deposits ordered by date
        const deposits = await getUserDeposits(db, user.id);

        res.status(200).json({
          message: 'Success',
          status: true,
          data: {
            deposits: deposits.map(d => ({
              id: d.id,
              order_id: d.orderId,
              amount: d.amount,
              status: d.status,
              utr_number: d.utrNumber,
              created_at: d.createdAt,
            })),
            total_deposits: deposits.length,
            total_amount: deposits.reduce((sum, d) => sum + d.amount, 0),
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('listRechargeHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
