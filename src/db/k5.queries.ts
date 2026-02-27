import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { K5DBetRecord, K5DCommissionLevel, K5DGameSession } from "../types";

// Game Session Queries

export const getCurrent5DSession = async (
  db: Pool,
  game: number,
): Promise<K5DGameSession | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, period, gameTypeId, result, status, startedAt, closedAt, resultAt
     FROM gameSessions
     WHERE gameTypeId = ? AND status IN (0, 1)
     ORDER BY id DESC LIMIT 1`,
    [2], // gameTypeId for 5D is 2
  );

  return rows.length > 0 ? (rows[0] as K5DGameSession) : null;
};

export const getLatest5DResult = async (db: Pool, game: number): Promise<K5DGameSession | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, period, gameTypeId, result, status, startedAt, closedAt, resultAt
     FROM gameSessions
     WHERE gameTypeId = ? AND result IS NOT NULL
     ORDER BY id DESC LIMIT 1`,
    [2],
  );

  return rows.length > 0 ? (rows[0] as K5DGameSession) : null;
};

export const create5DSession = async (db: Pool, period: string, game: number): Promise<number> => {
  const now = Date.now();
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO gameSessions (period, gameTypeId, result, status, startedAt, closedAt, resultAt, createdAt)
     VALUES (?, ?, NULL, 1, ?, NULL, NULL, ?)`,
    [period, 2, now, now],
  );

  return result.insertId;
};

export const update5DResult = async (
  db: Pool,
  period: string,
  result: string,
  game: number,
): Promise<void> => {
  const now = Date.now();
  await db.execute(
    `UPDATE gameSessions
     SET result = ?, status = 3, resultAt = ?
     WHERE period = ? AND gameTypeId = ?`,
    [result, now, period, 2],
  );
};

export const get5DHistory = async (
  db: Pool,
  game: number,
  page: number,
  limit: number,
): Promise<K5DGameSession[]> => {
  const offset = page - limit;
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, period, gameTypeId, result, status, startedAt, closedAt, resultAt
     FROM gameSessions
     WHERE gameTypeId = ? AND result IS NOT NULL
     ORDER BY id DESC
     LIMIT ? OFFSET ?`,
    [2, limit, offset],
  );

  return rows as K5DGameSession[];
};

export const initialize5DGame = async (db: Pool, game: number): Promise<void> => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const period = `${today}001`;

  const [existing] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM gameSessions WHERE gameTypeId = ? AND period = ?",
    [2, period],
  );

  if (existing.length === 0) {
    await create5DSession(db, period, game);
  }
};

// Bet Queries

export const create5DBet = async (
  db: Pool,
  betData: {
    sessionId: number;
    userId: number;
    gameTypeId: number;
    stage: number;
    betAmount: number;
    potentialWin: number;
    fee: number;
    selection: string;
    betType: string;
  },
): Promise<number> => {
  const now = Date.now();
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO bets (sessionId, userId, gameTypeId, stage, betAmount, potentialWin, fee, actualWin,
                       selection, betType, result, isWin, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NULL, NULL, 0, ?)`,
    [
      betData.sessionId,
      betData.userId,
      betData.gameTypeId,
      betData.stage,
      betData.betAmount,
      betData.potentialWin,
      betData.fee,
      betData.selection,
      betData.betType,
      now,
    ],
  );

  return result.insertId;
};

export const getUser5DBets = async (
  db: Pool,
  userId: number,
  game: number,
  page: number,
  limit: number,
): Promise<Partial<K5DBetRecord>[]> => {
  const offset = page - limit;
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT b.id, b.sessionId, b.stage, b.betAmount, b.potentialWin, b.fee,
            b.actualWin, b.selection, b.betType, b.result, b.isWin, b.status, b.createdAt,
            gs.period
     FROM bets b
     JOIN gameSessions gs ON b.sessionId = gs.id
     WHERE b.userId = ? AND b.gameTypeId = ?
     ORDER BY b.id DESC
     LIMIT ? OFFSET ?`,
    [userId, 2, limit, offset],
  );

  return rows as Partial<K5DBetRecord>[];
};

export const getPending5DBets = async (db: Pool, sessionId: number): Promise<K5DBetRecord[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, sessionId, userId, gameTypeId, stage, betAmount, potentialWin, fee,
            actualWin, selection, betType, result, isWin, status, createdAt
     FROM bets
     WHERE sessionId = ? AND status = 0`,
    [sessionId],
  );

  return rows as K5DBetRecord[];
};

export const update5DBetStatus = async (
  db: Pool,
  betId: number,
  status: number,
  winAmount: number = 0,
  isWin: boolean = false,
): Promise<void> => {
  await db.execute(
    `UPDATE bets
     SET status = ?, actualWin = ?, isWin = ?
     WHERE id = ?`,
    [status, winAmount, isWin, betId],
  );
};

export const update5DBetsByPeriod = async (
  db: Pool,
  period: string,
  result: string,
): Promise<void> => {
  await db.execute(
    `UPDATE bets b
     JOIN gameSessions gs ON b.sessionId = gs.id
     SET b.result = ?
     WHERE gs.period = ? AND b.gameTypeId = ?`,
    [result, period, 2],
  );
};

// Commission Queries

export const getCommissionRates = async (
  db: Pool,
  level: number,
): Promise<K5DCommissionLevel | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT id, level, rateF1, rateF2, rateF3, rateF4 FROM commissionLevels WHERE level = ?",
    [level],
  );

  return rows.length > 0 ? (rows[0] as K5DCommissionLevel) : null;
};

export const createCommissionRecord = async (
  db: Pool,
  data: {
    userId: number;
    fromUserId: number;
    level: number;
    amount: number;
    sourceType: string;
    sourceId: number;
  },
): Promise<void> => {
  const now = Date.now();
  await db.execute(
    `INSERT INTO commissionRecords (userId, fromUserId, level, amount, sourceType, sourceId, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.userId, data.fromUserId, data.level, data.amount, data.sourceType, data.sourceId, now],
  );
};

export const getReferrerChain = async (
  db: Pool,
  userId: number,
): Promise<Array<{ id: number; level: number }>> => {
  const chain: Array<{ id: number; level: number }> = [];
  let currentId = userId;
  let currentLevel = 0;

  while (currentLevel < 4) {
    const [rows] = await db.execute<RowDataPacket[]>("SELECT invitedBy FROM users WHERE id = ?", [
      currentId,
    ]);

    if (rows.length === 0 || !rows[0].invitedBy) break;

    currentId = rows[0].invitedBy;
    currentLevel++;
    chain.push({ id: currentId, level: currentLevel });
  }

  return chain;
};

// Settings Queries

export const get5DControlSettings = async (db: Pool, game: number): Promise<string | null> => {
  const configKey = `5d${game}_control`;
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT configValue FROM adminConfigs WHERE configKey = ?",
    [configKey],
  );

  return rows.length > 0 ? rows[0].configValue : null;
};

export const update5DControlSettings = async (
  db: Pool,
  game: number,
  value: string,
): Promise<void> => {
  const configKey = `5d${game}_control`;
  const now = Date.now();

  await db.execute(
    `INSERT INTO adminConfigs (configKey, configValue, description, updatedAt)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE configValue = ?, updatedAt = ?`,
    [configKey, value, `5D ${game} minute game control`, now, value, now],
  );
};

// Helper Functions

export const calculate5DTotal = (result: string): number => {
  return result.split("").reduce((sum, digit) => sum + parseInt(digit, 10), 0);
};

export const parse5DResult = (result: string): string[] => {
  return result.split("");
};
