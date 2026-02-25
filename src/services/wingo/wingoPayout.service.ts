import { Pool } from 'mysql2/promise';
import { WingoBetRecord } from '../../types/wingo.types';
import {
  getWinningBets,
  updateWingoBetStatus,
  updateUserBalance,
} from '../../db/wingo.queries';
import { getPayoutMultiplier } from '../../utils/wingo.helpers';

/**
 * Calculate payout for a specific bet
 */
export const calculatePayout = (
  bet: WingoBetRecord,
  result: number
): number => {
  const multiplier = getPayoutMultiplier(bet.selection, result);
  return bet.betAmount * multiplier;
};

/**
 * Process payout for a single bet
 */
export const processBetPayout = async (
  db: Pool,
  bet: WingoBetRecord,
  result: number
): Promise<void> => {
  const winAmount = calculatePayout(bet, result);

  if (winAmount > 0) {
    // Update bet status to won
    await updateWingoBetStatus(
      db,
      bet.id,
      1, // won status
      winAmount,
      String(result),
      true
    );

    // Add winnings to user balance
    await updateUserBalance(db, bet.userId, winAmount);
  }
};

/**
 * Process all payouts for a game period
 */
export const processWingoPayouts = async (
  db: Pool,
  game: string,
  period: string,
  result: number
): Promise<void> => {
  const winningBets = await getWinningBets(db, period, game);

  for (const bet of winningBets) {
    await processBetPayout(db, bet, result);
  }
};

/**
 * Pay multiple winning bets in batch
 */
export const payWinningBets = async (
  db: Pool,
  bets: WingoBetRecord[],
  result: number
): Promise<void> => {
  for (const bet of bets) {
    await processBetPayout(db, bet, result);
  }
};
