import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CommissionLevel, K3BetRecord, K3GameSession, ReferrerInfo } from "src/types/k3.types";

export const getCommissionLevels = async (db: Pool): Promise<CommissionLevel> => {
  const [rows] = await db.execute(
    "SELECT level, rateF1, rateF2, rateF3, rateF4 FROM commissionLevels ORDER BY level ASC LIMIT 1",
    [],
  );
  return (
    (rows as CommissionLevel[])[0] || {
      level: 0,
      rateF1: 0,
      rateF2: 0,
      rateF3: 0,
      rateF4: 0,
    }
  );
};

export const findUserByToken = async (
  db: Pool,
  token: string,
): Promise<{ phone: string; referralCode: string; invitedBy: string } | null> => {
  const [rows] = await db.execute(
    "SELECT phone, referralCode, invitedBy FROM users WHERE authToken = ? AND isVerified = TRUE LIMIT 1",
    [token],
  );
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

export const findReferrerByCode = async (db: Pool, code: string): Promise<ReferrerInfo | null> => {
  const [rows] = await db.execute(
    "SELECT phone, referralCode, invitedBy, rank FROM users WHERE referralCode = ? AND isVerified = TRUE LIMIT 1",
    [code],
  );
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

export const distributeCommissionToUser = async (
  db: Pool,
  phone: string,
  amount: number,
  isF1: boolean,
): Promise<void> => {
  if (isF1) {
    // F1 gets special tracking (commissionF1)
    await db.execute(
      `UPDATE users
       SET balance = balance + ?,
           commissionF1 = commissionF1 + ?,
           commissionF = commissionF + ?,
           commissionToday = commissionToday + ?,
           updatedAt = ?
       WHERE phone = ?`,
      [amount, amount, amount, amount, Date.now(), phone],
    );
  } else {
    // F2-F4 get standard tracking
    await db.execute(
      `UPDATE users
       SET balance = balance + ?,
           commissionF = commissionF + ?,
           commissionToday = commissionToday + ?,
           updatedAt = ?
       WHERE phone = ?`,
      [amount, amount, amount, Date.now(), phone],
    );
  }
};

export const logCommissionDistribution = async (
  db: Pool,
  userId: number,
  fromUserId: number,
  level: number,
  amount: number,
  sourceType: string,
): Promise<void> => {
  await db.execute(
    `INSERT INTO commissionRecords
     (userId, fromUserId, level, amount, sourceType, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, fromUserId, level, amount, sourceType, Date.now()],
  );
};

// ============================================================================
// SESSION QUERIES
// ============================================================================

export const getCurrentK3Session = async (
  db: Pool,
  duration: number,
): Promise<K3GameSession | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, period, gameTypeId, result, status, startedAt, closedAt, resultAt
     FROM gameSessions
     WHERE gameTypeId = (SELECT id FROM gameTypes WHERE code = 'k3')
     AND duration = ?
     AND status = 'open'
     ORDER BY startedAt DESC
     LIMIT 1`,
    [duration],
  );
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

export const getK3SessionByPeriod = async (
  db: Pool,
  period: string,
): Promise<K3GameSession | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, period, gameTypeId, result, status, startedAt, closedAt, resultAt
     FROM gameSessions
     WHERE period = ? AND gameTypeId = (SELECT id FROM gameTypes WHERE code = 'k3')
     LIMIT 1`,
    [period],
  );
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

// ============================================================================
// BET QUERIES
// ============================================================================

export const createK3Bet = async (db: Pool, bet: Omit<K3BetRecord, "id">): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO bets
     (sessionId, userId, gameTypeId, joinType, betSelections, multiplier,
      betAmount, totalAmount, potentialWin, status, createdAt)
     VALUES (?, ?, (SELECT id FROM gameTypes WHERE code = 'k3'), ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    [
      bet.sessionId,
      bet.userId,
      bet.joinType,
      JSON.stringify(bet.betSelections),
      bet.multiplier,
      bet.betAmount,
      bet.totalAmount,
      bet.potentialWin,
      bet.createdAt,
    ],
  );
  return result.insertId;
};

export const getUserK3Bets = async (
  db: Pool,
  userId: number,
  limit: number = 20,
): Promise<K3BetRecord[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT b.*, gs.period, gs.result
     FROM bets b
     JOIN gameSessions gs ON b.sessionId = gs.id
     WHERE b.userId = ? AND b.gameTypeId = (SELECT id FROM gameTypes WHERE code = 'k3')
     ORDER BY b.createdAt DESC
     LIMIT ?`,
    [userId, limit],
  );
  return rows as K3BetRecord[];
};

export const getK3BetById = async (db: Pool, betId: number): Promise<K3BetRecord | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT b.*, gs.period, gs.result
     FROM bets b
     JOIN gameSessions gs ON b.sessionId = gs.id
     WHERE b.id = ? AND b.gameTypeId = (SELECT id FROM gameTypes WHERE code = 'k3')
     LIMIT 1`,
    [betId],
  );
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

// ============================================================================
// LEGACY SUPPORT (for migration)
// ============================================================================

export const createLegacyK3Bet = async (db: Pool, betData: any): Promise<void> => {
  await db.execute(
    `INSERT INTO k3Bets
     (productId, userId, referralCode, invitedBy, stage, userLevel,
      betAmount, odds, quantity, fee, winAmount, game, joinBet,
      gameType, bet, result, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      betData.productId,
      betData.userId,
      betData.referralCode,
      betData.invitedBy,
      betData.stage,
      betData.userLevel,
      betData.betAmount,
      betData.odds,
      betData.quantity,
      betData.fee,
      betData.winAmount,
      betData.game,
      betData.joinBet,
      betData.gameType,
      betData.bet,
      betData.result,
      betData.status,
      betData.createdAt,
    ],
  );
};

// Add to existing file

export const getK3CurrentSession = async (
  db: Pool,
  game: number,
): Promise<{ period: string } | null> => {
  const [rows] = await db.execute(
    `SELECT period FROM k3Games
     WHERE status = 0 AND game = ?
     ORDER BY id DESC LIMIT 1`,
    [game],
  );
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

export const getUserBalanceByToken = async (
  db: Pool,
  token: string,
): Promise<{
  phone: string;
  referralCode: string;
  invitedBy: string;
  userLevel: number;
  balance: number;
} | null> => {
  const [rows] = await db.execute(
    `SELECT phone, referralCode, invitedBy, userLevel, balance
     FROM users
     WHERE authToken = ? AND isVerified = TRUE
     LIMIT 1`,
    [token],
  );
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

export const createK3Bet = async (
  db: Pool,
  bet: {
    idProduct: string;
    phone: string;
    code: string;
    invitedBy: string;
    stage: string;
    level: number;
    money: number;
    price: number;
    amount: number;
    fee: number;
    game: number;
    joinBet: number;
    typeGame: string;
    bet: string;
    status: number;
    time: number;
  },
): Promise<void> => {
  await db.execute(
    `INSERT INTO k3Bets
     (idProduct, phone, code, invitedBy, stage, level, money, price,
      amount, fee, game, joinBet, typeGame, bet, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      bet.idProduct,
      bet.phone,
      bet.code,
      bet.invitedBy,
      bet.stage,
      bet.level,
      bet.money,
      bet.price,
      bet.amount,
      bet.fee,
      bet.game,
      bet.joinBet,
      bet.typeGame,
      bet.bet,
      bet.status,
      bet.time,
    ],
  );
};

export const updateUserBalance = async (db: Pool, token: string, amount: number): Promise<void> => {
  await db.execute("UPDATE users SET balance = balance + ? WHERE authToken = ?", [amount, token]);
};

// Add to existing k3.queries.ts

export const getK3CurrentPeriod = async (
  db: Pool,
  game: number,
): Promise<{ period: string } | null> => {
  const [rows] = await db.query(
    `SELECT period FROM k3 WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1`,
    [game],
  );
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

export const getAdminK3Settings = async (db: Pool): Promise<any | null> => {
  const [rows] = await db.query("SELECT * FROM `admin` LIMIT 1");
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

export const updateK3Result = async (
  db: Pool,
  game: number,
  period: string,
  result: string,
  status: number,
): Promise<void> => {
  await db.execute(`UPDATE k3 SET result = ?, status = ? WHERE period = ? AND game = ?`, [
    result,
    status,
    period,
    game,
  ]);
};

export const createK3Period = async (
  db: Pool,
  period: number,
  game: number,
  time: number,
): Promise<void> => {
  await db.execute(`INSERT INTO k3 (period, result, game, status, time) VALUES (?, ?, ?, ?, ?)`, [
    period,
    0,
    game,
    0,
    time,
  ]);
};

export const updateAdminK3Setting = async (db: Pool, key: string, value: string): Promise<void> => {
  await db.execute(`UPDATE admin SET ${key} = ?`, [value]);
};

export const getUserByToken = async (db: Pool, token: string): Promise<any | null> => {
  const [rows] = await db.execute(
    "SELECT phone, referralCode, invitedBy, userLevel, balance FROM users WHERE authToken = ? AND isVerified = TRUE LIMIT 1",
    [token],
  );
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

export const getUserBets = async (
  db: Pool,
  phone: string,
  game: number,
  offset: number,
  limit: number,
): Promise<any[]> => {
  const [rows] = await db.execute(
    `SELECT * FROM result_k3
     WHERE phone = ? AND game = ?
     ORDER BY id DESC
     LIMIT ?, ?`,
    [phone, game, offset, limit],
  );
  return rows as any[];
};

export const countUserBets = async (db: Pool, phone: string, game: number): Promise<number> => {
  const [rows] = await db.execute(
    `SELECT COUNT(*) as total FROM result_k3 WHERE phone = ? AND game = ?`,
    [phone, game],
  );
  return (rows as any[])[0]?.total || 0;
};
