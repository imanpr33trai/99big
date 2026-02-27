import { Pool, RowDataPacket } from "mysql2/promise";
import { User } from "../types/user.types";
import { AdminUser } from "../types/admin.types";
import { UserStatus } from "../types/user.types";

// ==========================================
// USER AUTHENTICATION QUERIES
// ==========================================

/**
 * Find user by authentication token
 * @param db
 * @param token
 * @returns User or null
 */
export const findUserByToken = async (db: Pool, token: string): Promise<User | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE authToken = ? AND status = ? LIMIT 1",
    [token, UserStatus.ACTIVE],
  );
  return rows[0] as User | null;
};

/**
 * Update user authentication token
 * @param db
 * @param userId
 * @param token
 */
export const updateUserAuthToken = async (
  db: Pool,
  userId: number,
  token: string,
): Promise<void> => {
  await db.execute("UPDATE users SET authToken = ?, updatedAt = ? WHERE id = ?", [
    token,
    Date.now(),
    userId,
  ]);
};

/**
 * Update user password hash
 * @param db
 * @param userId
 * @param hash
 */
export const updateUserPassword = async (db: Pool, userId: number, hash: string): Promise<void> => {
  await db.execute("UPDATE users SET passwordHash = ?, updatedAt = ? WHERE id = ?", [
    hash,
    Date.now(),
    userId,
  ]);
};

// ==========================================
// OTP QUERIES
// ==========================================

/**
 * Update user OTP code and expiration
 * @param db
 * @param userId
 * @param otp
 * @param expiresAt
 */
export const updateUserOTP = async (
  db: Pool,
  userId: number,
  otp: string,
  expiresAt: number,
): Promise<void> => {
  await db.execute(
    "UPDATE users SET otpCode = ?, otpExpiresAt = ?, otpAttempts = 0, updatedAt = ? WHERE id = ?",
    [otp, expiresAt, Date.now(), userId],
  );
};

/**
 * Increment OTP attempts counter
 * @param db
 * @param userId
 */
export const incrementOTPAttempts = async (db: Pool, userId: number): Promise<void> => {
  await db.execute("UPDATE users SET otpAttempts = otpAttempts + 1, updatedAt = ? WHERE id = ?", [
    Date.now(),
    userId,
  ]);
};

/**
 * Verify user OTP code
 * @param db
 * @param userId
 * @param otp
 * @returns boolean
 */
export const verifyUserOTP = async (db: Pool, userId: number, otp: string): Promise<boolean> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ? AND otpCode = ? AND otpExpiresAt > ? AND otpAttempts < 3 LIMIT 1",
    [userId, otp, Date.now()],
  );
  return rows.length > 0;
};

/**
 * Check if user is OTP rate limited
 * @param db
 * @param userId
 * @returns boolean
 */
export const isOTPRateLimited = async (db: Pool, userId: number): Promise<boolean> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT otpExpiresAt FROM users WHERE id = ? AND otpExpiresAt > ? LIMIT 1",
    [userId, Date.now()],
  );
  return rows.length > 0;
};

/**
 * Clear user OTP data
 * @param db
 * @param userId
 */
export const clearUserOTP = async (db: Pool, userId: number): Promise<void> => {
  await db.execute(
    "UPDATE users SET otpCode = NULL, otpExpiresAt = NULL, otpAttempts = 0 WHERE id = ?",
    [userId],
  );
};

// ==========================================
// ADMIN AUTHENTICATION QUERIES
// ==========================================

/**
 * Find admin user by token
 * @param db
 * @param token
 * @returns AdminUser or null
 */
export const findAdminByToken = async (db: Pool, token: string): Promise<AdminUser | null> => {
  const [rows] = await db.execute(
    `SELECT id, phone, userName, passwordHash, authToken, balance, referralCode,
            invitedBy, isVerified, status, userLevel, createdAt
     FROM users WHERE authToken = ? AND userLevel IN (1, 2) LIMIT 1`,
    [token],
  );
  return (rows as AdminUser[])[0] || null;
};
