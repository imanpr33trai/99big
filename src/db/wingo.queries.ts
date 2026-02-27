import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  TurnoverRecord,
  User,
  UserCommissionLevel,
  WingoBetRecord,
  WingoGameSession,
} from "../types";
import { getTodayString } from "../utils/";

export const getBetsByUsersDaily = async (
  db: Pool,
  userIds: number[],
  startDate?: Date,
  endDate?: Date,
): Promise<any[]> => {
  if (userIds.length === 0) return [];

  const placeholders = userIds.map(() => "?").join(",");
  let query = `SELECT id, userId, game, amount, result, winAmount, status, createdAt FROM bets WHERE userId IN (${placeholders})`;
  const params: (number | Date)[] = [...userIds];

  if (startDate && endDate) {
    query += ` AND createdAt BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  const [rows] = await db.execute<RowDataPacket[]>(query, params);
  return rows as any[];
};

// ============================================================================
// GAME SESSION QUERIES
// ============================================================================

export const getCurrentWingoSession = async (
  db: Pool,
  game: string,
): Promise<WingoGameSession | null> => {
  const gameTypeMap: Record<string, number> = {
    wingo: 1,
    wingo3: 3,
    wingo5: 5,
    wingo10: 10,
  };

  const gameTypeId = gameTypeMap[game] || 1;

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM gameSessions
     WHERE gameTypeId = ? AND status = 1
     ORDER BY startedAt DESC
     LIMIT 1`,
    [gameTypeId],
  );

  if (rows.length === 0) return null;

  return rows[0] as WingoGameSession;
};

export const getLatestWingoResult = async (
  db: Pool,
  game: string,
): Promise<WingoGameSession | null> => {
  const gameTypeMap: Record<string, number> = {
    wingo: 1,
    wingo3: 3,
    wingo5: 5,
    wingo10: 10,
  };

  const gameTypeId = gameTypeMap[game] || 1;

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM gameSessions
     WHERE gameTypeId = ? AND status = 3 AND result IS NOT NULL
     ORDER BY resultAt DESC
     LIMIT 1`,
    [gameTypeId],
  );

  if (rows.length === 0) return null;

  return rows[0] as WingoGameSession;
};

export const createWingoSession = async (
  db: Pool,
  period: number,
  game: string,
): Promise<WingoGameSession> => {
  const gameTypeMap: Record<string, number> = {
    wingo: 1,
    wingo3: 3,
    wingo5: 5,
    wingo10: 10,
  };

  const gameTypeId = gameTypeMap[game] || 1;
  const now = Date.now();

  // Calculate close time based on game type
  const durationMinutes = parseInt(game.replace("wingo", "")) || 1;
  const closedAt = now + durationMinutes * 60 * 1000;

  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO gameSessions
     (period, gameTypeId, result, amount, status, startedAt, closedAt, resultAt, createdAt)
     VALUES (?, ?, NULL, 0, 1, ?, ?, NULL, ?)`,
    [String(period), gameTypeId, now, closedAt, now],
  );

  return {
    id: result.insertId,
    period: String(period),
    gameTypeId,
    result: null,
    amount: 0,
    status: 1,
    startedAt: now,
    closedAt,
    resultAt: null,
    createdAt: now,
  };
};

export const updateWingoResult = async (
  db: Pool,
  period: string,
  amount: number,
  game: string,
): Promise<void> => {
  const gameTypeMap: Record<string, number> = {
    wingo: 1,
    wingo3: 3,
    wingo5: 5,
    wingo10: 10,
  };

  const gameTypeId = gameTypeMap[game] || 1;
  const now = Date.now();

  await db.execute(
    `UPDATE gameSessions
     SET result = ?, amount = ?, status = 3, resultAt = ?
     WHERE period = ? AND gameTypeId = ?`,
    [String(amount), amount, now, period, gameTypeId],
  );
};

export const closeWingoSession = async (db: Pool, period: string, game: string): Promise<void> => {
  const gameTypeMap: Record<string, number> = {
    wingo: 1,
    wingo3: 3,
    wingo5: 5,
    wingo10: 10,
  };

  const gameTypeId = gameTypeMap[game] || 1;
  const now = Date.now();

  await db.execute(
    `UPDATE gameSessions
     SET status = 2, closedAt = ?
     WHERE period = ? AND gameTypeId = ? AND status = 1`,
    [now, period, gameTypeId],
  );
};

export const getWingoHistory = async (
  db: Pool,
  game: string,
  page: number,
  limit: number,
): Promise<WingoGameSession[]> => {
  const gameTypeMap: Record<string, number> = {
    wingo: 1,
    wingo3: 3,
    wingo5: 5,
    wingo10: 10,
  };

  const gameTypeId = gameTypeMap[game] || 1;
  const offset = page * limit;

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM gameSessions
     WHERE gameTypeId = ? AND status = 3
     ORDER BY resultAt DESC
     LIMIT ? OFFSET ?`,
    [gameTypeId, limit, offset],
  );

  return rows as WingoGameSession[];
};

// ============================================================================
// BET QUERIES
// ============================================================================

export const createWingoBet = async (
  db: Pool,
  betData: {
    sessionId: number;
    userId: number;
    gameTypeId: number;
    stage: string;
    betAmount: number;
    potentialWin: number;
    fee: number;
    selection: string;
    betType: string;
  },
): Promise<WingoBetRecord> => {
  const now = Date.now();

  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO bets
     (sessionId, userId, gameTypeId, stage, betAmount, potentialWin, fee, actualWin,
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

  return {
    id: result.insertId,
    sessionId: betData.sessionId,
    userId: betData.userId,
    gameTypeId: betData.gameTypeId,
    stage: parseInt(betData.stage),
    betAmount: betData.betAmount,
    potentialWin: betData.potentialWin,
    fee: betData.fee,
    actualWin: 0,
    selection: betData.selection,
    betType: betData.betType,
    result: null,
    isWin: null,
    status: 0,
    createdAt: now,
  };
};

export const getUserWingoBets = async (
  db: Pool,
  userId: number,
  game: string,
  page: number,
  limit: number,
): Promise<WingoBetRecord[]> => {
  const gameTypeMap: Record<string, number> = {
    wingo: 1,
    wingo3: 3,
    wingo5: 5,
    wingo10: 10,
  };

  const gameTypeId = gameTypeMap[game] || 1;
  const offset = page * limit;

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM bets
     WHERE userId = ? AND gameTypeId = ?
     ORDER BY createdAt DESC
     LIMIT ? OFFSET ?`,
    [userId, gameTypeId, limit, offset],
  );

  return rows as WingoBetRecord[];
};

export const getPendingWingoBets = async (db: Pool, game: string): Promise<WingoBetRecord[]> => {
  const gameTypeMap: Record<string, number> = {
    wingo: 1,
    wingo3: 3,
    wingo5: 5,
    wingo10: 10,
  };

  const gameTypeId = gameTypeMap[game] || 1;

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT b.* FROM bets b
     JOIN gameSessions gs ON b.sessionId = gs.id
     WHERE gs.gameTypeId = ? AND b.status = 0 AND gs.status = 2`,
    [gameTypeId],
  );

  return rows as WingoBetRecord[];
};

export const getPendingBetsByPeriod = async (
  db: Pool,
  period: string,
  game: string,
): Promise<WingoBetRecord[]> => {
  const gameTypeMap: Record<string, number> = {
    wingo: 1,
    wingo3: 3,
    wingo5: 5,
    wingo10: 10,
  };

  const gameTypeId = gameTypeMap[game] || 1;

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM bets
     WHERE stage = ? AND gameTypeId = ? AND status = 0`,
    [period, gameTypeId],
  );

  return rows as WingoBetRecord[];
};

export const updateWingoBetStatus = async (
  db: Pool,
  betId: number,
  status: number,
  winAmount?: number,
  result?: string,
  isWin?: boolean,
): Promise<void> => {
  const updates: string[] = ["status = ?"];
  const values: (number | string | boolean | null)[] = [status];

  if (winAmount !== undefined) {
    updates.push("actualWin = ?");
    values.push(winAmount);
  }

  if (result !== undefined) {
    updates.push("result = ?");
    values.push(result);
  }

  if (isWin !== undefined) {
    updates.push("isWin = ?");
    values.push(isWin);
  }

  values.push(betId);

  await db.execute(`UPDATE bets SET ${updates.join(", ")} WHERE id = ?`, values);
};

export const updateWingoBetsByPeriod = async (
  db: Pool,
  period: string,
  game: string,
  result: number,
): Promise<void> => {
  const gameTypeMap: Record<string, number> = {
    wingo: 1,
    wingo3: 3,
    wingo5: 5,
    wingo10: 10,
  };

  const gameTypeId = gameTypeMap[game] || 1;

  await db.execute(
    `UPDATE bets
     SET result = ?, isWin = FALSE, status = 2
     WHERE stage = ? AND gameTypeId = ? AND status = 0`,
    [String(result), period, gameTypeId],
  );
};

export const getWinningBets = async (
  db: Pool,
  period: string,
  game: string,
): Promise<WingoBetRecord[]> => {
  const gameTypeMap: Record<string, number> = {
    wingo: 1,
    wingo3: 3,
    wingo5: 5,
    wingo10: 10,
  };

  const gameTypeId = gameTypeMap[game] || 1;

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM bets
     WHERE stage = ? AND gameTypeId = ? AND status = 0 AND isWin = TRUE`,
    [period, gameTypeId],
  );

  return rows as WingoBetRecord[];
};

// ============================================================================
// USER QUERIES
// ============================================================================

export const findUserByToken = async (db: Pool, token: string): Promise<User | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE authToken = ? AND status = 0 LIMIT 1",
    [token],
  );

  if (rows.length === 0) return null;

  return rows[0] as User;
};

export const findUserById = async (db: Pool, userId: number): Promise<User | null> => {
  const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [
    userId,
  ]);

  if (rows.length === 0) return null;

  return rows[0] as User;
};

export const updateUserBalance = async (
  db: Pool,
  userId: number,
  amount: number,
): Promise<void> => {
  await db.execute("UPDATE users SET balance = balance + ?, updatedAt = ? WHERE id = ?", [
    amount,
    Date.now(),
    userId,
  ]);
};

export const getUserCommissionLevel = async (db: Pool, userId: number): Promise<number> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT cl.level
     FROM users u
     JOIN commissionLevels cl ON u.userLevel = cl.level
     WHERE u.id = ?`,
    [userId],
  );

  if (rows.length === 0) return 0;

  return (rows[0] as { level: number }).level;
};

export const updateUserTotalMoney = async (
  db: Pool,
  userId: number,
  amount: number,
): Promise<void> => {
  await db.execute("UPDATE users SET totalMoney = totalMoney + ?, updatedAt = ? WHERE id = ?", [
    amount,
    Date.now(),
    userId,
  ]);
};

export const getReferrerChain = async (
  db: Pool,
  userId: number,
): Promise<Array<{ id: number; level: number; userLevel: number }>> => {
  const chain: Array<{ id: number; level: number; userLevel: number }> = [];
  let currentId = userId;
  let level = 0;

  while (level < 4) {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT id, invitedBy, userLevel FROM users WHERE id = ?",
      [currentId],
    );

    if (rows.length === 0) break;

    const user = rows[0] as { id: number; invitedBy: number | null; userLevel: number };

    if (user.invitedBy === null) break;

    level++;
    chain.push({
      id: user.invitedBy,
      level,
      userLevel: user.userLevel,
    });

    currentId = user.invitedBy;
  }

  return chain;
};

// ============================================================================
// COMMISSION QUERIES
// ============================================================================

export const getCommissionRates = async (db: Pool): Promise<UserCommissionLevel[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM commissionLevels ORDER BY level ASC",
  );

  return rows as UserCommissionLevel[];
};

export const getCommissionRateByLevel = async (
  db: Pool,
  level: number,
): Promise<UserCommissionLevel | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM commissionLevels WHERE level = ? LIMIT 1",
    [level],
  );

  if (rows.length === 0) return null;

  return rows[0] as UserCommissionLevel;
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
  await db.execute(
    `INSERT INTO commissionRecords
     (userId, fromUserId, level, amount, sourceType, sourceId, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.userId,
      data.fromUserId,
      data.level,
      data.amount,
      data.sourceType,
      data.sourceId,
      Date.now(),
    ],
  );
};

export const getOrCreateTurnoverRecord = async (
  db: Pool,
  userId: number,
): Promise<TurnoverRecord> => {
  const today = getTodayString();

  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM turnoverRecords WHERE userId = ? AND recordDate = ?",
    [userId, today],
  );

  if (rows.length > 0) {
    return rows[0] as TurnoverRecord;
  }

  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO turnoverRecords
     (userId, dailyTurnover, totalTurnover, recordDate, updatedAt)
     VALUES (?, 0, 0, ?, ?)`,
    [userId, today, Date.now()],
  );

  return {
    id: result.insertId,
    userId,
    dailyTurnover: 0,
    totalTurnover: 0,
    recordDate: today,
    updatedAt: Date.now(),
  };
};

export const updateTurnoverRecord = async (
  db: Pool,
  userId: number,
  amount: number,
): Promise<void> => {
  const today = getTodayString();

  await db.execute(
    `UPDATE turnoverRecords
     SET dailyTurnover = dailyTurnover + ?,
         totalTurnover = totalTurnover + ?,
         updatedAt = ?
     WHERE userId = ? AND recordDate = ?`,
    [amount, amount, Date.now(), userId, today],
  );
};

// ============================================================================
// SETTINGS QUERIES
// ============================================================================

export const getWingoControlSettings = async (db: Pool, game: string): Promise<string | null> => {
  const configKey = `${game}_control`;

  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT configValue FROM adminConfigs WHERE configKey = ?",
    [configKey],
  );

  if (rows.length === 0) return null;

  return (rows[0] as { configValue: string }).configValue;
};

export const updateWingoControlSettings = async (
  db: Pool,
  game: string,
  value: string,
): Promise<void> => {
  const configKey = `${game}_control`;

  await db.execute(
    `INSERT INTO adminConfigs (configKey, configValue, updatedAt)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE configValue = ?, updatedAt = ?`,
    [configKey, value, Date.now(), value, Date.now()],
  );
};

export const getWinRateSettings = async (db: Pool, game: string): Promise<number> => {
  const configKey = `bs${game.replace("wingo", "")}`;

  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT configValue FROM adminConfigs WHERE configKey = ?",
    [configKey],
  );

  if (rows.length === 0) return 0;

  const value = parseInt((rows[0] as { configValue: string }).configValue);
  return isNaN(value) ? 0 : value;
};
