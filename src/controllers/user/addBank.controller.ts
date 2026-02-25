
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, UserBankSchema } from '../../types/user.types';
import { findUserByToken, getUserBankAccounts, createBankAccount, updateBankAccount } from '../../db/user.queries';

/\*\*

- Add or update bank account
  \*/
  export const addBankHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  const parsed = UserBankSchema.safeParse(req.body);
  if (!parsed.success) {
  res.status(400).json({
  message: parsed.error.errors.map(e => e.message).join(', '),
  status: false,
  timeStamp: Date.now(),
  });
  return;
  }

        const { name_bank, name_user, stk, email, tinh } = parsed.data;
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

        // Check if bank account already exists
        const existingAccounts = await getUserBankAccounts(db, user.id);
        const existingAccount = existingAccounts.find(a => a.accountNumber === stk);

        if (existingAccount) {
          // Update existing
          await updateBankAccount(db, user.id, {
            id: existingAccount.id,
            bankName: name_bank,
            accountName: name_user,
            accountNumber: stk,
            isDefault: true,
          });

          res.status(200).json({
            message: 'Bank account updated successfully',
            status: true,
            timeStamp: timeNow,
          });
          return;
        }

        // Create new bank account
        await createBankAccount(db, {
          userId: user.id,
          type: 'bank',
          bankName: name_bank,
          accountName: name_user,
          accountNumber: stk,
          isDefault: existingAccounts.length === 0, // First account is default
        });

        res.status(200).json({
          message: 'Bank account added successfully',
          status: true,
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('addBankHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
