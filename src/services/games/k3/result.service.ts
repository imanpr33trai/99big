import { Pool } from "mysql2/promise";
import { getPendingBetsByPeriod, updateK3BetStatus } from "../../../db/k3.queries";
import { K3BetRecord } from "../../../types/k3.types";
import {
  hasPair,
  isConsecutive,
  isEven,
  isK3TotalBig,
  isK3TotalSmall,
  isOdd,
  isThreeDifferent,
  isTriple,
  isTwoDifferent,
  sumDigits,
} from "../../../utils";

/**
 * Evaluate Total bet
 * @param bet
 * @param result
 * @returns
 */

export const evaluateTotalBet = (bet: K3BetRecord, result: string): boolean => {
  const total = sumDigits(result);
  const selection = bet.selection;

  // Big
  if (selection === "b") return isK3TotalBig(total);
  // Small
  if (selection === "s") return isK3TotalSmall(total);
  // Even
  if (selection === "c") return isEven(total);
  // Odd
  if (selection === "l") return isOdd(total);
  // Specific number
  if (selection === String(total)) return true;

  return false;
};

/**
 * Evaluate Two Same bet
 * @param bet
 * @param result
 * @returns
 */

export const evaluateTwoSameBet = (bet: K3BetRecord, result: string): boolean => {
  const [hasPairResult, pairValue] = hasPair(result);
  if (!hasPairResult) return false;

  const selection = bet.selection;

  // Any pair
  if (selection === "any") return true;

  // Specific pair - parse from selection like "11"
  const pairNum = parseInt(selection.charAt(0));
  return pairValue === pairNum;
};

/**
 * Evaluate Three Same bet
 * @param bet
 * @param result
 * @returns
 */

export const evaluateThreeSameBet = (bet: K3BetRecord, result: string): boolean => {
  const [isTripleResult, tripleValue] = isTriple(result);
  if (!isTripleResult) return false;

  const selection = bet.selection;

  // Any triple
  if (selection === "any") return true;

  // Specific triple
  const tripleNum = parseInt(selection.charAt(0));
  return tripleValue === tripleNum;
};

/**
 * Evaluate Unlike bet
 * @param bet
 * @param result
 * @returns
 */

export const evaluateUnlikeBet = (bet: K3BetRecord, result: string): boolean => {
  const selection = bet.selection;

  // Three different
  if (selection === "3d") return isThreeDifferent(result);
  // Consecutive
  if (selection === "lt") return isConsecutive(result);
  // Two different
  if (selection === "2d") return isTwoDifferent(result);

  return false;
};

/**
 * Check if a specific bet wins
 * @param bet
 * @param result
 * @returns
 */

export const isWinningBet = (bet: K3BetRecord, result: string): boolean => {
  switch (bet.betType) {
    case "total":
      return evaluateTotalBet(bet, result);
    case "two-same":
      return evaluateTwoSameBet(bet, result);
    case "three-same":
      return evaluateThreeSameBet(bet, result);
    case "unlike":
      return evaluateUnlikeBet(bet, result);
    default:
      return false;
  }
};

/**
 * Process game results - mark losing bets
 * @param db
 * @param game
 * @param period
 * @param result
 */

export const processK3Results = async (
  db: Pool,
  game: number,
  period: string,
  result: string,
): Promise<void> => {
  const pendingBets = await getPendingBetsByPeriod(db, period, game);

  for (const bet of pendingBets) {
    const isWin = isWinningBet(bet, result);

    if (!isWin) {
      // Mark as lost
      await updateK3BetStatus(
        db,
        bet.id,
        2, // lost status
        0,
        result,
        false,
      );
    } else {
      // Keep as pending for payout
      await updateK3BetStatus(
        db,
        bet.id,
        0, // pending status
        0,
        result,
        true,
      );
    }
  }
};

/**
 * Get all winning bets for a period
 * @param db
 * @param game
 * @param period
 * @param result
 * @returns
 */
export const getWinningBetsForPeriod = async (
  db: Pool,
  game: number,
  period: string,
  result: string,
): Promise<K3BetRecord[]> => {
  const pendingBets = await getPendingBetsByPeriod(db, period, game);
  return pendingBets.filter((bet) => isWinningBet(bet, result));
};
