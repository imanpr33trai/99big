import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { K3BetRecord, K3GameSession } from "../types/k3.types";
import { updateUserBalance } from "./daily.queries";

// ==========================================
// GAME SESSION QUERIES
// ==========================================

export const getCurrentK3Session = async (
  db: Pool,
  game: number,
): Promise<K3GameSession | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM k3Games WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1",
    [game],
  );
  return rows[0] as K3GameSession | null;
};

export const getLatestK3Result = async (db: Pool, game: number): Promise<K3GameSession | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM k3Games WHERE status != 0 AND game = ? ORDER BY id DESC LIMIT 1",
    [game],
  );
  return rows[0] as K3GameSession | null;
};

export const createK3Session = async (db: Pool, period: number, game: number): Promise<void> => {
  await db.execute(
    "INSERT INTO k3Games SET period = ?, result = ?, game = ?, status = ?, time = ?",
    [period, "0", game, 0, Date.now()],
  );
};

export const updateK3Result = async (
  db: Pool,
  period: string,
  result: string,
  game: number,
): Promise<void> => {
  await db.execute("UPDATE k3Games SET result = ?, status = ? WHERE period = ? AND game = ?", [
    result,
    1,
    period,
    game,
  ]);
};

export const getK3History = async (
  db: Pool,
  game: number,
  page: number,
  limit: number,
): Promise<K3GameSession[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM k3Games WHERE status != 0 AND game = ? ORDER BY id DESC LIMIT ?, ?",
    [game, page, limit],
  );
  return rows as K3GameSession[];
};

// ==========================================
// BET QUERIES
// ==========================================

export const createK3Bet = async (db: Pool, data: Partial<K3BetRecord>): Promise<K3BetRecord> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO k3Bets
     (productId, userId, referralCode, invitedBy, stage, userLevel, betAmount, odds, quantity, fee, winAmount, game, joinBet, gameType, bet, result, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.productId || 0,
      data.userId,
      data.referralCode || null,
      data.invitedBy || null,
      data.stage,
      data.userLevel || 0,
      data.betAmount,
      data.odds || 0,
      data.quantity || 0,
      data.fee,
      data.winAmount || 0,
      data.game,
      data.joinBet || "",
      data.betType || "",
      data.selection,
      data.result || null,
      data.status || 0,
      Date.now(),
    ],
  );

  return {
    id: result.insertId,
    ...data,
    createdAt: Date.now(),
  } as K3BetRecord;
};

export const getUserK3Bets = async (
  db: Pool,
  userId: number,
  game: number,
  page: number,
  limit: number,
): Promise<K3BetRecord[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM k3Bets WHERE userId = ? AND game = ? ORDER BY id DESC LIMIT ?, ?",
    [userId, game, page, limit],
  );
  return rows as K3BetRecord[];
};

export const getPendingK3Bets = async (
  db: Pool,
  game: number,
  betType?: string,
): Promise<K3BetRecord[]> => {
  let query = "SELECT * FROM k3Bets WHERE status = 0 AND game = ?";
  const params: (number | string)[] = [game];

  if (betType) {
    query += " AND gameType = ?";
    params.push(betType);
  }

  const [rows] = await db.execute<RowDataPacket[]>(query, params);
  return rows as K3BetRecord[];
};

export const updateK3BetStatus = async (
  db: Pool,
  betId: number,
  status: number,
  winAmount?: number,
): Promise<void> => {
  if (winAmount !== undefined) {
    await db.execute("UPDATE k3Bets SET status = ?, winAmount = ?, result = ? WHERE id = ?", [
      status,
      winAmount,
      winAmount > 0 ? 1 : 0,
      betId,
    ]);
  } else {
    await db.execute("UPDATE k3Bets SET status = ? WHERE id = ?", [status, betId]);
  }
};

export const updateK3BetsByPeriod = async (
  db: Pool,
  period: string,
  game: number,
  result: string,
): Promise<void> => {
  await db.execute("UPDATE k3Bets SET result = ? WHERE stage = ? AND game = ? AND status = 0", [
    result,
    period,
    game,
  ]);
};

// ==========================================
// COMMISSION QUERIES
// ==========================================

export const getCommissionRates = async (db: Pool): Promise<any[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM commissionLevels ORDER BY level ASC",
  );
  return rows;
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

export const distributeK3Commission = async (
  db: Pool,
  userId: number,
  turnover: number,
): Promise<void> => {
  // Get user's referral chain
  const [userRows] = await db.execute<RowDataPacket[]>(
    "SELECT invitedBy FROM users WHERE id = ? LIMIT 1",
    [userId],
  );

  if (!userRows || userRows.length === 0) return;

  const user = userRows[0];
  if (!user.invitedBy) return;

  // Get commission rates
  const rates = await getCommissionRates(db);

  // Distribute through F1-F4 levels
  let currentUserId = user.invitedBy;
  for (let level = 1; level <= 4 && currentUserId; level++) {
    const [referrerRows] = await db.execute<RowDataPacket[]>(
      "SELECT id, userLevel, invitedBy FROM users WHERE id = ? LIMIT 1",
      [currentUserId],
    );

    if (!referrerRows || referrerRows.length === 0) break;

    const referrer = referrerRows[0];

    // Check if referrer has sufficient level
    if (referrer.userLevel >= level) {
      const rate = rates[level - 1]?.rateF1 || 0;
      const commission = (turnover / 100) * rate;

      if (commission > 0) {
        await createCommissionRecord(db, {
          userId: referrer.id,
          fromUserId: userId,
          level,
          amount: commission,
          sourceType: "k3_bet",
          sourceId: userId,
        });

        await updateUserBalance(db, referrer.id, commission);
      }
    }

    currentUserId = referrer.invitedBy;
  }
};

// ==========================================
// SETTINGS QUERIES
// ==========================================

export const getK3ControlSettings = async (db: Pool, game: number): Promise<string | null> => {
  const keys: Record<number, string> = {
    1: "k3d_control",
    3: "k3d3_control",
    5: "k3d5_control",
    10: "k3d10_control",
  };

  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT configValue FROM adminConfigs WHERE configKey = ? LIMIT 1",
    [keys[game] || ""],
  );

  return rows[0]?.configValue || null;
};

export const updateK3ControlSettings = async (
  db: Pool,
  game: number,
  value: string,
): Promise<void> => {
  const keys: Record<number, string> = {
    1: "k3d_control",
    3: "k3d3_control",
    5: "k3d5_control",
    10: "k3d10_control",
  };

  await db.execute("UPDATE adminConfigs SET configValue = ? WHERE configKey = ?", [
    value,
    keys[game] || "",
  ]);
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const formatTimeIST = (timestamp?: number): string => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
};

export const getTodayString = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
