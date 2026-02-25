
import { Pool } from 'mysql2/promise';
import { K3BetRecord } from '../../types/k3.types';
import {
getWinningBets,
updateK3BetStatus,
updateUserBalance,
} from '../../db/k3.queries';
import { calculateWinAmount } from './k3Bet.service';

/\*\*

- Calculate payout for a bet
  \*/
  export const calculatePayout = (
  bet: K3BetRecord,
  result: string
  ): number => {
  return calculateWinAmount(bet.betType, bet.selection, result, bet.betAmount);
  };

/\*\*

- Process payout for a single bet
  \*/
  export const processBetPayout = async (
  db: Pool,
  bet: K3BetRecord,
  result: string
  ): Promise<void> => {
  const winAmount = calculatePayout(bet, result);

if (winAmount > 0) {
// Update bet status to won
await updateK3BetStatus(
db,
bet.id,
1, // won status
winAmount,
result,
true
);

    // Add winnings to user balance
    await updateUserBalance(db, bet.userId, winAmount);

}
};

/\*\*

- Process all payouts for a game period
  \*/
  export const processK3Payouts = async (
  db: Pool,
  game: number,
  period: string,
  result: string
  ): Promise<void> => {
  const winningBets = await getWinningBets(db, period, game);

for (const bet of winningBets) {
await processBetPayout(db, bet, result);
}
};

/\*\*

- Pay multiple winning bets
  \*/
  export const payWinningBets = async (
  db: Pool,
  bets: K3BetRecord[],
  result: string
  ): Promise<void> => {
  for (const bet of bets) {
  await processBetPayout(db, bet, result);
  }
  };
