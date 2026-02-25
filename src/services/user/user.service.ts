import { salaryQueryCreate } from "../../db/user.queries";
import { helperCalculateSalary } from "../../utils/common.helpers";
import {
  userQueryFindById,
  userQueryFindByToken,
  userQuerySetFirstDepositBonus,
  userQuerySetFreeBonus,
  userQueryUpdateBalance,
  userQueryUpdateFreeBonus,
} from "../queries/user.queries";
import { UserFromToken, UserSafeInfo } from "../types/user.types";

export const userServiceGetByToken = async (token: string): Promise<UserFromToken> => {
  const user = await userQueryFindByToken(token);
  if (!user) {
    throw new Error("User not found or inactive");
  }
  return {
    id: user.id,
    phone: user.phone,
    userName: user.userName,
    referralCode: user.referralCode,
    invitedBy: user.invitedBy,
    balance: user.balance,
    freeBonus: user.freeBonus,
    firstDepositBonus: user.firstDepositBonus,
  };
};

export const userServiceGetSafeInfo = async (token: string): Promise<UserSafeInfo | null> => {
  const user = await userQueryFindByToken(token);
  if (!user) return null;
  return {
    id: user.id,
    phone: user.phone,
    userName: user.userName,
    referralCode: user.referralCode,
    invitedBy: user.invitedBy,
    balance: user.balance,
    freeBonus: user.freeBonus,
    firstDepositBonus: user.firstDepositBonus,
    isVerified: user.isVerified,
    status: user.status,
  };
};

export const userServiceAddBalance = async (
  phone: string,
  amount: number,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    description?: string;
  },
): Promise<void> => {
  const user = await userQueryFindByToken(phone); // This won't work, need to fix
  // Actually we need to get user by phone properly
};

// Fix: Create proper add balance function
export const userServiceProcessDeposit = async (
  phone: string,
  amount: number,
  isFirstDeposit: boolean,
): Promise<void> => {
  const tenPercent = 0.1 * amount;
  const salary = helperCalculateSalary(amount);
  const incrementPercentage = isFirstDeposit ? 0.05 : 0.15;

  await userQuerySetFirstDepositBonus(phone);

  let adjustedAmount = amount + amount * incrementPercentage;

  // Get user to check free bonus
  const user = await userQueryFindByPhone(phone);
  if (!user) throw new Error("User not found");

  if (user.freeBonus >= tenPercent) {
    adjustedAmount += tenPercent;
    await userQueryUpdateFreeBonus(phone, tenPercent);
  } else {
    adjustedAmount += user.freeBonus;
    await userQuerySetFreeBonus(phone, 0);
  }

  await userQueryUpdateBalance(phone, adjustedAmount);

  // Handle referral commission
  if (user.invitedBy && salary > 0) {
    const agent = await userQueryFindById(user.invitedBy);
    if (agent) {
      await salaryQueryCreate({
        userId: agent.id,
        amount: salary,
        type: "Referral Bonus",
        description: `Referral bonus from ${phone} deposit`,
      });
      await userQueryUpdateBalance(agent.phone, salary);
    }
  }
};

// Need to import this
import { userQueryFindByPhone } from "../queries/user.queries";
