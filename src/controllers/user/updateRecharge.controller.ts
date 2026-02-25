
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, UserUpdateRechargeSchema } from '../../types/user.types';
import { findUserByToken, findDepositByOrderId } from '../../db/user.queries';
import { db } from '../../config/database';

/\*\*

- Update recharge with UTR/transaction ID
  \*/
  export const updateRechargeHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  const parsed = UserUpdateRechargeSchema.safeParse(req.body);
  if (!parsed.success) {
  res.status(400).json({
  message: parsed.error.errors.map(e => e.message).join(', '),
  status: false,
  timeStamp: Date.now(),
  });
  return;
  }

        const { money, id_order, inputData } = parsed.data;
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

        // Check if UTR already exists
        const [existing] = await db.execute(
          'SELECT 1 FROM deposits WHERE utrNumber = ? AND status != ? LIMIT 1',
          [inputData, 3] // 3 = failed/cancelled
        );

        if (existing && (existing as any[]).length > 0) {
          res.status(400).json({
            message: 'This UTR/Transaction ID has already been used',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Update deposit with UTR
        await db.execute(
          'UPDATE deposits SET utrNumber = ? WHERE orderId = ? AND userId = ?',
          [inputData, id_order, user.id]
        );

        res.status(200).json({
          message: 'UTR submitted successfully. Your deposit will be verified shortly.',
          status: true,
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('updateRechargeHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
