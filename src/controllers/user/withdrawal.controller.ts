
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { UserApiResponse, UserWithdrawSchema, WithdrawalStatus } from '../../types/user.types';
import {
findUserByToken,
getDefaultBankAccount,
getTodayWithdrawalCount,
createWithdrawal,
deductUserBalance,
getTotalBets
} from '../../db/user.queries';
import { generateOrderId } from '../../utils/user.helpers';

/\*\*

- Process withdrawal request
  \*/
  export const withdrawalHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  const parsed = UserWithdrawSchema.safeParse(req.body);
  if (!parsed.success) {
  res.status(400).json({
  message: parsed.error.errors.map(e => e.message).join(', '),
  status: false,
  timeStamp: Date.now(),
  });
  return;
  }

        const { money, password } = parsed.data;
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

        // Verify password with bcrypt
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
          res.status(400).json({
            message: 'Incorrect password',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Check bank account exists
        const bankAccount = await getDefaultBankAccount(db, user.id);
        if (!bankAccount) {
          res.status(400).json({
            message: 'Please add a bank account first',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Check daily withdrawal limit (3 per day)
        const todayWithdrawals = await getTodayWithdrawalCount(db, user.id);
        if (todayWithdrawals >= 3) {
          res.status(400).json({
            message: 'Daily withdrawal limit reached (3 per day)',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Check balance
        if (user.balance < money) {
          res.status(400).json({
            message: 'Insufficient balance',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Check bet requirement (total bets >= withdrawal amount)
        const totalBets = await getTotalBets(db, user.id);
        if (totalBets < money) {
          res.status(400).json({
            message: 'Betting requirement not met. Total bets must be greater than or equal to withdrawal amount.',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Generate order ID
        const orderId = generateOrderId();

        // Create withdrawal record
        await createWithdrawal(db, {
          userId: user.id,
          orderId,
          amount: money,
          bankAccountId: bankAccount.id,
        });

        // Deduct balance
        const deducted = await deductUserBalance(db, user.id, money);
        if (!deducted) {
          res.status(400).json({
            message: 'Failed to process withdrawal. Please try again.',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        res.status(200).json({
          message: 'Withdrawal request submitted successfully',
          status: true,
          data: {
            order_id: orderId,
            amount: money,
            status: 'pending',
            estimated_time: '24-48 hours',
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('withdrawalHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
