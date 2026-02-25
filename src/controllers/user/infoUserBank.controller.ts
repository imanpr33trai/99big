
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse } from '../../types/user.types';
import { findUserByToken, getUserBankAccounts, getTotalDeposits, getTotalWithdrawals } from '../../db/user.queries';
import { calculateNetResult } from '../../services/user/user.service';

/\*\*

- Get user bank info and financial summary
  \*/
  export const infoUserBankHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
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

        // Calculate net result (deposits - withdrawals - bets)
        const netResult = await calculateNetResult(db, user.id);

        // Get bank accounts
        const bankAccounts = await getUserBankAccounts(db, user.id);

        // Get totals
        const [totalDeposits, totalWithdrawals] = await Promise.all([
          getTotalDeposits(db, user.id),
          getTotalWithdrawals(db, user.id),
        ]);

        res.status(200).json({
          message: 'Success',
          status: true,
          data: {
            financial_summary: {
              total_deposits: totalDeposits,
              total_withdrawals: totalWithdrawals,
              net_result: netResult,
              current_balance: user.balance,
            },
            bank_accounts: bankAccounts.map(acc => ({
              id: acc.id,
              bank_name: acc.bankName,
              account_name: acc.accountName,
              account_number: acc.accountNumber,
              ifsc_code: acc.ifscCode,
              is_default: acc.isDefault,
              is_verified: acc.isVerified,
            })),
            can_withdraw: netResult > 0 && bankAccounts.length > 0,
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('infoUserBankHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
