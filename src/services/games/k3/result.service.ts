
import { Pool } from 'mysql2/promise';
import { K3BetRecord } from '../../../types/k3.types';
import {
getPendingBetsByPeriod,
updateK3BetStatus,
} from '../../../db/k3.queries';
import {
calculateTotal,
isBig,
isSmall,
isEven,
isOdd,
hasPair,
isTriple,
isThreeDifferent,
isConsecutive,
isTwoDifferent,
parseResult,
} from '../../../utils';

/\*\*

- Generate random K3 result
  _/
  export const generateK3Result = (): string => {
  const dice = [1, 2, 3, 4, 5, 6];
  const result: number[] = [];
  for (let i = 0; i < 3; i++) {
  result.push(dice[Math.floor(Math.random() _ dice.length)]);
  }
  // Sort for consistent format
  return result.sort((a, b) => a - b).join('');
  };

/\*\*

- Evaluate Total bet
  \*/
  export const evaluateTotalBet = (bet: K3BetRecord, result: string): boolean => {
  const total = calculateTotal(result);
  const selection = bet.selection;

// Big
if (selection === 'b') return isBig(total);
// Small
if (selection === 's') return isSmall(total);
// Even
if (selection === 'c') return isEven(total);
// Odd
if (selection === 'l') return isOdd(total);
// Specific number
if (selection === String(total)) return true;

return false;
};

/\*\*

- Evaluate Two Same bet
  \*/
  export const evaluateTwoSameBet = (bet: K3BetRecord, result: string): boolean => {
  const [hasPairResult, pairValue] = hasPair(result);
  if (!hasPairResult) return false;

const selection = bet.selection;

// Any pair
if (selection === 'any') return true;

// Specific pair - parse from selection like "11"
const pairNum = parseInt(selection.charAt(0));
return pairValue === pairNum;
};

/\*\*

- Evaluate Three Same bet
  \*/
  export const evaluateThreeSameBet = (bet: K3BetRecord, result: string): boolean => {
  const [isTripleResult, tripleValue] = isTriple(result);
  if (!isTripleResult) return false;

const selection = bet.selection;

// Any triple
if (selection === 'any') return true;

// Specific triple
const tripleNum = parseInt(selection.charAt(0));
return tripleValue === tripleNum;
};

/\*\*

- Evaluate Unlike bet
  \*/
  export const evaluateUnlikeBet = (bet: K3BetRecord, result: string): boolean => {
  const selection = bet.selection;

// Three different
if (selection === '3d') return isThreeDifferent(result);
// Consecutive
if (selection === 'lt') return isConsecutive(result);
// Two different
if (selection === '2d') return isTwoDifferent(result);

return false;
};

/\*\*

- Check if a specific bet wins
  \*/
  export const isWinningBet = (bet: K3BetRecord, result: string): boolean => {
  switch (bet.betType) {
  case 'total':
  return evaluateTotalBet(bet, result);
  case 'two-same':
  return evaluateTwoSameBet(bet, result);
  case 'three-same':
  return evaluateThreeSameBet(bet, result);
  case 'unlike':
  return evaluateUnlikeBet(bet, result);
  default:
  return false;
  }
  };

/\*\*

- Process game results - mark losing bets
  \*/
  export const processK3Results = async (
  db: Pool,
  game: number,
  period: string,
  result: string
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
        false
      );
    } else {
      // Keep as pending for payout
      await updateK3BetStatus(
        db,
        bet.id,
        0, // pending status
        0,
        result,
        true
      );
    }

}
};

/\*\*

- Get all winning bets for a period
  \*/
  export const getWinningBetsForPeriod = async (
  db: Pool,
  game: number,
  period: string,
  result: string
  ): Promise<K3BetRecord[]> => {
  const pendingBets = await getPendingBetsByPeriod(db, period, game);
  return pendingBets.filter(bet => isWinningBet(bet, result));
  };
