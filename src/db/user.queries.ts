import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getTimestamp } from "src/utils/helpers";
import dbConfigPool from "../config/db.config";
import { CreateUserInput, User } from "../types/auth.type";
import { UserRecord, UserStatusEnum } from "../types/user.type";
import { helperGetCurrentTimestamp } from "../utils/common.helpers";

// Raw query functions - no classes
export const findUserByPhone = async (db: Pool, phone: string): Promise<User | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, phone, userName, passwordHash, authToken, balance,
            referralCode, invitedBy, isCollaborator, isVerified,
            otpCode, otpExpiresAt, otpAttempts, lastLoginIp, status,
            createdAt, updatedAt, userLevel, commissionLevel,
            totalDeposited, totalWithdrawn, totalBet, totalWon,
            commissionF1, commissionF2, commissionF3, commissionF4,
            commissionToday, rank, freeBonus, firstDepositBonus
     FROM users
     WHERE phone = ?
     LIMIT 1`,
    [phone],
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

// export const findUserByPhone = async (db: Pool, phone: string): Promise<any | null> => {
//   const [rows] = await db.execute("SELECT * FROM users WHERE phone = ? LIMIT 1", [phone]);
//   return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
// };

export const updateUserAuthToken = async (
  db: Pool,
  phone: string,
  token: string | null,
  ipAddress: string | null,
): Promise<void> => {
  await db.execute<ResultSetHeader>(
    `UPDATE users
     SET authToken = ?,
         lastLoginIp = ?,
         updatedAt = ?
     WHERE phone = ?`,
    [token, ipAddress, Date.now(), phone],
  );
};

export const recordLoginActivity = async (
  db: Pool,
  phone: string,
  ipAddress: string,
  success: boolean,
): Promise<void> => {
  await db.execute(
    `INSERT INTO activityLogs
     (userId, action, entityType, newValues, ipAddress, createdAt)
     VALUES (
       (SELECT id FROM users WHERE phone = ?),
       ?,
       'user',
       ?,
       ?,
       ?
     )`,
    [
      phone,
      success ? "login_success" : "login_failed",
      JSON.stringify({ success }),
      ipAddress,
      Date.now(),
    ],
  );
};

export const incrementFailedLoginAttempts = async (db: Pool, phone: string): Promise<void> => {
  await db.execute(
    `UPDATE users
     SET otpAttempts = otpAttempts + 1
     WHERE phone = ?`,
    [phone],
  );
};

export const lockUserAccount = async (db: Pool, phone: string): Promise<void> => {
  await db.execute(
    `UPDATE users
     SET status = 1
     WHERE phone = ?`,
    [phone],
  );
};

// Find inviter by referral code
export const findUserByReferralCode = async (db: Pool, code: string): Promise<User | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, phone, userName, referralCode, userLevel, commissionLevel, status
     FROM users
     WHERE referralCode = ?
     LIMIT 1`,
    [code],
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

// Create new user
export const createUser = async (db: Pool, input: CreateUserInput): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users
     (phone, userName, passwordHash, balance, referralCode, invitedBy,
      isCollaborator, isVerified, otpCode, otpExpiresAt, otpAttempts,
      lastLoginIp, status, createdAt, updatedAt, userLevel, commissionLevel,
      totalDeposited, totalWithdrawn, totalBet, totalWon,
      commissionF1, commissionF2, commissionF3, commissionF4, commissionToday,
      rank, freeBonus, firstDepositBonus)
     VALUES (?, ?, ?, 0, ?, ?, FALSE, TRUE, ?, ?, 0, ?, 0, ?, ?, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ?, FALSE)`,
    [
      input.phone,
      input.userName,
      input.passwordHash,
      input.referralCode,
      input.invitedBy,
      input.otpCode,
      Date.now() + 10 * 60 * 1000, // OTP expires in 10 min
      input.ipAddress,
      Date.now(),
      Date.now(),
      input.freeBonus,
    ],
  );
  return result.insertId;
};

// Initialize user points
export const createUserPoints = async (db: Pool, phone: string): Promise<void> => {
  await db.execute(
    `INSERT INTO userPoints (userId, points, pointsUs, createdAt)
     VALUES ((SELECT id FROM users WHERE phone = ?), 0, 0, ?)`,
    [phone, Date.now()],
  );
};

// Check if referral code exists
export const isReferralCodeExists = async (db: Pool, code: string): Promise<boolean> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT 1 FROM users WHERE referralCode = ? LIMIT 1`,
    [code],
  );
  return rows.length > 0;
};

export const createUserWithOtp = async (
  db: Pool,
  phone: string,
  otp: number,
  expiresAt: number,
): Promise<void> => {
  await db.execute(
    "INSERT INTO users (phone, otpCode, isVerified, otpExpiresAt, createdAt, updatedAt) VALUES (?, ?, FALSE, ?, ?, ?)",
    [phone, otp.toString(), expiresAt, getTimestamp(), getTimestamp()],
  );
};

export const updateUserOtp = async (
  db: Pool,
  phone: string,
  otp: number,
  expiresAt: number,
): Promise<void> => {
  await db.execute(
    "UPDATE users SET otpCode = ?, otpExpiresAt = ?, updatedAt = ? WHERE phone = ?",
    [otp.toString(), expiresAt, getTimestamp(), phone],
  );
};

export const findVerifiedUserByPhone = async (db: Pool, phone: string): Promise<any | null> => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE phone = ? AND isVerified = TRUE LIMIT 1",
    [phone],
  );
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

export const updatePasswordAndOtp = async (
  db: Pool,
  phone: string,
  passwordHash: string,
  newOtp: number,
  expiresAt: number,
): Promise<void> => {
  await db.execute(
    "UPDATE users SET passwordHash = ?, otpCode = ?, otpExpiresAt = ?, updatedAt = ? WHERE phone = ?",
    [passwordHash, newOtp.toString(), expiresAt, getTimestamp(), phone],
  );
};

export const incrementOtpAttempts = async (db: Pool, phone: string): Promise<void> => {
  await db.execute("UPDATE users SET otpAttempts = otpAttempts + 1 WHERE phone = ?", [phone]);
};

export const findUserByToken = async (db: Pool, token: string): Promise<any | null> => {
  const [rows] = await db.execute("SELECT userLevel, ctv FROM users WHERE authToken = ? LIMIT 1", [
    token,
  ]);
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

export const getAdminSettings = async (db: Pool): Promise<any> => {
  const [rows] = await db.execute("SELECT telegram, customerService FROM adminConfigs LIMIT 1", []);
  return (rows as any[])[0] || { telegram: "", customerService: "" };
};

export const getPointListTelegram = async (db: Pool, phone: string): Promise<string | null> => {
  const [rows] = await db.execute("SELECT telegram FROM userPoints WHERE phone = ? LIMIT 1", [
    phone,
  ]);
  return (rows as any[]).length > 0 ? (rows as any[])[0].telegram : null;
};

// Add to existing file

export const getCommissionLevels = async (
  db: Pool,
): Promise<{
  rateF1: number;
  rateF2: number;
  rateF3: number;
  rateF4: number;
} | null> => {
  const [rows] = await db.execute(
    "SELECT rateF1, rateF2, rateF3, rateF4 FROM commissionLevels ORDER BY level ASC LIMIT 1",
    [],
  );
  return (rows as any[]).length > 0 ? (rows as any[])[0] : null;
};

export const createCommissionRecord = async (
  db: Pool,
  record: {
    phone: string;
    code: string;
    invitedBy: string;
    f1: number;
    f2: number;
    f3: number;
    f4: number;
    time: number;
  },
): Promise<void> => {
  await db.execute(
    `INSERT INTO commissionRecords
     (phone, code, invitedBy, f1, f2, f3, f4, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.phone,
      record.code,
      record.invitedBy,
      record.f1,
      record.f2,
      record.f3,
      record.f4,
      record.time,
    ],
  );
};

export const userQueryFindByToken = async (token: string): Promise<UserRecord | null> => {
  const [rows] = await dbConfigPool.execute<UserRecord[]>(
    `SELECT id, phone, userName, passwordHash, plainPassword, authToken, balance,
            referralCode, invitedBy, isCollaborator, isVerified, otpCode, otpExpiresAt,
            otpAttempts, lastLoginIp, status, createdAt, updatedAt, userLevel,
            commissionLevel, totalDeposited, totalWithdrawn, totalBet, totalWon,
            commissionF1, commissionF2, commissionF3, commissionF4, commissionToday,
            rank, freeBonus, firstDepositBonus
     FROM users
     WHERE authToken = ? AND status = ?`,
    [token, UserStatusEnum.ACTIVE],
  );
  return rows[0] || null;
};

export const userQueryFindByPhone = async (phone: string): Promise<UserRecord | null> => {
  const [rows] = await dbConfigPool.execute<UserRecord[]>(
    `SELECT id, phone, userName, passwordHash, plainPassword, authToken, balance,
            referralCode, invitedBy, isCollaborator, isVerified, otpCode, otpExpiresAt,
            otpAttempts, lastLoginIp, status, createdAt, updatedAt, userLevel,
            commissionLevel, totalDeposited, totalWithdrawn, totalBet, totalWon,
            commissionF1, commissionF2, commissionF3, commissionF4, commissionToday,
            rank, freeBonus, firstDepositBonus
     FROM users
     WHERE phone = ?`,
    [phone],
  );
  return rows[0] || null;
};

export const userQueryFindByReferralCode = async (code: string): Promise<UserRecord | null> => {
  const [rows] = await dbConfigPool.execute<UserRecord[]>(
    `SELECT id, phone, userName, referralCode, invitedBy, balance, totalDeposited
     FROM users
     WHERE referralCode = ?`,
    [code],
  );
  return rows[0] || null;
};

export const userQueryFindById = async (id: number): Promise<UserRecord | null> => {
  const [rows] = await dbConfigPool.execute<UserRecord[]>(
    `SELECT id, phone, userName, referralCode, invitedBy, balance, freeBonus,
            firstDepositBonus, totalDeposited, status
     FROM users
     WHERE id = ?`,
    [id],
  );
  return rows[0] || null;
};

export const userQueryUpdateOTP = async (
  phone: string,
  otp: string,
  timeEnd: number,
): Promise<void> => {
  await dbConfigPool.execute("UPDATE users SET otpCode = ?, otpExpiresAt = ? WHERE phone = ?", [
    otp,
    BigInt(timeEnd),
    phone,
  ]);
};

export const userQueryUpdateName = async (name: string, token: string): Promise<void> => {
  const updatedAt = helperGetCurrentTimestamp();
  await dbConfigPool.execute("UPDATE users SET userName = ?, updatedAt = ? WHERE authToken = ?", [
    name,
    BigInt(updatedAt),
    token,
  ]);
};

export const userQueryUpdatePassword = async (
  password: string,
  plainPassword: string,
  token: string,
): Promise<void> => {
  const updatedAt = helperGetCurrentTimestamp();
  await dbConfigPool.execute(
    "UPDATE users SET passwordHash = ?, plainPassword = ?, otpCode = ?, updatedAt = ? WHERE authToken = ?",
    [password, plainPassword, helperGenerateRandomNumber(100000, 999999), BigInt(updatedAt), token],
  );
};

export const userQueryUpdateBalance = async (phone: string, amount: number): Promise<void> => {
  const updatedAt = helperGetCurrentTimestamp();
  await dbConfigPool.execute(
    "UPDATE users SET balance = balance + ?, totalDeposited = totalDeposited + ?, updatedAt = ? WHERE phone = ?",
    [amount, amount > 0 ? amount : 0, BigInt(updatedAt), phone],
  );
};

export const userQueryDeductBalance = async (phone: string, amount: number): Promise<void> => {
  const updatedAt = helperGetCurrentTimestamp();
  await dbConfigPool.execute(
    "UPDATE users SET balance = balance - ?, updatedAt = ? WHERE phone = ?",
    [amount, BigInt(updatedAt), phone],
  );
};

export const userQueryUpdateFreeBonus = async (phone: string, amount: number): Promise<void> => {
  const updatedAt = helperGetCurrentTimestamp();
  await dbConfigPool.execute(
    "UPDATE users SET freeBonus = GREATEST(freeBonus - ?, 0), updatedAt = ? WHERE phone = ?",
    [amount, BigInt(updatedAt), phone],
  );
};

export const userQuerySetFreeBonus = async (phone: string, amount: number): Promise<void> => {
  const updatedAt = helperGetCurrentTimestamp();
  await dbConfigPool.execute("UPDATE users SET freeBonus = ?, updatedAt = ? WHERE phone = ?", [
    amount,
    BigInt(updatedAt),
    phone,
  ]);
};

export const userQuerySetFirstDepositBonus = async (phone: string): Promise<void> => {
  const updatedAt = helperGetCurrentTimestamp();
  await dbConfigPool.execute(
    "UPDATE users SET firstDepositBonus = TRUE, updatedAt = ? WHERE phone = ?",
    [BigInt(updatedAt), phone],
  );
};

export const userQueryGetFinancialSummary = async (phone: string) => {
  const [rows] = await dbConfigPool.execute<any[]>(
    `SELECT
      u.balance,
      u.totalDeposited,
      u.totalWithdrawn,
      u.totalBet,
      u.totalWon,
      (u.totalWon - u.totalBet) as netProfit,
      (u.commissionF1 + u.commissionF2 + u.commissionF3 + u.commissionF4) as totalCommission
     FROM users u
     WHERE u.phone = ?`,
    [phone],
  );
  return rows[0] || null;
};

// Helper function import fix
import { helperGenerateRandomNumber } from "../utils/common.helpers";
