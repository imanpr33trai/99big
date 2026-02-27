import { Pool } from 'mysql2/promise';
import {
  findUserByAuthToken,
  updateUserBalance,
  setFirstDepositBonus,
  updateFreeBonus,
  createTransactionLog,
  findReferrerByCode,
  createSalaryRecord,
  getDepositBonusConfig,
  findUserByPhone
} from '../../db/payment.queries';
import {
  DepositBonus,
  DepositRecord,
  User,
  PaymentStatus,
  PaymentMethodType
} from '../../types/payment.types';
import { calculateDepositBonus, generateOrderId } from '../../utils';

/**
 * Generate unique order ID
 */
export { generateOrderId };

/**
 * Get user data by authentication token
 */
export const getUserDataByAuthToken = async (db: Pool, authToken: string): Promise<User | null> => {
  if (!authToken) return null;
  return await findUserByAuthToken(db, authToken);
};

/**
 * Calculate deposit bonus with all rules
 */
export const calculateDepositBonusAmount = (
  amount: number,
  isFirstDeposit: boolean,
  freeBonus: number
): DepositBonus => {
  return calculateDepositBonus(amount, isFirstDeposit, freeBonus);
};

/**
 * Process deposit credit to user account with bonuses
 */
export const processDepositCredit = async (db: Pool, deposit: DepositRecord): Promise<void> => {
  const user = await findUserByPhone(db, deposit.phone || '');
  if (!user) {
    throw new Error(`User not found for deposit ${deposit.orderId}`);
  }

  const bonusConfig = await calculateDepositBonus(
    deposit.amount,
    !user.firstDepositBonus,
    user.freeBonus
  );

  const totalCredit = deposit.amount +
    (deposit.amount * bonusConfig.bonusPercentage) +
    bonusConfig.freeBonus;

  // Update user balance
  await updateUserBalance(db, user.id, totalCredit);

  // Mark first deposit bonus as used if applicable
  if (!user.firstDepositBonus) {
    await setFirstDepositBonus(db, user.id);
  }

  // Deduct used free bonus
  if (bonusConfig.freeBonus > 0) {
    await updateFreeBonus(db, user.id, bonusConfig.freeBonus);
  }

  // Create transaction log for deposit
  await createTransactionLog(db, {
    userId: user.id,
    typeId: 1, // Deposit type
    amount: totalCredit,
    balanceBefore: user.balance,
    balanceAfter: user.balance + totalCredit,
    referenceId: deposit.id,
    referenceType: 'deposit',
    description: `Deposit of ₹${deposit.amount} with bonus`,
    ipAddress: deposit.ipAddress,
  });

  // Process referrer salary if applicable
  if (user.invitedBy && bonusConfig.salary > 0) {
    const referrer = await findUserByPhone(db, String(user.invitedBy));
    if (referrer) {
      await createSalaryRecord(db, {
        userId: referrer.id,
        amount: bonusConfig.salary,
        type: 'referral_commission',
        description: `Commission for referral deposit by ${user.phone}`,
        periodStart: new Date().toISOString().split('T')[0],
        periodEnd: new Date().toISOString().split('T')[0],
        isPaid: false,
        paidAt: null,
      });
    }
  }
};

/**
 * Validate UTR format (12 digits)
 */
export const validateUTR = (utr: string): boolean => {
  return /^\d{12}$/.test(utr);
};

/**
 * Validate amount against minimum
 */
export const validateAmount = (amount: number, minimum: number): boolean => {
  return amount >= minimum;
};

/**
 * Get minimum deposit amount from environment
 */
export const getMinimumDepositAmount = (): number => {
  return parseInt(process.env.MINIMUM_MONEY || '100', 10);
};
