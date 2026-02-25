
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse } from '../../types/user.types';
import { findUserByToken, getTransferHistory } from '../../db/user.queries';

/\*\*

- Get transfer history (sent and received)
  \*/
  export const transferHistoryHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
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

        // Get sent and received transfers
        const [sent, received] = await Promise.all([
          getTransferHistory(db, user.id, 'sent'),
          getTransferHistory(db, user.id, 'received'),
        ]);

        res.status(200).json({
          message: 'Success',
          status: true,
          data: {
            sent: sent.map(t => ({
              id: t.id,
              amount: t.amount,
              receiver: (t as any).receiverPhone || 'Unknown',
              status: t.status,
              created_at: t.createdAt,
            })),
            received: received.map(t => ({
              id: t.id,
              amount: t.amount,
              sender: (t as any).senderPhone || 'Unknown',
              status: t.status,
              created_at: t.createdAt,
            })),
            total_sent: sent.reduce((sum, t) => sum + t.amount, 0),
            total_received: received.reduce((sum, t) => sum + t.amount, 0),
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('transferHistoryHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
