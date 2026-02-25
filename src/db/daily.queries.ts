import { Pool, RowDataPacket } from "mysql2/promise";
import {
  BetRecord,
  CTVMember,
  CTVUser,
  RechargeRecord,
  RedEnvelope,
  WithdrawRecord,
} from "../types/daily.types";

export const getDirectSubordinates = async (db: Pool, referralCode: string): Promise<CTVUser[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, phone, referralCode, level, status, balance, totalMoney, createdAt
     FROM users
     WHERE invitedBy = ? AND isVerified = TRUE`,
    [referralCode],
  );
  return rows as CTVUser[];
};

export const getSubordinatesByLevel = async (
  db: Pool,
  referralCodes: string[],
): Promise<CTVUser[]> => {
  if (referralCodes.length === 0) return [];

  const placeholders = referralCodes.map(() => "?").join(",");
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, phone, referralCode, level, status, balance, totalMoney, createdAt
     FROM users
     WHERE invitedBy IN (${placeholders}) AND isVerified = TRUE`,
    referralCodes,
  );
  return rows as CTVUser[];
};

export const getCTVMembers = async (db: Pool, ctvPhone: string): Promise<CTVMember[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, phone, balance, totalMoney, status, createdAt
     FROM users
     WHERE invitedByPhone = ? AND isVerified = TRUE`,
    [ctvPhone],
  );
  return rows as CTVMember[];
};

export const getCTVBannedMembers = async (db: Pool, ctvPhone: string): Promise<CTVMember[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, phone, balance, totalMoney, status, createdAt
     FROM users
     WHERE invitedByPhone = ? AND status = 0`,
    [ctvPhone],
  );
  return rows as CTVMember[];
};

export const getBetsByUsers = async (
  db: Pool,
  userIds: number[],
  startDate?: Date,
  endDate?: Date,
): Promise<BetRecord[]> => {
  if (userIds.length === 0) return [];

  const placeholders = userIds.map(() => "?").join(",");
  let query = `SELECT id, userId, game, amount, result, winAmount, status, createdAt FROM bets WHERE userId IN (${placeholders})`;
  const params: (number | Date)[] = [...userIds];

  if (startDate && endDate) {
    query += ` AND createdAt BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  const [rows] = await db.execute<RowDataPacket[]>(query, params);
  return rows as BetRecord[];
};

export const createFinancialDetail = async (
  db: Pool,
  ctvId: number,
  userId: number,
  amount: number,
  type: "1" | "2",
): Promise<void> => {
  await db.execute(
    `INSERT INTO financialDetails (ctvId, userId, amount, type, createdAt) VALUES (?, ?, ?, ?, NOW())`,
    [ctvId, userId, amount, type],
  );
};

export const getFinancialDetailsToday = async (db: Pool, ctvId: number): Promise<number> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT COALESCE(SUM(amount), 0) as total FROM financialDetails
     WHERE ctvId = ? AND DATE(createdAt) = CURDATE()`,
    [ctvId],
  );
  return (rows[0] as { total: number }).total;
};

export const getRecentRecharges = async (
  db: Pool,
  members: CTVMember[],
  limit: number = 5,
): Promise<RechargeRecord[]> => {
  if (members.length === 0) return [];

  const userIds = members.map((m) => m.id);
  const placeholders = userIds.map(() => "?").join(",");

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT d.id, d.userId, d.amount, d.status, d.createdAt, u.phone as userPhone
     FROM deposits d
     JOIN users u ON d.userId = u.id
     WHERE d.userId IN (${placeholders})
     ORDER BY d.createdAt DESC LIMIT ?`,
    [...userIds, limit],
  );
  return rows as RechargeRecord[];
};

export const getRecentWithdrawals = async (
  db: Pool,
  members: CTVMember[],
  limit: number = 5,
): Promise<WithdrawRecord[]> => {
  if (members.length === 0) return [];

  const userIds = members.map((m) => m.id);
  const placeholders = userIds.map(() => "?").join(",");

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT w.id, w.userId, w.amount, w.status, w.createdAt, u.phone as userPhone
     FROM withdrawals w
     JOIN users u ON w.userId = u.id
     WHERE w.userId IN (${placeholders})
     ORDER BY w.createdAt DESC LIMIT ?`,
    [...userIds, limit],
  );
  return rows as WithdrawRecord[];
};

export const getRedEnvelopesUsedToday = async (db: Pool, ctvId: number): Promise<number> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT COALESCE(SUM(amount), 0) as total FROM redEnvelopeClaims
     WHERE ctvId = ? AND DATE(createdAt) = CURDATE()`,
    [ctvId],
  );
  return (rows[0] as { total: number }).total;
};

export const createRedEnvelope = async (
  db: Pool,
  ctvId: number,
  code: string,
  amount: number,
  count: number,
  expiryHours: number,
): Promise<void> => {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + expiryHours);

  await db.execute(
    `INSERT INTO redEnvelopes (ctvId, code, amount, remainingCount, totalCount, expiryDate, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [ctvId, code, amount, count, count, expiryDate],
  );
};

export const getRedEnvelopesByCTV = async (db: Pool, ctvId: number): Promise<RedEnvelope[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, ctvId, code, amount, remainingCount, totalCount, expiryDate, createdAt
     FROM redEnvelopes
     WHERE ctvId = ? ORDER BY createdAt DESC`,
    [ctvId],
  );
  return rows as RedEnvelope[];
};

export const updateUserBalance = async (
  db: Pool,
  phone: string,
  amount: number,
  operation: "add" | "subtract",
): Promise<void> => {
  const operator = operation === "add" ? "+" : "-";
  await db.execute(`UPDATE users SET balance = balance ${operator} ? WHERE phone = ?`, [
    amount,
    phone,
  ]);
};

export const updateCTVPoints = async (
  db: Pool,
  ctvId: number,
  amount: number,
  operation: "add" | "subtract",
): Promise<void> => {
  const operator = operation === "add" ? "+" : "-";
  await db.execute(`UPDATE userPoints SET pointsUs = pointsUs ${operator} ? WHERE userId = ?`, [
    amount,
    ctvId,
  ]);
};
