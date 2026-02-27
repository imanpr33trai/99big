import { Pool } from "mysql2/promise";
import {
  create5DSession,
  get5DControlSettings,
  getCurrent5DSession,
  update5DResult,
} from "../../../db";
import { generate5DResult } from "../../../utils/";
import { process5DPayouts } from "./5dPayout.service";
import { process5DResults } from "./5dResult.service";

/**
 * Handle 5D game cycle
 * @param db
 * @param typeId
 * @returns
 */

export const handle5DGame = async (db: Pool, typeId: number): Promise<void> => {
  // Get current session
  const session = await getCurrent5DSession(db, typeId);

  if (!session) {
    // Initialize new game
    await add5DPeriod(db, typeId);
    return;
  }

  // If session is closed but no result, generate result
  if (session.status === 2 && !session.result) {
    const result = (await getPredefinedResult(db, typeId)) || generate5DResult();

    // Update result
    await update5DResult(db, session.period, result, typeId);

    // Process results
    await process5DResults(db, session.id, result);

    // Process payouts
    await process5DPayouts(db, session.id, result);

    // Create new period
    await add5DPeriod(db, typeId);
  }
};

/**
 * Add new 5D period
 * @param db
 * @param game
 */

export const add5DPeriod = async (db: Pool, game: number): Promise<void> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

  // Get last period number
  const [rows] = await db.execute(
    `SELECT period FROM gameSessions
     WHERE gameTypeId = ? AND period LIKE ?
     ORDER BY id DESC LIMIT 1`,
    [2, `${dateStr}%`],
  );

  let periodNumber = 1;
  if ((rows as any[]).length > 0) {
    const lastPeriod = (rows as any[])[0].period;
    const lastNum = parseInt(lastPeriod.slice(-3), 10);
    periodNumber = lastNum + 1;
  }

  const period = `${dateStr}${String(periodNumber).padStart(3, "0")}`;
  await create5DSession(db, period, game);
};

/**
 * Get predefined result from admin settings
 * @param db
 * @param game
 * @returns
 */

export const getPredefinedResult = async (db: Pool, game: number): Promise<string | null> => {
  const settings = await get5DControlSettings(db, game);

  if (!settings) return null;

  const parts = settings.split("|");
  if (parts.length === 0) return null;

  const nextResult = parts[0];

  if (nextResult === "-1") return null;

  // Update settings (remove used result)
  const newSettings = parts.slice(1).join("|") || "-1";
  await update5DControlSettings(db, game, newSettings);

  return nextResult;
};
