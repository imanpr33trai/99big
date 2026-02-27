import { Pool } from "mysql2/promise";
import {
  createCommissionRecord,
  findUserById,
  getCommissionRateByLevel,
  getOrCreateTurnoverRecord,
  getReferrerChain,
  updateTurnoverRecord,
  updateUserBalance,
  updateUserTotalMoney,
} from "../../../db/wingo.queries";
import { MINIMUM_TURNOVER_FOR_COMMISSION } from "../../../types/wingo.types";

/**
 * Distribute commission to referrer chain
 */
export const distributeCommission = async (
  db: Pool,
  userId: number,
  turnover: number,
): Promise<void> => {
  // Only distribute if turnover meets minimum
  if (turnover < MINIMUM_TURNOVER_FOR_COMMISSION) {
    return;
  }

  // Get referrer chain (F1, F2, F3, F4)
  const referrerChain = await getReferrerChain(db, userId);

  if (referrerChain.length === 0) {
    return;
  }

  // Get commission rates
  const commissionLevel = await getCommissionRateByLevel(db, 0); // Default level
  if (!commissionLevel) {
    console.warn("No commission levels configured");
    return;
  }

  // Update turnover record for betting user
  await updateTurnoverRecord(db, userId, turnover);
  await updateUserTotalMoney(db, userId, turnover);

  // Distribute to each referrer
  for (const referrer of referrerChain) {
    let rate: number;

    switch (referrer.level) {
      case 1:
        rate = commissionLevel.rateF1;
        break;
      case 2:
        rate = commissionLevel.rateF2;
        break;
      case 3:
        rate = commissionLevel.rateF3;
        break;
      case 4:
        rate = commissionLevel.rateF4;
        break;
      default:
        continue;
    }

    // Check if referrer has sufficient level
    if (referrer.userLevel < 1) {
      continue; // Skip if not agent/admin level
    }

    const commissionAmount = calculateCommissionAmount(turnover, referrer.level, rate);

    if (commissionAmount > 0) {
      // Create commission record
      await createCommissionRecord(db, {
        userId: referrer.id,
        fromUserId: userId,
        level: referrer.level,
        amount: commissionAmount,
        sourceType: "bet",
        sourceId: userId,
      });

      // Update referrer balance
      await updateUserBalance(db, referrer.id, commissionAmount);

      // Update referrer turnover
      await updateTurnoverRecord(db, referrer.id, 0); // Just update timestamp
    }
  }
};

/**
 * Calculate commission amount
 */
export const calculateCommissionAmount = (
  turnover: number,
  level: number,
  rate: number,
): number => {
  return (turnover / 100) * rate;
};

/**
 * Create turnover record for user
 */
export const createTurnoverRecord = async (
  db: Pool,
  userId: number,
  amount: number,
): Promise<void> => {
  await getOrCreateTurnoverRecord(db, userId);
  await updateTurnoverRecord(db, userId, amount);
};

/**
 * Get full referrer chain with details
 */
export const getReferrerChainDetails = async (
  db: Pool,
  userId: number,
): Promise<Array<{ id: number; level: number; phone: string; userLevel: number }>> => {
  const chain = await getReferrerChain(db, userId);
  const details = [];

  for (const ref of chain) {
    const user = await findUserById(db, ref.id);
    if (user) {
      details.push({
        id: user.id,
        level: ref.level,
        phone: user.phone,
        userLevel: user.userLevel,
      });
    }
  }

  return details;
};
