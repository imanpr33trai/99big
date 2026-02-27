import { Pool } from "mysql2/promise";
import {
  getPendingBetsByPeriod,
  getWingoControlSettings,
  updateWingoBetStatus,
  updateWingoControlSettings,
} from "../../../db/wingo.queries";
import { WingoBetRecord } from "../../../types/wingo.types";
import {
  getNextPredefinedResult,
  getPayoutMultiplier,
  isBigWingo,
  isGreen,
  isRed,
  isSmallWingo,
  isViolet,
  parsePredefinedResults,
} from "../../../utils";

/**
 * Generate random Wingo result (0-9)
 */
export const generateWingoResult = (): number => {
  return Math.floor(Math.random() * 10);
};

/**
 * Evaluate if a number bet wins
 */
export const evaluateNumberBet = (selection: string, result: number): boolean => {
  if (!/^\d$/.test(selection)) return false;
  return parseInt(selection) === result;
};

/**
 * Evaluate if a color bet wins
 */
export const evaluateColorBet = (selection: string, result: number): boolean => {
  if (selection === "d" && isRed(result)) return true;
  if (selection === "x" && isGreen(result)) return true;
  if (selection === "t" && isViolet(result)) return true;
  return false;
};

/**
 * Evaluate if a size bet wins
 */
export const evaluateSizeBet = (selection: string, result: number): boolean => {
  if (selection === "l" && isBigWingo(result)) return true;
  if (selection === "n" && isSmallWingo(result)) return true;
  return false;
};

/**
 * Check if a specific bet wins given a result
 */
export const isWinningBet = (bet: WingoBetRecord, result: number): boolean => {
  const { selection } = bet;

  // Number bet
  if (/^\d$/.test(selection)) {
    return evaluateNumberBet(selection, result);
  }

  // Size bet
  if (selection === "l" || selection === "n") {
    return evaluateSizeBet(selection, result);
  }

  // Color bet
  if (selection === "d" || selection === "x" || selection === "t") {
    return evaluateColorBet(selection, result);
  }

  return false;
};

/**
 * Calculate smart result that minimizes platform payout
 */
export const calculateSmartAmount = async (
  db: Pool,
  game: string,
  period: string,
): Promise<number> => {
  const pendingBets = await getPendingBetsByPeriod(db, period, game);

  // Calculate exposure for each possible result (0-9)
  const exposure: Record<number, number> = {};

  for (let result = 0; result <= 9; result++) {
    let totalPayout = 0;

    for (const bet of pendingBets) {
      const multiplier = getPayoutMultiplier(bet.selection, result);
      if (multiplier > 0) {
        totalPayout += bet.betAmount * multiplier;
      }
    }

    exposure[result] = totalPayout;
  }

  // Find result with minimum payout
  let minResult = 0;
  let minPayout = exposure[0];

  for (let i = 1; i <= 9; i++) {
    if (exposure[i] < minPayout) {
      minPayout = exposure[i];
      minResult = i;
    }
  }

  return minResult;
};

/**
 * Get predefined result from settings or calculate smart result
 */
export const getSmartResult = async (db: Pool, game: string, period: string): Promise<number> => {
  // Check for predefined results
  const controlSettings = await getWingoControlSettings(db, game);

  if (controlSettings) {
    const predefined = parsePredefinedResults(controlSettings);

    if (predefined.length > 0 && predefined[0] !== null) {
      // Use predefined result
      const { result, remaining } = getNextPredefinedResult(predefined);

      // Update settings with remaining results
      await updateWingoControlSettings(db, game, remaining);

      if (result !== null) {
        return parseInt(result);
      }
    }
  }

  // Calculate smart result to minimize loss
  return await calculateSmartAmount(db, game, period);
};

/**
 * Process game results - mark losing bets
 */
export const processWingoResults = async (
  db: Pool,
  game: string,
  period: string,
  result: number,
): Promise<void> => {
  const pendingBets = await getPendingBetsByPeriod(db, period, game);

  for (const bet of pendingBets) {
    const isWin = isWinningBet(bet, result);

    if (!isWin) {
      // Mark as lost
      await updateWingoBetStatus(
        db,
        bet.id,
        2, // lost status
        0,
        String(result),
        false,
      );
    } else {
      // Keep as pending (status 0) for payout processing
      await updateWingoBetStatus(
        db,
        bet.id,
        0, // pending status
        0,
        String(result),
        true,
      );
    }
  }
};

/**
 * Get all winning bets for a period
 */
export const getWinningBetsForPeriod = async (
  db: Pool,
  game: string,
  period: string,
  result: number,
): Promise<WingoBetRecord[]> => {
  const pendingBets = await getPendingBetsByPeriod(db, period, game);
  return pendingBets.filter((bet) => isWinningBet(bet, result));
};
