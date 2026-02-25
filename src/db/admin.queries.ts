import { Pool, ResultSetHeader } from "mysql2/promise";
import { AdminUser, CommissionData, DepositRecord, WithdrawalRecord } from "../types/admin.types";
import { getTodayStartTimestamp } from "../utils/admin.helpers";

// User Queries
/**
 * List members with pagination

 * @param db
 * @param page
 * @param limit
 * @returns
 */
export const listMembers = async (
  db: Pool,
  page: number,
  limit: number,
): Promise<{ users: AdminUser[]; total: number }> => {
  const offset = page - limit;

  const [countRows] = await db.execute(
    "SELECT COUNT(*) as total FROM users WHERE userLevel = 0",
    [],
  );
  const total = (countRows as any[])[0].total;

  const [rows] = await db.execute(
    `SELECT id, phone, userName, balance, referralCode, invitedBy, isVerified,
            status, userLevel, createdAt
     FROM users WHERE userLevel = 0
     ORDER BY id DESC LIMIT ? OFFSET ?`,
    [limit, offset],
  );

  return { users: rows as AdminUser[], total };
};

/**
 * List CTVs with pagination
 * @param db
 * @param page
 * @param limit
 * @returns
 */
export const listCTV = async (
  db: Pool,
  page: number,
  limit: number,
): Promise<{ users: AdminUser[]; total: number }> => {
  const offset = page - limit;
  const [countRows] = await db.execute(
    "SELECT COUNT(*) as total FROM users WHERE userLevel = 2",
    [],
  );
  const total = (countRows as any[])[0].total;

  const [rows] = await db.execute(
    `SELECT id, phone, userName, balance, referralCode, invitedBy, isVerified,
            status, userLevel, createdAt
     FROM users WHERE userLevel = 2
     ORDER BY id DESC LIMIT ? OFFSET ?`,
    [limit, offset],
  );

  return { users: rows as AdminUser[], total };
};

/**
 * Get direct subordinates (F1)
 * @param db
 * @param referralCode
 * @returns
 */
export const getDirectSubordinates = async (
  db: Pool,
  referralCode: string,
): Promise<AdminUser[]> => {
  const todayStart = getTodayStartTimestamp();

  const [rows] = await db.execute(
    `SELECT id, phone, userName, balance, referralCode, invitedBy, isVerified,
            status, userLevel, createdAt
     FROM users WHERE invitedBy = (SELECT id FROM users WHERE referralCode = ?)
     ORDER BY createdAt DESC`,
    [referralCode],
  );

  return rows as AdminUser[];
};

/**
 * Get subordinates by user IDs (for F2, F3, F4)
 * @param db
 * @param userIds
 * @returns
 */
export const getSubordinatesByLevel = async (db: Pool, userIds: number[]): Promise<AdminUser[]> => {
  if (userIds.length === 0) return [];

  const placeholders = userIds.map(() => "?").join(",");
  const [rows] = await db.execute(
    `SELECT id, phone, userName, balance, referralCode, invitedBy, isVerified,
            status, userLevel, createdAt
     FROM users WHERE invitedBy IN (${placeholders})`,
    userIds,
  );

  return rows as AdminUser[];
};

// Statistics Queries

/**
 * Get game statistics
 * @param db
 * @returns
 */

export const getGameStatistics = async (db: Pool): Promise<any[]> => {
  const [rows] = await db.execute(
    `SELECT gt.id, gt.name, gt.duration,
            COUNT(b.id) as totalBets,
            SUM(b.betAmount) as totalBetAmount,
            SUM(b.actualWin) as totalWinAmount
     FROM gameTypes gt
     LEFT JOIN bets b ON gt.id = b.gameTypeId
     GROUP BY gt.id, gt.name, gt.duration`,
    [],
  );
  return rows as any[];
};

/**
 * Get today's deposits
 * @param db
 * @returns
 */
export const getTodayDeposits = async (db: Pool): Promise<{ count: number; amount: number }> => {
  const todayStart = getTodayStartTimestamp();
  const [rows] = await db.execute(
    `SELECT COUNT(_) as count, COALESCE(SUM(amount), 0) as amount
  FROM deposits
  WHERE createdAt >= ? AND status = 2`,
    [todayStart],
  );
  return (rows as any[])[0] || { count: 0, amount: 0 };
};

/**
 * Get today's withdrawals
 * @param db
 * @returns
 */
export const getTodayWithdrawals = async (db: Pool): Promise<{ count: number; amount: number }> => {
  const todayStart = getTodayStartTimestamp();
  const [rows] = await db.execute(
    `SELECT COUNT(_) as count, COALESCE(SUM(amount), 0) as amount
  FROM withdrawals
  WHERE requestedAt >= ? AND status = 2`,
    [todayStart],
  );
  return (rows as any[])[0] || { count: 0, amount: 0 };
};

/**
 * Get total join (bet statistics)
 * @param db
 * @param gameTypeId
 * @returns
 */

export const getTotalJoin = async (db: Pool, gameTypeId: number): Promise<any> => {
  const [rows] = await db.execute(
    `SELECT
      SUM(CASE WHEN betType = 'big' THEN betAmount ELSE 0 END) as big,
      SUM(CASE WHEN betType = 'small' THEN betAmount ELSE 0 END) as small,
      SUM(CASE WHEN betType = 'odd' THEN betAmount ELSE 0 END) as odd,
      SUM(CASE WHEN betType = 'even' THEN betAmount ELSE 0 END) as even,
      SUM(CASE WHEN betType = 'red' THEN betAmount ELSE 0 END) as red,
      SUM(CASE WHEN betType = 'green' THEN betAmount ELSE 0 END) as green,
      SUM(CASE WHEN betType = 'violet' THEN betAmount ELSE 0 END) as violet
     FROM bets
     WHERE gameTypeId = ? AND status = 0`,
    [gameTypeId],
  );
  return (rows as any[])[0] || {};
};

// Settings Queries

/**
 * Get all admin configs
 * @param db
 * @returns
 */

export const getAdminConfigs = async (db: Pool): Promise<Record<string, string>> => {
  const [rows] = await db.execute("SELECT configKey, configValue FROM adminConfigs", []);

  const configs: Record<string, string> = {};
  (rows as any[]).forEach((row) => {
    configs[row.configKey] = row.configValue;
  });

  return configs;
};

/**
 * Update admin config
 * @param db
 * @param key
 * @param value
 */

export const updateAdminConfig = async (db: Pool, key: string, value: string): Promise<void> => {
  const now = Date.now();
  await db.execute(
    `INSERT INTO adminConfigs (configKey, configValue, updatedAt)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE configValue = ?, updatedAt = ?`,
    [key, value, now, value, now],
  );
};

/**
 * Get payment methods
 * @param db
 * @returns
 */
export const getPaymentMethods = async (db: Pool): Promise<any[]> => {
  const [rows] = await db.execute("SELECT _ FROM paymentMethods ORDER BY id", []);
  return rows as any[];
};

/**
 * Get payment methods
 * @param db
 * @param type
 * @param data
 */
export const updatePaymentMethod = async (
  db: Pool,
  type: string,
  data: Record<string, string>,
): Promise<void> => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const setClause = fields.map((f) => `${f} = ?`).join(", ");

  await db.execute(
    `INSERT INTO paymentMethods (type, ${fields.join(", ")})
     VALUES (?, ${fields.map(() => "?").join(", ")})
     ON DUPLICATE KEY UPDATE ${setClause}`,
    [type, ...values, ...values],
  );
};

// Commission Queries

/**
 * Get commission levels
 * @param db
 * @returns
 */

export const getCommissionLevels = async (db: Pool): Promise<CommissionData[]> => {
  const [rows] = await db.execute(
    "SELECT id, level, rateF1, rateF2, rateF3, rateF4, minTurnover FROM commissionLevels ORDER BY level",
    [],
  );
  return rows as CommissionData[];
};

/**
 * Update commission level
 * @param db
 * @param id
 * @param data
 * @returns
 */

export const updateCommissionLevel = async (
  db: Pool,
  id: number,
  data: Partial<CommissionData>,
): Promise<void> => {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.rateF1 !== undefined) {
    fields.push("rateF1 = ?");
    values.push(data.rateF1);
  }
  if (data.rateF2 !== undefined) {
    fields.push("rateF2 = ?");
    values.push(data.rateF2);
  }
  if (data.rateF3 !== undefined) {
    fields.push("rateF3 = ?");
    values.push(data.rateF3);
  }
  if (data.rateF4 !== undefined) {
    fields.push("rateF4 = ?");
    values.push(data.rateF4);
  }
  if (data.minTurnover !== undefined) {
    fields.push("minTurnover = ?");
    values.push(data.minTurnover);
  }

  if (fields.length === 0) return;

  values.push(id);

  await db.execute(`UPDATE commissionLevels SET ${fields.join(", ")} WHERE id = ?`, values);
};

// Salary Queries

/**
 * Get salary records
 * @param db
 * @param phone
 * @returns
 */

export const getSalaryRecords = async (db: Pool, phone?: string): Promise<any[]> => {
  let query = `     SELECT s.id, s.userId, s.amount, s.type, s.periodStart, s.periodEnd, s.isPaid, s.createdAt,
           u.phone, u.userName
    FROM salaryRecords s
    JOIN users u ON s.userId = u.id
  `;
  const params: any[] = [];

  if (phone) {
    query += " WHERE u.phone = ?";
    params.push(phone);
  }

  query += " ORDER BY s.createdAt DESC";

  const [rows] = await db.execute(query, params);
  return rows as any[];
};

/**
 * Create salary record
 * @param db
 * @param data
 * @returns
 */

export const createSalaryRecord = async (
  db: Pool,
  data: {
    userId: number;
    amount: number;
    type: string;
    periodStart: string;
    periodEnd: string;
  },
): Promise<number> => {
  const now = Date.now();
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO salaryRecords (userId, amount, type, periodStart, periodEnd, isPaid, createdAt)
     VALUES (?, ?, ?, ?, ?, false, ?)`,
    [data.userId, data.amount, data.type, data.periodStart, data.periodEnd, now],
  );
  return result.insertId;
};

// Red Envelope Queries

/**
 * Get red envelopes
 * @param db
 * @param creatorId
 * @returns
 */

export const getRedEnvelopes = async (db: Pool, creatorId?: number): Promise<any[]> => {
  let query = `     SELECT r.id, r.envelopeId, r.creatorId, r.totalAmount, r.totalCount,
           r.claimedCount, r.status, r.expiredAt, r.createdAt,
           u.phone as creatorPhone, u.userName as creatorName
    FROM redEnvelopes r
    JOIN users u ON r.creatorId = u.id
  `;
  const params: any[] = [];

  if (creatorId) {
    query += " WHERE r.creatorId = ?";
    params.push(creatorId);
  }

  query += " ORDER BY r.createdAt DESC";

  const [rows] = await db.execute(query, params);
  return rows as any[];
};

/**
 * Create red envelope
 * @param db
 * @param data
 * @returns
 */

export const createRedEnvelope = async (
  db: Pool,
  data: {
    envelopeId: string;
    creatorId: number;
    totalAmount: number;
    totalCount: number;
    expiredAt: number;
  },
): Promise<number> => {
  const now = Date.now();
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO redEnvelopes (envelopeId, creatorId, totalAmount, totalCount,
                               claimedCount, status, expiredAt, createdAt)
     VALUES (?, ?, ?, ?, 0, 0, ?, ?)`,
    [data.envelopeId, data.creatorId, data.totalAmount, data.totalCount, data.expiredAt, now],
  );
  return result.insertId;
};
