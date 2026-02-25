import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  BankAccount,
  CheckInRecord,
  CommissionLevel,
  Deposit,
  DepositStatus,
  RedEnvelope,
  RedEnvelopeClaim,
  Transfer,
  User,
  UserStatus,
  Withdrawal,
  WithdrawalStatus,
} from "../types/user.types";

// ==========================================
// USER QUERIES
// ==========================================

export const findUserByToken = async (db: Pool, token: string): Promise<User | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE authToken = ? AND status = ? LIMIT 1",
    [token, UserStatus.ACTIVE],
  );
  return rows[0] as User | null;
};

export const findUserByPhone = async (db: Pool, phone: string): Promise<User | null> => {
  const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM users WHERE phone = ? LIMIT 1", [
    phone,
  ]);
  return rows[0] as User | null;
};

export const findUserById = async (db: Pool, id: number): Promise<User | null> => {
  const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [
    id,
  ]);
  return rows[0] as User | null;
};

/**
 * Find user by phone (from admin.queries.ts)
 * @param db
 * @param phone
 * @returns
 */
export const findUserByPhoneAdmin = async (db: Pool, phone: string): Promise<any | null> => {
  const [rows] = await db.execute(
    `SELECT id, phone, userName, passwordHash, authToken, balance, referralCode,
            invitedBy, isVerified, status, userLevel, createdAt
     FROM users WHERE phone = ? LIMIT 1`,
    [phone],
  );
  return (rows as any[])[0] || null;
};

/**
 * Find user by ID (from admin.queries.ts)
 * @param db
 * @param id
 * @returns
 */
export const findUserByIdAdmin = async (db: Pool, id: number): Promise<any | null> => {
  const [rows] = await db.execute(
    `SELECT id, phone, userName, passwordHash, authToken, balance, referralCode,
            invitedBy, isVerified, status, userLevel, createdAt
     FROM users WHERE id = ? LIMIT 1`,
    [id],
  );
  return (rows as any[])[0] || null;
};

export const findUserByTokenDaily = async (db: Pool, token: string): Promise<any | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, phone, referralCode, level, status, balance, totalMoney, createdAt
     FROM users
     WHERE token = ? AND isVerified = TRUE AND level = 2`,
    [token],
  );
  return rows.length > 0 ? (rows[0] as any) : null;
};

export const findUserByPhoneDaily = async (db: Pool, phone: string): Promise<any | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, phone, referralCode, level, status, balance, totalMoney, createdAt
     FROM users
     WHERE phone = ? AND isVerified = TRUE`,
    [phone],
  );
  return rows.length > 0 ? (rows[0] as any) : null;
};

export const findUserByTokenK3 = async (db: Pool, token: string): Promise<any | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT id, phone, userName, balance, referralCode, invitedBy, userLevel, status FROM users WHERE token = ? AND isVerified = TRUE LIMIT 1",
    [token],
  );
  return rows[0] || null;
};

export const findUserByTokenK5 = async (db: Pool, token: string): Promise<any | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, phone, userName, balance, authToken, userLevel, invitedBy, status
     FROM users WHERE authToken = ? LIMIT 1`,
    [token],
  );
  return rows.length > 0 ? (rows[0] as any) : null;
};

export const findUserByPhonePayment = async (db: Pool, phone: string): Promise<any | null> => {
  const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM users WHERE phone = ? LIMIT 1", [
    phone,
  ]);
  return rows[0] as any | null;
};

export const findUserByAuthTokenPayment = async (db: Pool, token: string): Promise<any | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT u.* FROM users u
     JOIN user_sessions s ON u.id = s.userId
     WHERE s.token = ? AND s.expiresAt > ?
     LIMIT 1`,
    [token, Date.now()],
  );
  return rows[0] as any | null;
};

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

export const updateUserPassword = async (db: Pool, userId: number, hash: string): Promise<void> => {
  await db.execute("UPDATE users SET passwordHash = ?, updatedAt = ? WHERE id = ?", [
    hash,
    Date.now(),
    userId,
  ]);
};

export const updateUserName = async (db: Pool, userId: number, name: string): Promise<void> => {
  await db.execute("UPDATE users SET userName = ?, updatedAt = ? WHERE id = ?", [
    name,
    Date.now(),
    userId,
  ]);
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

/**
 * Update user balance (from admin.queries.ts)
 */
export const updateUserBalanceAdmin = async (
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

export const updateUserBalanceDaily = async (
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

export const updateUserBalanceK3 = async (
  db: Pool,
  userId: number,
  amount: number,
): Promise<void> => {
  await db.execute("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, userId]);
};

export const updateUserBalanceK5 = async (
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

export const updateUserBalancePayment = async (
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

export const deductUserBalance = async (
  db: Pool,
  userId: number,
  amount: number,
): Promise<boolean> => {
  const [result] = await db.execute<ResultSetHeader>(
    "UPDATE users SET balance = balance - ?, updatedAt = ? WHERE id = ? AND balance >= ?",
    [amount, Date.now(), userId, amount],
  );
  return result.affectedRows > 0;
};

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

export const incrementOTPAttempts = async (db: Pool, userId: number): Promise<void> => {
  await db.execute("UPDATE users SET otpAttempts = otpAttempts + 1, updatedAt = ? WHERE id = ?", [
    Date.now(),
    userId,
  ]);
};

export const setFirstDepositBonus = async (db: Pool, userId: number): Promise<void> => {
  await db.execute("UPDATE users SET firstDepositBonus = true, updatedAt = ? WHERE id = ?", [
    Date.now(),
    userId,
  ]);
};

/**
 * Set first deposit bonus (from admin.queries.ts)
 */
export const setFirstDepositBonusAdmin = async (db: Pool, userId: number): Promise<void> => {
  await db.execute("UPDATE users SET isVerified = true WHERE id = ?", [userId]);
};

export const setFirstDepositBonusPayment = async (db: Pool, userId: number): Promise<void> => {
  await db.execute("UPDATE users SET firstDepositBonus = true, updatedAt = ? WHERE id = ?", [
    Date.now(),
    userId,
  ]);
};

export const updateFreeBonus = async (db: Pool, userId: number, amount: number): Promise<void> => {
  await db.execute(
    "UPDATE users SET freeBonus = GREATEST(freeBonus - ?, 0), updatedAt = ? WHERE id = ?",
    [amount, Date.now(), userId],
  );
};

/**
 * Update free bonus (from admin.queries.ts)
 */
export const updateFreeBonusAdmin = async (
  db: Pool,
  userId: number,
  amount: number,
): Promise<void> => {
  await db.execute("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, userId]);
};

export const updateFreeBonusPayment = async (
  db: Pool,
  userId: number,
  amount: number,
): Promise<void> => {
  await db.execute(
    "UPDATE users SET freeBonus = freeBonus - ?, updatedAt = ? WHERE id = ? AND freeBonus >= ?",
    [amount, Date.now(), userId, amount],
  );
};

export const getUserCommissionLevelK3 = async (db: Pool, userId: number): Promise<number> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT userLevel FROM users WHERE id = ? LIMIT 1",
    [userId],
  );
  return rows[0]?.userLevel || 0;
};

export const getUserWithLockK5 = async (db: Pool, userId: number): Promise<any | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, phone, userName, balance, authToken, userLevel, invitedBy, status
     FROM users WHERE id = ? FOR UPDATE`,
    [userId],
  );
  return rows.length > 0 ? (rows[0] as any) : null;
};

export const findReferrerByCodePayment = async (db: Pool, code: string): Promise<any | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE referralCode = ? LIMIT 1",
    [code],
  );
  return rows[0] as any | null;
};

export const getUserPointsDaily = async (
  db: Pool,
  userId: number,
): Promise<{ points: number; pointsUs: number; telegramId?: string } | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT points, pointsUs, telegramId FROM userPoints WHERE userId = ?`,
    [userId],
  );
  return rows.length > 0
    ? (rows[0] as { points: number; pointsUs: number; telegramId?: string })
    : null;
};

// ==========================================
// OTP QUERIES
// ==========================================

export const verifyUserOTP = async (db: Pool, userId: number, otp: string): Promise<boolean> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ? AND otpCode = ? AND otpExpiresAt > ? AND otpAttempts < 3 LIMIT 1",
    [userId, otp, Date.now()],
  );
  return rows.length > 0;
};

export const isOTPRateLimited = async (db: Pool, userId: number): Promise<boolean> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT otpExpiresAt FROM users WHERE id = ? AND otpExpiresAt > ? LIMIT 1",
    [userId, Date.now()],
  );
  return rows.length > 0;
};

export const clearUserOTP = async (db: Pool, userId: number): Promise<void> => {
  await db.execute(
    "UPDATE users SET otpCode = NULL, otpExpiresAt = NULL, otpAttempts = 0 WHERE id = ?",
    [userId],
  );
};

// ==========================================
// REFERRAL QUERIES
// ==========================================

export const getDirectReferrals = async (db: Pool, code: string): Promise<User[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT u.* FROM users u
     JOIN users referrer ON u.invitedBy = referrer.id
     WHERE referrer.referralCode = ?
     ORDER BY u.createdAt DESC`,
    [code],
  );
  return rows as User[];
};

export const getReferralsByLevel = async (db: Pool, userIds: number[]): Promise<User[]> => {
  if (userIds.length === 0) return [];

  const placeholders = userIds.map(() => "?").join(",");
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM users WHERE invitedBy IN (${placeholders})`,
    userIds,
  );
  return rows as User[];
};

export const getReferralStatistics = async (db: Pool, userId: number): Promise<any> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT
      COUNT(CASE WHEN DATE(FROM_UNIXTIME(createdAt/1000)) = CURDATE() THEN 1 END) as today_count,
      COUNT(*) as total_count
     FROM users WHERE invitedBy = ?`,
    [userId],
  );
  return rows[0];
};

// ==========================================
// BANK ACCOUNT QUERIES
// ==========================================

export const getUserBankAccounts = async (db: Pool, userId: number): Promise<BankAccount[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM userBankAccounts WHERE userId = ? ORDER BY isDefault DESC",
    [userId],
  );
  return rows as BankAccount[];
};

export const getDefaultBankAccount = async (
  db: Pool,
  userId: number,
): Promise<BankAccount | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM userBankAccounts WHERE userId = ? AND isDefault = true LIMIT 1",
    [userId],
  );
  return rows[0] as BankAccount | null;
};

export const createBankAccount = async (
  db: Pool,
  data: Partial<BankAccount>,
): Promise<BankAccount> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO userBankAccounts
     (userId, type, bankName, accountName, accountNumber, ifscCode, isDefault, isVerified)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.userId,
      data.type || "bank",
      data.bankName,
      data.accountName,
      data.accountNumber,
      data.ifscCode || null,
      data.isDefault ?? true,
      false,
    ],
  );

  return {
    id: result.insertId,
    ...data,
    isVerified: false,
  } as BankAccount;
};

export const updateBankAccount = async (
  db: Pool,
  userId: number,
  data: Partial<BankAccount>,
): Promise<void> => {
  // Unset other defaults if setting this as default
  if (data.isDefault) {
    await db.execute("UPDATE userBankAccounts SET isDefault = false WHERE userId = ?", [userId]);
  }

  const fields = Object.keys(data).filter((k) => k !== "id");
  const values = fields.map((k) => (data as any)[k]);

  const setClause = fields.map((f) => `${f} = ?`).join(", ");

  await db.execute(`UPDATE userBankAccounts SET ${setClause} WHERE userId = ? AND id = ?`, [
    ...values,
    userId,
    data.id,
  ]);
};

// ==========================================
// TRANSFER QUERIES
// ==========================================

export const createTransfer = async (
  db: Pool,
  senderId: number,
  receiverId: number,
  amount: number,
): Promise<Transfer> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO balanceTransfers
     (senderId, receiverId, amount, status, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [senderId, receiverId, amount, 1, Date.now()],
  );

  return {
    id: result.insertId,
    senderId,
    receiverId,
    amount,
    status: 1,
    createdAt: Date.now(),
  } as Transfer;
};

export const getTransferHistory = async (
  db: Pool,
  userId: number,
  type: "sent" | "received",
): Promise<Transfer[]> => {
  const field = type === "sent" ? "senderId" : "receiverId";
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT t.*, u.phone as ${type === "sent" ? "receiverPhone" : "senderPhone"}, u.userName as ${type === "sent" ? "receiverName" : "senderName"}
     FROM balanceTransfers t
     JOIN users u ON u.id = ${type === "sent" ? "t.receiverId" : "t.senderId"}
     WHERE t.${field} = ?
     ORDER BY t.createdAt DESC`,
    [userId],
  );
  return rows as Transfer[];
};

// ==========================================
// CHECK-IN QUERIES
// ==========================================

export const getCheckInRecords = async (db: Pool, userId: number): Promise<CheckInRecord[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM checkInRecords WHERE userId = ? ORDER BY checkInDate DESC",
    [userId],
  );
  return rows as CheckInRecord[];
};

export const getTodayCheckIn = async (db: Pool, userId: number): Promise<CheckInRecord | null> => {
  const today = new Date().toISOString().split("T")[0];
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM checkInRecords WHERE userId = ? AND checkInDate = ? LIMIT 1",
    [userId, today],
  );
  return rows[0] as CheckInRecord | null;
};

export const createCheckInRecord = async (
  db: Pool,
  userId: number,
  days: number,
  reward: number,
): Promise<CheckInRecord> => {
  const today = new Date().toISOString().split("T")[0];
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO checkInRecords
     (userId, consecutiveDays, rewardAmount, checkInDate, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, days, reward, today, Date.now()],
  );

  return {
    id: result.insertId,
    userId,
    consecutiveDays: days,
    rewardAmount: reward,
    checkInDate: today,
    createdAt: Date.now(),
  } as CheckInRecord;
};

export const getUserPoints = async (db: Pool, userId: number): Promise<any> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM userPoints WHERE userId = ? LIMIT 1",
    [userId],
  );
  return rows[0] || null;
};

// ==========================================
// RED ENVELOPE QUERIES
// ==========================================

export const findRedEnvelope = async (
  db: Pool,
  envelopeId: string,
): Promise<RedEnvelope | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM redEnvelopes WHERE envelopeId = ? LIMIT 1",
    [envelopeId],
  );
  return rows[0] as RedEnvelope | null;
};

export const hasClaimedEnvelope = async (
  db: Pool,
  envelopeId: number,
  claimerId: number,
): Promise<boolean> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT 1 FROM redEnvelopeClaims WHERE envelopeId = ? AND claimerId = ? LIMIT 1",
    [envelopeId, claimerId],
  );
  return rows.length > 0;
};

export const claimRedEnvelope = async (
  db: Pool,
  envelopeId: number,
  claimerId: number,
  amount: number,
): Promise<RedEnvelopeClaim> => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insert claim record
    const [claimResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO redEnvelopeClaims
       (envelopeId, claimerId, amount, claimedAt)
       VALUES (?, ?, ?, ?)`,
      [envelopeId, claimerId, amount, Date.now()],
    );

    // Update envelope claimed count
    await connection.execute(
      "UPDATE redEnvelopes SET claimedCount = claimedCount + 1 WHERE id = ?",
      [envelopeId],
    );

    // Check if envelope is completed
    await connection.execute(
      `UPDATE redEnvelopes SET status = 1
       WHERE id = ? AND claimedCount >= totalCount`,
      [envelopeId],
    );

    await connection.commit();

    return {
      id: claimResult.insertId,
      envelopeId,
      claimerId,
      amount,
      claimedAt: Date.now(),
    } as RedEnvelopeClaim;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getUserRedEnvelopeClaims = async (db: Pool, userId: number): Promise<any[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT c.*, e.envelopeId, e.creatorId
     FROM redEnvelopeClaims c
     JOIN redEnvelopes e ON c.envelopeId = e.id
     WHERE c.claimerId = ?
     ORDER BY c.claimedAt DESC`,
    [userId],
  );
  return rows;
};

// ==========================================
// REFERRAL QUERIES
// ==========================================

export const getUserDeposits = async (
  db: Pool,
  userId: number,
  status?: number,
): Promise<Deposit[]> => {
  let query = "SELECT * FROM deposits WHERE userId = ?";
  const params: (number | number)[] = [userId];

  if (status !== undefined) {
    query += " AND status = ?";
    params.push(status);
  }

  query += " ORDER BY createdAt DESC";

  const [rows] = await db.execute<RowDataPacket[]>(query, params);
  return rows as Deposit[];
};

export const getUserWithdrawals = async (
  db: Pool,
  userId: number,
  status?: number,
): Promise<Withdrawal[]> => {
  let query = "SELECT * FROM withdrawals WHERE userId = ?";
  const params: (number | number)[] = [userId];

  if (status !== undefined) {
    query += " AND status = ?";
    params.push(status);
  }

  query += " ORDER BY requestedAt DESC";

  const [rows] = await db.execute<RowDataPacket[]>(query, params);
  return rows as Withdrawal[];
};

export const getTotalDeposits = async (db: Pool, userId: number): Promise<number> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT COALESCE(SUM(amount), 0) as total FROM deposits WHERE userId = ? AND status = ?",
    [userId, DepositStatus.COMPLETED],
  );
  return Number(rows[0]?.total || 0);
};

export const getTotalWithdrawals = async (db: Pool, userId: number): Promise<number> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE userId = ? AND status = ?",
    [userId, WithdrawalStatus.COMPLETED],
  );
  return Number(rows[0]?.total || 0);
};

export const getTodayWithdrawalCount = async (db: Pool, userId: number): Promise<number> => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM withdrawals WHERE userId = ? AND requestedAt >= ?",
    [userId, startOfDay.getTime()],
  );
  return Number(rows[0]?.count || 0);
};

export const createWithdrawal = async (
  db: Pool,
  data: {
    userId: number;
    orderId: string;
    amount: number;
    bankAccountId: number;
  },
): Promise<Withdrawal> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO withdrawals
     (userId, orderId, amount, status, requestedAt)
     VALUES (?, ?, ?, ?, ?)`,
    [data.userId, data.orderId, data.amount, WithdrawalStatus.PENDING, Date.now()],
  );

  return {
    id: result.insertId,
    ...data,
    status: WithdrawalStatus.PENDING,
    rejectionReason: null,
    requestedAt: Date.now(),
  } as Withdrawal;
};

// ==========================================
// COMMISSION LEVEL QUERIES
// ==========================================

export const getCommissionLevels = async (db: Pool): Promise<CommissionLevel[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM commissionLevels ORDER BY level ASC",
  );
  return rows as CommissionLevel[];
};

export const getUserCommissionLevel = async (
  db: Pool,
  userId: number,
): Promise<CommissionLevel | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT cl.* FROM commissionLevels cl
     JOIN userPoints up ON up.currentLevel = cl.level
     WHERE up.userId = ?`,
    [userId],
  );
  return rows[0] as CommissionLevel | null;
};

// ==========================================
// DEPOSIT QUERIES (for user controller)
// ==========================================

export const createDeposit = async (
  db: Pool,
  data: {
    userId: number;
    orderId: string;
    amount: number;
    status: DepositStatus;
  },
): Promise<Deposit> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO deposits
     (userId, orderId, amount, status, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [data.userId, data.orderId, data.amount, data.status, Date.now()],
  );

  return {
    id: result.insertId,
    ...data,
    utrNumber: null,
    createdAt: Date.now(),
  } as Deposit;
};

export const findDepositByOrderId = async (db: Pool, orderId: string): Promise<Deposit | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM deposits WHERE orderId = ? LIMIT 1",
    [orderId],
  );
  return rows[0] as Deposit | null;
};

export const updateDepositStatus = async (
  db: Pool,
  orderId: string,
  status: DepositStatus,
): Promise<void> => {
  await db.execute("UPDATE deposits SET status = ? WHERE orderId = ?", [status, orderId]);
};

export const deletePendingDeposits = async (db: Pool, userId: number): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    "DELETE FROM deposits WHERE userId = ? AND status = ?",
    [userId, DepositStatus.PENDING],
  );
  return result.affectedRows;
};

// ==========================================
// BETTING QUERIES (for validation)
// ==========================================

export const getTotalBets = async (db: Pool, userId: number): Promise<number> => {
  // This would query your betting/wagering table
  // Placeholder implementation - adjust based on actual schema
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT COALESCE(SUM(amount), 0) as total FROM bets WHERE userId = ? AND status = 1",
    [userId],
  );
  return Number(rows[0]?.total || 0);
};

export const getTodayBets = async (db: Pool, userId: number): Promise<number> => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT COALESCE(SUM(amount), 0) as total FROM bets WHERE userId = ? AND createdAt >= ?",
    [userId, startOfDay.getTime()],
  );
  return Number(rows[0]?.total || 0);
};
