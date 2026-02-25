import { Pool } from 'mysql2/promise';
import {
  WingoBetCalculation,
  WingoBetRecord,
  BET_PAYOUTS,
  MINIMUM_TURNOVER_FOR_COMMISSION,
  BET_FEE_PERCENTAGE,
} from '../../types/wingo.types';
import {
  createWingoBet,
  findUserById,
} from '../../db/wingo.queries';
import {
  validateBetSelection,
  getBetType,
  getPayoutMultiplier,
  generateBetHTML,
  formatTimeIST,
} from '../../utils/wingo.helpers';
import { distributeCommission } from './wingoCommission.service';

/**
 * Validate bet selection
 */
export const validateBet = (join: string): boolean => {
  return validateBetSelection(join);
};

/**
 * Calculate bet amount, fee, and net price
 */
export const calculateBetAmount = (
  join: string,
  money: number,
  x: number
): WingoBetCalculation => {
  const total = money * x;
  const fee = total * (BET_FEE_PERCENTAGE / 100);
  const price = total - fee;

  return { total, fee, price };
};

/**
 * Calculate win amount based on bet and result
 */
export const calculateWinAmount = (
  selection: string,
  result: number,
  betAmount: number
): number => {
  const multiplier = getPayoutMultiplier(selection, result);
  return betAmount * multiplier;
};

/**
 * Process Wingo bet - create bet record and update user balance
 */
export const processWingoBet = async (
  db: Pool,
  userId: number,
  betData: {
    sessionId: number;
    gameTypeId: number;
    stage: string;
    selection: string;
    betAmount: number;
    potentialWin: number;
    fee: number;
  }
): Promise<WingoBetRecord> => {
  const betType = getBetType(betData.selection);

  const bet = await createWingoBet(db, {
    sessionId: betData.sessionId,
    userId,
    gameTypeId: betData.gameTypeId,
    stage: betData.stage,
    betAmount: betData.betAmount,
    potentialWin: betData.potentialWin,
    fee: betData.fee,
    selection: betData.selection,
    betType,
  });

  // Distribute commission if turnover meets minimum
  if (betData.betAmount >= MINIMUM_TURNOVER_FOR_COMMISSION) {
    await distributeCommission(db, userId, betData.betAmount);
  }

  return bet;
};

/**
 * Generate bet confirmation HTML
 */
export const generateBetConfirmation = (
  selection: string,
  period: string,
  formatTime: string
): string => {
  return generateBetHTML(selection, period, formatTime);
};
