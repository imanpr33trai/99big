// db/admin.queries.ts
import { Pool } from "mysql2/promise";
import {
  AdminConfigRow,
  BetRow,
  CommissionLevelRow,
  DepositRow,
  GameSessionRow,
  PaymentMethodRow,
  SalaryRecordRow,
  UserBankAccountRow,
  UserRow,
  WithdrawalRow,
} from "../types/admin.types";
import { getCurrentTimestamp } from "../utils/admin.helpers";

// User Queries
export const findUserByToken = async (db: Pool, token: string): Promise<UserRow | null> => {
  const [rows] = await db.execute<UserRow[]>(
    "SELECT * FROM users WHERE authToken = ? AND isVerified = 1 LIMIT 1",
    [token],
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findUserByPhone = async (db: Pool, phone: string): Promise<UserRow | null> => {
  const [rows] = await db.execute<UserRow[]>("SELECT * FROM users WHERE phone = ? LIMIT 1", [
    phone,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

export const findUserById = async (db: Pool, id: number): Promise<UserRow | null> => {
  const [rows] = await db.execute<UserRow[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const findUserByReferralCode = async (db: Pool, code: string): Promise<UserRow | null> => {
  const [rows] = await db.execute<UserRow[]>("SELECT * FROM users WHERE referralCode = ? LIMIT 1", [
    code,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

export const findUserByCode = async (db: Pool, code: string): Promise<UserRow | null> => {
  const [rows] = await db.execute<UserRow[]>("SELECT * FROM users WHERE referralCode = ? LIMIT 1", [
    code,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

export const countUsersByInviteCode = async (db: Pool, code: string): Promise<number> => {
  const [rows] = await db.execute<[{ userCount: number }]>(
    "SELECT COUNT(*) as userCount FROM users WHERE invitedBy = (SELECT id FROM users WHERE referralCode = ?)",
    [code],
  );
  return rows[0]?.userCount || 0;
};

export const getUsersByInviteCode = async (db: Pool, code: string): Promise<UserRow[]> => {
  const [rows] = await db.execute<UserRow[]>(
    `SELECT u.* FROM users u
     INNER JOIN users inviter ON u.invitedBy = inviter.id
     WHERE inviter.referralCode = ?`,
    [code],
  );
  return rows;
};

export const listMembers = async (
  db: Pool,
  offset: number,
  limit: number,
): Promise<{ users: UserRow[]; total: number }> => {
  const [users] = await db.execute<UserRow[]>(
    "SELECT * FROM users WHERE isVerified = 1 AND isCollaborator = FALSE ORDER BY id DESC LIMIT ?, ?",
    [offset, limit],
  );
  const [totalRows] = await db.execute<[{ count: number }]>(
    "SELECT COUNT(*) as count FROM users WHERE isVerified = 1 AND isCollaborator = FALSE",
  );
  return { users, total: totalRows[0].count };
};

export const listCTV = async (db: Pool, offset: number, limit: number): Promise<UserRow[]> => {
  const [rows] = await db.execute<UserRow[]>(
    "SELECT * FROM users WHERE isVerified = 1 AND isCollaborator = TRUE ORDER BY id DESC LIMIT ?, ?",
    [offset, limit],
  );
  return rows;
};

export const updateUserStatus = async (db: Pool, id: number, status: number): Promise<void> => {
  await db.execute("UPDATE users SET status = ? WHERE id = ?", [status, id]);
};

export const updateUserBalance = async (
  db: Pool,
  userId: number,
  amount: number,
): Promise<void> => {
  await db.execute(
    "UPDATE users SET balance = balance + ?, totalDeposited = totalDeposited + ? WHERE id = ?",
    [amount, amount > 0 ? amount : 0, userId],
  );
};

export const updateUserMoney = async (db: Pool, phone: string, amount: number): Promise<void> => {
  await db.execute("UPDATE users SET balance = balance + ? WHERE phone = ?", [amount, phone]);
};

export const setFirstDepositBonus = async (db: Pool, phone: string): Promise<void> => {
  await db.execute("UPDATE users SET firstDepositBonus = TRUE WHERE phone = ?", [phone]);
};

export const updateFreeBonus = async (db: Pool, phone: string, amount: number): Promise<void> => {
  await db.execute("UPDATE users SET freeBonus = GREATEST(freeBonus - ?, 0) WHERE phone = ?", [
    amount,
    phone,
  ]);
};

// Deposit Queries
export const getPendingDeposits = async (db: Pool): Promise<DepositRow[]> => {
  const [rows] = await db.execute<DepositRow[]>(
    "SELECT d.*, u.phone as userPhone FROM deposits d JOIN users u ON d.userId = u.id WHERE d.status = 0",
  );
  return rows;
};

export const getProcessedDeposits = async (db: Pool): Promise<DepositRow[]> => {
  const [rows] = await db.execute<DepositRow[]>(
    "SELECT d.*, u.phone as userPhone FROM deposits d JOIN users u ON d.userId = u.id WHERE d.status != 0",
  );
  return rows;
};

export const getDepositById = async (db: Pool, id: number): Promise<DepositRow | null> => {
  const [rows] = await db.execute<DepositRow[]>(
    "SELECT d.*, u.phone as userPhone FROM deposits d JOIN users u ON d.userId = u.id WHERE d.id = ?",
    [id],
  );
  return rows.length > 0 ? rows[0] : null;
};

export const updateDepositStatus = async (db: Pool, id: number, status: number): Promise<void> => {
  await db.execute("UPDATE deposits SET status = ? WHERE id = ?", [status, id]);
};

export const getDepositsByUser = async (
  db: Pool,
  userId: number,
  offset: number,
  limit: number,
): Promise<DepositRow[]> => {
  const [rows] = await db.execute<DepositRow[]>(
    "SELECT * FROM deposits WHERE userId = ? ORDER BY id DESC LIMIT ?, ?",
    [userId, offset, limit],
  );
  return rows;
};

export const countDepositsByUser = async (db: Pool, userId: number): Promise<number> => {
  const [rows] = await db.execute<[{ count: number }]>(
    "SELECT COUNT(*) as count FROM deposits WHERE userId = ?",
    [userId],
  );
  return rows[0].count;
};

export const getTodayDeposits = async (db: Pool): Promise<number> => {
  const today = new Date().toISOString().split("T")[0];
  const [rows] = await db.execute<[{ total: string }]>(
    "SELECT COALESCE(SUM(amount), 0) as total FROM deposits WHERE status = 2 AND DATE(FROM_UNIXTIME(createdAt/1000)) = ?",
    [today],
  );
  return parseFloat(rows[0]?.total || "0");
};

// Withdrawal Queries
export const getPendingWithdrawals = async (db: Pool): Promise<WithdrawalRow[]> => {
  const [rows] = await db.execute<WithdrawalRow[]>(
    "SELECT w.*, u.phone as userPhone FROM withdrawals w JOIN users u ON w.userId = u.id WHERE w.status = 0",
  );
  return rows;
};

export const getProcessedWithdrawals = async (db: Pool): Promise<WithdrawalRow[]> => {
  const [rows] = await db.execute<WithdrawalRow[]>(
    "SELECT w.*, u.phone as userPhone FROM withdrawals w JOIN users u ON w.userId = u.id WHERE w.status != 0",
  );
  return rows;
};

export const getWithdrawalById = async (db: Pool, id: number): Promise<WithdrawalRow | null> => {
  const [rows] = await db.execute<WithdrawalRow[]>(
    "SELECT w.*, u.phone as userPhone FROM withdrawals w JOIN users u ON w.userId = u.id WHERE w.id = ?",
    [id],
  );
  return rows.length > 0 ? rows[0] : null;
};

export const updateWithdrawalStatus = async (
  db: Pool,
  id: number,
  status: number,
  remark?: string,
): Promise<void> => {
  if (remark) {
    await db.execute("UPDATE withdrawals SET status = ?, remarks = ? WHERE id = ?", [
      status,
      remark,
      id,
    ]);
  } else {
    await db.execute("UPDATE withdrawals SET status = ? WHERE id = ?", [status, id]);
  }
};

export const getWithdrawalsByUser = async (
  db: Pool,
  userId: number,
  offset: number,
  limit: number,
): Promise<WithdrawalRow[]> => {
  const [rows] = await db.execute<WithdrawalRow[]>(
    "SELECT * FROM withdrawals WHERE userId = ? ORDER BY id DESC LIMIT ?, ?",
    [userId, offset, limit],
  );
  return rows;
};

export const countWithdrawalsByUser = async (db: Pool, userId: number): Promise<number> => {
  const [rows] = await db.execute<[{ count: number }]>(
    "SELECT COUNT(*) as count FROM withdrawals WHERE userId = ?",
    [userId],
  );
  return rows[0].count;
};

export const getTodayWithdrawals = async (db: Pool): Promise<number> => {
  const today = new Date().toISOString().split("T")[0];
  const [rows] = await db.execute<[{ total: string }]>(
    "SELECT COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE status = 2 AND DATE(FROM_UNIXTIME(requestedAt/1000)) = ?",
    [today],
  );
  return parseFloat(rows[0]?.total || "0");
};

// Bet Queries
export const getBetsByGameType = async (
  db: Pool,
  gameType: string,
  status: number = 0,
): Promise<BetRow[]> => {
  const [rows] = await db.execute<BetRow[]>(
    `SELECT b.* FROM bets b
     JOIN gameSessions gs ON b.sessionId = gs.id
     JOIN gameTypes gt ON gs.gameTypeId = gt.id
     WHERE gt.code = ? AND b.status = ? AND b.userLevel = 0
     ORDER BY b.id ASC`,
    [gameType, status],
  );
  return rows;
};

export const getRecentGameSessions = async (
  db: Pool,
  gameType: string,
  limit: number = 10,
): Promise<GameSessionRow[]> => {
  const [rows] = await db.execute<GameSessionRow[]>(
    `SELECT gs.* FROM gameSessions gs
     JOIN gameTypes gt ON gs.gameTypeId = gt.id
     WHERE gt.code = ? AND gs.status != 0
     ORDER BY gs.id DESC LIMIT ?`,
    [gameType, limit],
  );
  return rows;
};

export const getCurrentGameSession = async (
  db: Pool,
  gameType: string,
): Promise<GameSessionRow | null> => {
  const [rows] = await db.execute<GameSessionRow[]>(
    `SELECT gs.* FROM gameSessions gs
     JOIN gameTypes gt ON gs.gameTypeId = gt.id
     WHERE gt.code = ? AND gs.status = 0
     ORDER BY gs.id DESC LIMIT 1`,
    [gameType],
  );
  return rows.length > 0 ? rows[0] : null;
};

export const getBetsByUser = async (
  db: Pool,
  userId: number,
  offset: number,
  limit: number,
): Promise<BetRow[]> => {
  const [rows] = await db.execute<BetRow[]>(
    "SELECT * FROM bets WHERE userId = ? AND status != 0 ORDER BY id DESC LIMIT ?, ?",
    [userId, offset, limit],
  );
  return rows;
};

export const countBetsByUser = async (db: Pool, userId: number): Promise<number> => {
  const [rows] = await db.execute<[{ count: number }]>(
    "SELECT COUNT(*) as count FROM bets WHERE userId = ? AND status != 0",
    [userId],
  );
  return rows[0].count;
};

export const getTotalBetAmount = async (db: Pool, status: number): Promise<number> => {
  const [rows] = await db.execute<[{ total: string }]>(
    "SELECT COALESCE(SUM(betAmount), 0) as total FROM bets WHERE status = ?",
    [status],
  );
  return parseFloat(rows[0]?.total || "0");
};

// Commission and Salary Queries
export const insertSalaryRecord = async (
  db: Pool,
  userId: number,
  amount: number,
  type: string,
  time: string,
): Promise<void> => {
  await db.execute(
    "INSERT INTO salaryRecords (userId, amount, type, createdAt) VALUES (?, ?, ?, ?)",
    [userId, amount, type, getCurrentTimestamp()],
  );
};

export const getSalaryRecords = async (db: Pool): Promise<SalaryRecordRow[]> => {
  const [rows] = await db.execute<SalaryRecordRow[]>(
    "SELECT sr.*, u.phone as userPhone FROM salaryRecords sr JOIN users u ON sr.userId = u.id ORDER BY sr.createdAt DESC",
  );
  return rows;
};

export const getCommissionLevels = async (db: Pool): Promise<CommissionLevelRow[]> => {
  const [rows] = await db.execute<CommissionLevelRow[]>(
    "SELECT * FROM commissionLevels ORDER BY level ASC",
  );
  return rows;
};

export const updateCommissionLevel = async (
  db: Pool,
  id: number,
  f1: number,
  f2: number,
  f3: number,
  f4: number,
): Promise<void> => {
  await db.execute(
    "UPDATE commissionLevels SET rateF1 = ?, rateF2 = ?, rateF3 = ?, rateF4 = ? WHERE id = ?",
    [f1, f2, f3, f4, id],
  );
};

// Admin Config Queries
export const getAdminConfigs = async (db: Pool): Promise<AdminConfigRow[]> => {
  const [rows] = await db.execute<AdminConfigRow[]>("SELECT * FROM adminConfigs");
  return rows;
};

export const updateAdminConfig = async (db: Pool, key: string, value: string): Promise<void> => {
  await db.execute("UPDATE adminConfigs SET configValue = ? WHERE configKey = ?", [value, key]);
};

// Payment Method Queries
export const getPaymentMethods = async (db: Pool): Promise<PaymentMethodRow[]> => {
  const [rows] = await db.execute<PaymentMethodRow[]>("SELECT * FROM paymentMethods");
  return rows;
};

export const getPaymentMethodByType = async (
  db: Pool,
  type: string,
): Promise<PaymentMethodRow | null> => {
  const [rows] = await db.execute<PaymentMethodRow[]>(
    "SELECT * FROM paymentMethods WHERE type = ? LIMIT 1",
    [type],
  );
  return rows.length > 0 ? rows[0] : null;
};

export const updatePaymentMethod = async (
  db: Pool,
  type: string,
  data: Partial<PaymentMethodRow>,
): Promise<void> => {
  const fields = Object.keys(data).filter((k) => k !== "id" && k !== "createdAt");
  const values = fields.map((f) => (data as Record<string, unknown>)[f]);
  const setClause = fields.map((f) => `${f} = ?`).join(", ");

  await db.execute(`UPDATE paymentMethods SET ${setClause} WHERE type = ?`, [...values, type]);
};

export const deletePaymentMethodsByType = async (db: Pool, type: string): Promise<void> => {
  await db.execute("DELETE FROM paymentMethods WHERE type = ?", [type]);
};

export const insertPaymentMethod = async (
  db: Pool,
  data: Partial<PaymentMethodRow>,
): Promise<void> => {
  const fields = Object.keys(data).filter((k) => k !== "id");
  const values = fields.map((f) => (data as Record<string, unknown>)[f]);
  const placeholders = fields.map(() => "?").join(", ");

  await db.execute(
    `INSERT INTO paymentMethods (${fields.join(", ")}) VALUES (${placeholders})`,
    values,
  );
};

// User Bank Account Queries
export const getUserBankAccounts = async (
  db: Pool,
  userId: number,
): Promise<UserBankAccountRow[]> => {
  const [rows] = await db.execute<UserBankAccountRow[]>(
    "SELECT * FROM userBankAccounts WHERE userId = ?",
    [userId],
  );
  return rows;
};

export const getDefaultBankAccount = async (
  db: Pool,
  userId: number,
): Promise<UserBankAccountRow | null> => {
  const [rows] = await db.execute<UserBankAccountRow[]>(
    "SELECT * FROM userBankAccounts WHERE userId = ? AND isDefault = TRUE LIMIT 1",
    [userId],
  );
  return rows.length > 0 ? rows[0] : null;
};

// Statistics Queries
export const getActiveUsersCount = async (db: Pool): Promise<number> => {
  const [rows] = await db.execute<[{ count: number }]>(
    "SELECT COUNT(*) as count FROM users WHERE status = 0",
  );
  return rows[0].count;
};

export const getInactiveUsersCount = async (db: Pool): Promise<number> => {
  const [rows] = await db.execute<[{ count: number }]>(
    "SELECT COUNT(*) as count FROM users WHERE status != 0",
  );
  return rows[0].count;
};

export const getTotalDeposits = async (db: Pool): Promise<number> => {
  const [rows] = await db.execute<[{ total: string }]>(
    "SELECT COALESCE(SUM(amount), 0) as total FROM deposits WHERE status = 2",
  );
  return parseFloat(rows[0]?.total || "0");
};

export const getTotalWithdrawals = async (db: Pool): Promise<number> => {
  const [rows] = await db.execute<[{ total: string }]>(
    "SELECT COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE status = 2",
  );
  return parseFloat(rows[0]?.total || "0");
};

// Downline Queries
export const getDirectSubordinates = async (db: Pool, userId: number): Promise<UserRow[]> => {
  const [rows] = await db.execute<UserRow[]>(
    "SELECT phone, referralCode, invitedBy, createdAt FROM users WHERE invitedBy = ?",
    [userId],
  );
  return rows;
};

export const getSubordinatesByLevel = async (db: Pool, userIds: number[]): Promise<UserRow[]> => {
  if (userIds.length === 0) return [];
  const placeholders = userIds.map(() => "?").join(",");
  const [rows] = await db.execute<UserRow[]>(
    `SELECT phone, referralCode, invitedBy, createdAt FROM users WHERE invitedBy IN (${placeholders})`,
    userIds,
  );
  return rows;
};
