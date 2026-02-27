import { Pool } from "mysql2/promise";
import { update5DBetStatus, updateUserBalance } from "../../../db";
import { K5DBetRecord } from "../../../types";
import { calculateBetWinAmount } from "./5dResult.service";

/**
 * Calculate payout for a bet
 * @param bet
 * @param result
 * @returns
 */

export const calculatePayout = (bet: K5DBetRecord, result: string): number => {
  return calculateBetWinAmount(bet, result);
};

/**
 * Process payouts for winning bets
 * @param db
 * @param sessionId
 * @param result
 */

export const process5DPayouts = async (
  db: Pool,
  sessionId: number,
  result: string,
): Promise<void> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Get all pending bets (status=0 means evaluated but not paid)
    const [bets] = await connection.execute(
      `SELECT id, userId, betAmount, fee, selection, betType, isWin, actualWin
       FROM bets WHERE sessionId = ? AND status = 0`,
      [sessionId],
    );

    for (const bet of bets as any[]) {
      if (bet.isWin && bet.actualWin > 0) {
        // Update bet status to won (1)
        await connection.execute("UPDATE bets SET status = 1 WHERE id = ?", [bet.id]);

        // Add winnings to user balance
        await connection.execute("UPDATE users SET balance = balance + ? WHERE id = ?", [
          bet.actualWin,
          bet.userId,
        ]);
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Pay winning bets (batch process)
 * @param db
 * @param bets
 */

export const payWinningBets = async (db: Pool, bets: K5DBetRecord[]): Promise<void> => {
  for (const bet of bets) {
    if (bet.isWin && bet.actualWin > 0) {
      await update5DBetStatus(db, bet.id, 1, bet.actualWin, true);
      await updateUserBalance(db, bet.userId, bet.actualWin);
    }
  }
};
