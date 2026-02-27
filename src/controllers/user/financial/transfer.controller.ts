
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, UserTransferSchema } from '../../../types/user.types';
import { findUserByToken, findUserByPhone } from '../../../db/user.queries';
import { validateTransfer, executeTransfer } from '../../../services/user/transfer.service';

/\*\*

- Transfer balance to another user
  \
 */
  export const transferHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  const parsed = UserTransferSchema.safeParse(req.body);
  if (!parsed.success) {
  res.status(400).json({
  message: parsed.error.errors.map(e => e.message).join(', '),
  status: false,
  timeStamp: Date.now(),
  });
  return;
  }

        const { amount, phone } = parsed.data;
        const auth = req.cookies.auth;
        const timeNow = Date.now();

        const sender = await findUserByToken(db, auth);
        if (!sender) {
          res.status(401).json({
            message: 'Unauthorized',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Check balance
        if (sender.balance < amount) {
          res.status(400).json({
            message: 'Insufficient balance',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Find receiver
        const receiver = await findUserByPhone(db, phone);
        if (!receiver) {
          res.status(404).json({
            message: 'Receiver not found',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Validate transfer
        const validation = await validateTransfer(db, sender, receiver, amount);
        if (!validation.valid) {
          res.status(400).json({
            message: validation.message,
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Execute transfer
        await executeTransfer(db, sender.id, receiver.id, amount);

        res.status(200).json({
          message: 'Transfer successful',
          status: true,
          data: {
            amount,
            receiver_phone: phone,
            receiver_name: receiver.userName,
            new_balance: sender.balance - amount,
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('transferHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
