
import { Pool } from 'mysql2/promise';
import { User, UserFinancialData } from '../../types/user.types';
import {
getTotalDeposits,
getTotalWithdrawals,
findUserById
} from '../../db/user.queries';
import { generateReferralCode, generateAuthToken, maskPhoneNumber } from '../../utils/user.helpers';

/\*\*

- Get comprehensive financial summary for user
  \*/
  export const getUserFinancialSummary = async (db: Pool, userId: number): Promise<UserFinancialData> => {
  const user = await findUserById(db, userId);
  if (!user) {
  throw new Error('User not found');
  }

const [totalRecharge, totalWithdraw] = await Promise.all([
getTotalDeposits(db, userId),
getTotalWithdrawals(db, userId),
]);

return {
code: user.referralCode,
id_user: user.id,
name_user: user.userName,
phone_user: maskPhoneNumber(user.phone),
money_user: user.balance,
totalRecharge,
totalWithdraw,
freeBonus: user.freeBonus,
};
};

/\*\*

- Update user information
  \*/
  export const updateUserInfo = async (db: Pool, userId: number, data: { name?: string }): Promise<void> => {
  const { updateUserName } = await import('../../db/user.queries');

if (data.name) {
await updateUserName(db, userId, data.name);
}
};

/\*\*

- Generate unique referral code
  \*/
  export { generateReferralCode };

/\*\*

- Generate secure auth token
  \*/
  export { generateAuthToken };

/\*\*

- Check if user can perform action (not suspended/banned)
  \*/
  export const isUserActive = (user: User): boolean => {
  return user.status === 0;
  };

/\*\*

- Calculate net result (deposits - withdrawals - bets)
  \*/
  export const calculateNetResult = async (db: Pool, userId: number): Promise<number> => {
  const { getTotalBets } = await import('../../db/user.queries');

const [deposits, withdrawals, bets] = await Promise.all([
getTotalDeposits(db, userId),
getTotalWithdrawals(db, userId),
getTotalBets(db, userId),
]);

return deposits - withdrawals - bets;
};
