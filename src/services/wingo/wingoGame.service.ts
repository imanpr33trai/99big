import { Pool } from 'mysql2/promise';
import {
  getCurrentWingoSession,
  getLatestWingoResult,
  createWingoSession,
  updateWingoResult,
  closeWingoSession,
  getPendingWingoBets,
  getWingoControlSettings,
  updateWingoControlSettings,
} from '../../db/wingo.queries';
import { calculateSmartAmount, getSmartResult } from './wingoResult.service';
import { processWingoPayouts } from './wingoPayout.service';
import { formatPeriod, parsePredefinedResults, getNextPredefinedResult } from '../../utils/wingo.helpers';

/**
 * Handle Wingo game cycle
 */
export const handleWingoGame = async (
  db: Pool,
  typeId: number
): Promise<void> => {
  const gameMap: Record<number, string> = {
    1: 'wingo',
    3: 'wingo3',
    5: 'wingo5',
    10: 'wingo10',
  };

  const game = gameMap[typeId];
  if (!game) throw new Error(`Invalid game type: ${typeId}`);

  // Get current session
  const currentSession = await getCurrentWingoSession(db, game);

  if (!currentSession) {
    // No active session, create one
    await addWingoPeriod(db, typeId);
    return;
  }

  // Check if session should be closed
  const now = Date.now();
  if (currentSession.closedAt && now >= currentSession.closedAt && currentSession.status === 1) {
    // Close the session
    await closeWingoSession(db, currentSession.period, game);

    // Generate result and process
    await addWingoPeriod(db, typeId);
  }
};

/**
 * Add new Wingo period and close previous
 */
export const addWingoPeriod = async (
  db: Pool,
  game: number
): Promise<void> => {
  const gameMap: Record<number, string> = {
    1: 'wingo',
    3: 'wingo3',
    5: 'wingo5',
    10: 'wingo10',
  };

  const gameName = gameMap[game];
  if (!gameName) throw new Error(`Invalid game type: ${game}`);

  // Get current session to close
  const currentSession = await getCurrentWingoSession(db, gameName);

  if (currentSession) {
    // Close current session
    await closeWingoSession(db, currentSession.period, gameName);

    // Generate result for closed session
    const result = await getSmartResult(db, gameName, currentSession.period);

    // Update with result
    await updateWingoResult(db, currentSession.period, result, gameName);

    // Process payouts
    await processWingoPayouts(db, gameName, currentSession.period, result);
  }

  // Generate new period number
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');

  // Get latest result to determine next period
  const latestResult = await getLatestWingoResult(db, gameName);
  let nextPeriod: number;

  if (latestResult) {
    const latestPeriodNum = parseInt(latestResult.period);
    // Check if same day
    const latestDateStr = String(latestPeriodNum).substring(0, 8);
    if (latestDateStr === dateStr) {
      nextPeriod = latestPeriodNum + 1;
    } else {
      nextPeriod = parseInt(dateStr + '001');
    }
  } else {
    nextPeriod = parseInt(dateStr + '001');
  }

  // Create new session
  await createWingoSession(db, nextPeriod, gameName);
};

/**
 * Get predefined result from admin settings
 */
export const getPredefinedResult = async (
  db: Pool,
  game: string
): Promise<string | null> => {
  const settings = await getWingoControlSettings(db, game);
  return settings;
};

/**
 * Calculate smart amount (alias for calculateSmartAmount)
 */
export const calculateSmartAmountForGame = async (
  db: Pool,
  game: string
): Promise<number> => {
  const currentSession = await getCurrentWingoSession(db, game);
  if (!currentSession) return generateRandomResult();

  return await calculateSmartAmount(db, game, currentSession.period);
};

/**
 * Generate random result 0-9
 */
export const generateRandomResult = (): number => {
  return Math.floor(Math.random() * 10);
};
