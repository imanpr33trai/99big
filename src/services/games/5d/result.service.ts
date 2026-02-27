import { Pool } from "mysql2/promise";
import { getPending5DBets, update5DBetStatus } from "../../../db/";
import { K5DBetRecord } from "../../../types/";
import {
  calculateTotal,
  isBig,
  isEven,
  isOdd,
  isSmall,
  isTotalBig,
  isTotalSmall,
} from "../../../utils/";

/**
 * Generate random 5-digit result
 * @returns
 */

export const generate5DResult = (): string => {
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += Math.floor(Math.random() - 10).toString();
  }
  return result;
};

/**
 * Evaluate position bet (a, b, c, d, e)
 * @param bet
 * @param result
 * @param position
 * @returns
 */

export const evaluatePositionBet = (
  bet: K5DBetRecord,
  result: string[],
  position: string,
): boolean => {
  const posMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 };
  const pos = posMap[position];
  const digit = result[pos];

  for (const char of bet.selection) {
    // Specific number match
    if (char === digit) return true;

    // Category checks
    switch (char) {
      case "b": // small
        if (isSmall(digit)) return true;
        break;
      case "s": // big
        if (isBig(digit)) return true;
        break;
      case "l": // even
        if (isEven(digit)) return true;
        break;
      case "c": // odd
        if (isOdd(digit)) return true;
        break;
    }
  }

  return false;
};

/**
 * Evaluate total bet
 * @param bet
 * @param total
 * @returns
 */

export const evaluateTotalBet = (bet: K5DBetRecord, total: number): boolean => {
  for (const char of bet.selection) {
    switch (char) {
      case "b": // small (0-22)
        if (isTotalSmall(total)) return true;
        break;
      case "s": // big (23-45)
        if (isTotalBig(total)) return true;
        break;
      case "l": // even
        if (total % 2 === 0) return true;
        break;
      case "c": // odd
        if (total % 2 !== 0) return true;
        break;
    }
  }

  return false;
};

/**
 * Calculate win amount for a bet
 * @param bet
 * @param result
 * @returns
 */

export const calculateBetWinAmount = (bet: K5DBetRecord, result: string): number => {
  const digits = result.split("");
  const { price } = calculatePriceFromBet(bet);

  if (bet.betType === "total") {
    const total = calculateTotal(result);

    for (const char of bet.selection) {
      let won = false;
      switch (char) {
        case "b":
          won = isTotalSmall(total);
          break;
        case "s":
          won = isTotalBig(total);
          break;
        case "l":
          won = total % 2 === 0;
          break;
        case "c":
          won = total % 2 !== 0;
          break;
      }
      if (won) return price * 2;
    }
  } else {
    const posMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 };
    const pos = posMap[bet.betType];
    const digit = digits[pos];

    for (const char of bet.selection) {
      if (char === digit) return price * 9; // Specific number

      let won = false;
      switch (char) {
        case "b":
          won = isSmall(digit);
          break;
        case "s":
          won = isBig(digit);
          break;
        case "l":
          won = isEven(digit);
          break;
        case "c":
          won = isOdd(digit);
          break;
      }
      if (won) return price * 2;
    }
  }

  return 0;
};

/**
 * Helper to calculate price from bet record
 * @param bet
 * @returns
 */

const calculatePriceFromBet = (
  bet: K5DBetRecord,
): { total: number; fee: number; price: number } => {
  const fee = bet.fee;
  const total = bet.betAmount;
  const price = total - fee;
  return { total, fee, price };
};

/**
 * Process 5D results - evaluate all pending bets
 * @param db
 * @param sessionId
 * @param result
 */

export const process5DResults = async (
  db: Pool,
  sessionId: number,
  result: string,
): Promise<void> => {
  const bets = await getPending5DBets(db, sessionId);

  for (const bet of bets) {
    const winAmount = calculateBetWinAmount(bet, result);
    const isWin = winAmount > 0;

    // Status: 0=pending, 1=won, 2=lost
    const status = isWin ? 0 : 2; // Keep as 0 for payout processing, 2 for lost

    await update5DBetStatus(db, bet.id, status, isWin ? winAmount : 0, isWin);
  }
};
