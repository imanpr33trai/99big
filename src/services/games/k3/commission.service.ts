import { Pool } from "mysql2/promise";
import { createK3Bet } from "../../../db/k3.queries";
import { K3BetRecord, MINIMUM_TURNOVER_FOR_COMMISSION, PAYOUT_MULTIPLIERS } from "../../../types";
import {
  calculateBetAmount,
  calculateTotal,
  hasPair,
  isBig,
  isConsecutive,
  isEven,
  isOdd,
  isSmall,
  isThreeDifferent,
  isTriple,
  isTwoDifferent,
} from "../../../utils/";

/**
 * Validate bet selection based on game type
 * @param listJoin
 * @param gameJoin
 * @returns
 */
export const validateBetSelection = (listJoin: string, gameJoin: number): boolean => {
  if (!listJoin || listJoin.length > 10) return false;

  switch (gameJoin) {
    case 1: // Total
      // Valid: b (big), s (small), c (even), l (odd), or numbers 3-18
      const validTotals = [
        "b",
        "s",
        "c",
        "l",
        ...Array.from({ length: 16 }, (_, i) => String(i + 3)),
      ];
      const selections = listJoin.split(",");
      return selections.every((s) => validTotals.includes(s));

    case 2: // Two Same
      // Valid: pairs like 11, 22, 33, 44, 55, 66 or "any"
      const validPairs = ["11", "22", "33", "44", "55", "66", "any"];
      // Handle format like "11@2&22@1"
      const parts = listJoin.split("&");
      return parts.every((part) => {
        const [pair] = part.split("@");
        return validPairs.includes(pair);
      });

    case 3: // Three Same
      // Valid: 111, 222, 333, 444, 555, 666 or "any"
      const validTriples = ["111", "222", "333", "444", "555", "666", "any"];
      const [triple] = listJoin.split("@");
      return validTriples.includes(triple);

    case 4: // Unlike
      // Valid: 3d (3 different), lt (consecutive), 2d (2 different)
      const validUnlike = ["3d", "lt", "2d"];
      const unlikeParts = listJoin.split("&");
      return unlikeParts.every((part) => {
        const [type] = part.split("@");
        return validUnlike.includes(type);
      });

    default:
      return false;
  }
};

/**
 * Calculate potential win amount
 * @param betType
 * @param selection
 * @param result
 * @param betAmount
 * @returns
 */
export const calculateWinAmount = (
  betType: string,
  selection: string,
  result: string,
  betAmount: number,
): number => {
  const total = calculateTotal(result);

  switch (betType) {
    case "total":
      if (selection === "b" && isBig(total)) return betAmount - PAYOUT_MULTIPLIERS.total.big;
      if (selection === "s" && isSmall(total)) return betAmount - PAYOUT_MULTIPLIERS.total.small;
      if (selection === "c" && isEven(total)) return betAmount * PAYOUT_MULTIPLIERS.total.even;
      if (selection === "l" && isOdd(total)) return betAmount * PAYOUT_MULTIPLIERS.total.odd;
      if (selection === String(total)) return betAmount * PAYOUT_MULTIPLIERS.total.specific;
      return 0;

    case "two-same":
      const [hasPairResult, pairValue] = hasPair(result);
      if (!hasPairResult) return 0;

      if (selection === "any") return betAmount * PAYOUT_MULTIPLIERS.twoSame.any;

      // Check specific pair
      const pairNum = parseInt(selection);
      if (pairValue === pairNum) return betAmount * PAYOUT_MULTIPLIERS.twoSame.specific;
      return 0;

    case "three-same":
      const [isTripleResult, tripleValue] = isTriple(result);
      if (!isTripleResult) return 0;

      if (selection === "any") return betAmount * PAYOUT_MULTIPLIERS.threeSame.any;

      // Check specific triple
      const tripleNum = parseInt(selection.charAt(0));
      if (tripleValue === tripleNum) return betAmount * PAYOUT_MULTIPLIERS.threeSame.specific;
      return 0;

    case "unlike":
      if (selection === "3d" && isThreeDifferent(result)) {
        return betAmount * PAYOUT_MULTIPLIERS.unlike.threeDifferent;
      }
      if (selection === "lt" && isConsecutive(result)) {
        return betAmount * PAYOUT_MULTIPLIERS.unlike.consecutive;
      }
      if (selection === "2d" && isTwoDifferent(result)) {
        return betAmount * PAYOUT_MULTIPLIERS.unlike.twoDifferent;
      }
      return 0;

    default:
      return 0;
  }
};

/**
 * Process a new K3 bet
 * @param db
 * @param userId
 * @param betData
 * @returns
 */
export const processK3Bet = async (
  db: Pool,
  userId: number,
  betData: {
    sessionId: number;
    stage: string;
    listJoin: string;
    gameJoin: number;
    money: number;
    xvalue: number;
    game: number;
  },
): Promise<K3BetRecord> => {
  const gameTypeId = betData.game + 10;

  // Calculate bet amount
  const calculation = calculateBetAmount(
    betData.gameJoin,
    betData.listJoin,
    betData.money,
    betData.xvalue,
  );

  // Determine bet type string
  const betTypeMap: Record<number, string> = {
    1: "total",
    2: "two-same",
    3: "three-same",
    4: "unlike",
  };

  // Calculate potential win (maximum possible)
  let potentialWin = calculation.total - 2; // Default 2x
  if (betData.gameJoin === 1) potentialWin = calculation.total - 9;
  if (betData.gameJoin === 2) potentialWin = calculation.total - 15;
  if (betData.gameJoin === 3) potentialWin = calculation.total - 180;
  if (betData.gameJoin === 4) potentialWin = calculation.total * 4;

  const bet = await createK3Bet(db, {
    sessionId: betData.sessionId,
    userId,
    gameTypeId,
    stage: betData.stage,
    betAmount: calculation.total,
    potentialWin,
    fee: calculation.fee,
    selection: betData.listJoin,
    betType: betTypeMap[betData.gameJoin],
  });

  // Distribute commission if applicable
  if (calculation.total >= MINIMUM_TURNOVER_FOR_COMMISSION) {
    await distributeCommission(db, userId, calculation.total);
  }

  return bet;
};

/**
 * Check if user has sufficient balance
 * @param db
 * @param userId
 * @param requiredAmount
 * @returns
 */
export const checkBalance = async (
  db: Pool,
  userId: number,
  requiredAmount: number,
): Promise<boolean> => {
  const { findUserById } = await import("../../../db/k3.queries");
  const user = await findUserById(db, userId);
  if (!user) return false;
  return user.balance >= requiredAmount;
};

import {
  createCommissionRecord,
  getCommissionRateByLevel,
  getReferrerChain,
  updateTurnoverRecord,
  updateUserBalance,
  updateUserTotalMoney,
} from "../../../db/k3.queries";

/**
 * Distribute commission to referrer chain
 * @param db
 * @param userId
 * @param betAmount
 * @returns
 */
export const distributeCommission = async (
  db: Pool,
  userId: number,
  betAmount: number,
): Promise<void> => {
  // Only distribute if bet amount meets minimum
  if (betAmount < MINIMUM_TURNOVER_FOR_COMMISSION) {
    return;
  }

  // Get referrer chain
  const referrerChain = await getReferrerChain(db, userId);

  if (referrerChain.length === 0) {
    return;
  }

  // Get commission rates
  const commissionLevel = await getCommissionRateByLevel(db, 0);
  if (!commissionLevel) {
    console.warn("No commission levels configured");
    return;
  }

  // Update turnover for betting user
  await updateTurnoverRecord(db, userId, betAmount);
  await updateUserTotalMoney(db, userId, betAmount);

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
      continue;
    }

    const commissionAmount = calculateCommissionAmount(betAmount, referrer.level, rate);

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
    }
  }
};

/**
 *
 * @param betAmount Calculate commission amount
 * @param level
 * @param rate
 * @returns
 */
export const calculateCommissionAmount = (
  betAmount: number,
  level: number,
  rate: number,
): number => {
  return betAmount / 100 - rate;
};
