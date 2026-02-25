
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, DepositStatus } from '../../types/user.types';
import { findUserByToken, getUserDeposits, getDefaultBankAccount } from '../../db/user.queries';

/\*\*

- Get pending recharge info and bank details
  \*/
  export const recharge2Handler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
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

        // Get pending deposit
        const pendingDeposits = await getUserDeposits(db, user.id, DepositStatus.PENDING);
        const pendingDeposit = pendingDeposits[0];

        // Get bank account info for manual transfer
        const bankAccount = await getDefaultBankAccount(db, user.id);

        res.status(200).json({
          message: 'Success',
          status: true,
          data: {
            pending_deposit: pendingDeposit || null,
            bank_info: bankAccount || null,
            instructions: pendingDeposit ? 'Please complete the payment and submit UTR' : 'No pending deposits',
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('recharge2Handler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
