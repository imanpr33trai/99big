import { Pool } from 'mysql2/promise';
import { K3BetCalculation, K3BetRecord } from '../../types/k3.types';

/**
 * Validate bet selection based on game type
 */
export const validateBetSelection = (join: string, gameJoin: number): boolean => {
  switch (gameJoin) {
    case 1: // Total
      return ['b', 's', 'c', 'l'].includes(join) || /^[3-9]$/.test(join) || /^[1][0-8]$/.test(join);
    case 2: // Two Same
      return join === 'any' || /^[1-6]{2}$/.test(join) || /^(\d+@\d+&)+\d+@\d+$/.test(join);
    case 3: // Three Same
      return join === 'any' || /^[1-6]{3}$/.test(join);
    case 4: // Unlike
      return /^[1-9][a-z]?(@[1-9][a-z]?)*$/.test(join);
    default:
      return false;
  }
};

/**
 * Calculate bet amount based on game type and selections
 */
export const calculateBetAmount = (
  gameJoin: number,
  listJoin: string,
  money: number,
  xvalue: number
): K3BetCalculation => {
  let total = 0;
  let typeGame = '';

  switch (gameJoin) {
    case 1: // Total
      total = money * xvalue * listJoin.split(',').length;
      typeGame = 'total';
      break;

    case 2: // Two Same
      const twoSame = listJoin.split('@')[0];
      const unique = listJoin.split('@')[1];
      let twoSameCount = 0;
      let uniqueCount = 0;

      if (twoSame && twoSame.length > 0) {
        twoSameCount = twoSame.split(',').length;
      }

      if (unique && unique.length > 0) {
        const arr = unique.split('&');
        for (const item of arr) {
          const parts = item.split('|');
          if (parts.length > 1) {
            uniqueCount += parts[1].split(',').length;
          }
        }
      }

      total = money * xvalue * (uniqueCount + twoSameCount);
      typeGame = 'two-same';
      break;

    case 3: // Three Same
      const threeUnique = listJoin.split('@')[0];
      const threeSame = listJoin.split('@')[1];
      let threeUniqueCount = 0;
      let threeSameCount = 0;

      if (threeUnique && threeUnique.length > 0) {
        threeUniqueCount = threeUnique.split(',').length;
      }

      if (threeSame && threeSame.length > 0) {
        threeSameCount = 1;
      }

      total = money * xvalue * (threeUniqueCount + threeSameCount);
      typeGame = 'three-same';
      break;

    case 4: // Unlike
      const parts = listJoin.split('@');
      let unlikeTotal = 0;

      for (const part of parts) {
        if (part && part.length > 0) {
          unlikeTotal += part.split(',').length;
        }
      }

      total = money * xvalue * unlikeTotal;
      typeGame = 'unlike';
      break;

    default:
      total = money * xvalue;
      typeGame = 'unknown';
  }

  const fee = total * 0.02;
  const price = total - fee;

  return { total, fee, price, typeGame };
};

/**
 * Calculate win amount based on bet type and result
 */
export const calculateWinAmount = (
  betType: string,
  selection: string,
  result: string,
  betAmount: number
): number => {
  const dice = result.split('').map(d => parseInt(d));
  const total = dice.reduce((sum, d) => sum + d, 0);

  switch (betType) {
    case 'total':
      if (selection === 'b' && total >= 11 && total <= 18) return betAmount * 2;
      if (selection === 's' && total >= 3 && total <= 10) return betAmount * 2;
      if (selection === 'c' && total % 2 === 0) return betAmount * 2;
      if (selection === 'l' && total % 2 !== 0) return betAmount * 2;
      if (selection === total.toString()) return betAmount * 9;
      return 0;

    case 'two-same':
      if (selection === 'any') {
        const hasPair = dice[0] === dice[1] || dice[1] === dice[2] || dice[0] === dice[2];
        return hasPair ? betAmount * 3 : 0;
      }
      const pairValue = parseInt(selection);
      const hasSpecificPair = (dice[0] === pairValue && dice[1] === pairValue) ||
                              (dice[1] === pairValue && dice[2] === pairValue) ||
                              (dice[0] === pairValue && dice[2] === pairValue);
      return hasSpecificPair ? betAmount * 15 : 0;

    case 'three-same':
      if (selection === 'any') {
        const isTriple = dice[0] === dice[1] && dice[1] === dice[2];
        return isTriple ? betAmount * 30 : 0;
      }
      const tripleValue = parseInt(selection);
      const isSpecificTriple = dice[0] === tripleValue && dice[1] === tripleValue && dice[2] === tripleValue;
      return isSpecificTriple ? betAmount * 180 : 0;

    case 'unlike':
      if (selection === '3d' && dice[0] !== dice[1] && dice[1] !== dice[2] && dice[0] !== dice[2]) {
        return betAmount * 4;
      }
      if (selection === 'lt' && (dice[1] === dice[0] + 1 && dice[2] === dice[1] + 1)) {
        return betAmount * 4;
      }
      if (selection === '2d') {
        const unique = new Set(dice).size;
        return unique === 2 ? betAmount * 2 : 0;
      }
      return 0;

    default:
      return 0;
  }
};

/**
 * Process K3 bet - create bet record and update user balance
 */
export const processK3Bet = async (
  db: Pool,
  userId: number,
  betData: Partial<K3BetRecord>
): Promise<K3BetRecord> => {
  // This would be implemented with actual database calls
  // For now, return a mock implementation
  return {
    id: 0,
    sessionId: betData.sessionId || 0,
    userId,
    gameTypeId: 11,
    stage: betData.stage || 0,
    betAmount: betData.betAmount || 0,
    potentialWin: betData.potentialWin || 0,
    fee: betData.fee || 0,
    actualWin: 0,
    selection: betData.selection || '',
    betType: betData.betType || '',
    result: null,
    isWin: null,
    status: 0,
    createdAt: Date.now(),
  };
};
