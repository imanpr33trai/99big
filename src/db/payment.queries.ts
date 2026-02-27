import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  DepositRecord,
  PaymentMethod,
  PaymentStatus,
  SalaryRecord,
  TransactionLog,
} from "../types";

// ==========================================
// DEPOSIT QUERIES
// ==========================================

export const findDepositByOrderId = async (
  db: Pool,
  orderId: string,
): Promise<DepositRecord | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM deposits WHERE orderId = ? LIMIT 1",
    [orderId],
  );
  return rows[0] as DepositRecord | null;
};

export const findDepositById = async (db: Pool, id: number): Promise<DepositRecord | null> => {
  const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM deposits WHERE id = ? LIMIT 1", [
    id,
  ]);
  return rows[0] as DepositRecord | null;
};

export const findPendingDepositsByPhone = async (
  db: Pool,
  phone: string,
): Promise<DepositRecord[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT d.* FROM deposits d
     JOIN users u ON d.userId = u.id
     WHERE u.phone = ? AND d.status = ?`,
    [phone, PaymentStatus.PENDING],
  );
  return rows as DepositRecord[];
};

export const findDepositsByUserId = async (
  db: Pool,
  userId: number,
  status?: number,
): Promise<DepositRecord[]> => {
  let query = "SELECT * FROM deposits WHERE userId = ?";
  const params: (number | number)[] = [userId];

  if (status !== undefined) {
    query += " AND status = ?";
    params.push(status);
  }

  query += " ORDER BY createdAt DESC";

  const [rows] = await db.execute<RowDataPacket[]>(query, params);
  return rows as DepositRecord[];
};

export const createDeposit = async (
  db: Pool,
  data: Partial<DepositRecord>,
): Promise<DepositRecord> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO deposits
     (orderId, transactionId, userId, amount, paymentMethodId, status, utrNumber, receiptUrl, ipAddress, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.orderId,
      data.transactionId || null,
      data.userId,
      data.amount,
      data.paymentMethodId || null,
      data.status || PaymentStatus.PENDING,
      data.utrNumber || null,
      data.receiptUrl || null,
      data.ipAddress || null,
      Date.now(),
    ],
  );

  return {
    id: result.insertId,
    ...data,
    createdAt: Date.now(),
  } as DepositRecord;
};

export const updateDepositStatus = async (
  db: Pool,
  id: number,
  status: number,
  processedBy?: number,
): Promise<void> => {
  await db.execute(
    `UPDATE deposits
     SET status = ?, processedAt = ?, processedBy = ?
     WHERE id = ?`,
    [status, Date.now(), processedBy || null, id],
  );
};

export const updateDepositStatusByOrderId = async (
  db: Pool,
  orderId: string,
  status: number,
): Promise<void> => {
  await db.execute("UPDATE deposits SET status = ?, processedAt = ? WHERE orderId = ?", [
    status,
    Date.now(),
    orderId,
  ]);
};

export const cancelDeposit = async (db: Pool, id: number): Promise<void> => {
  await db.execute("UPDATE deposits SET status = ? WHERE id = ? AND status = ?", [
    PaymentStatus.CANCELLED,
    id,
    PaymentStatus.PENDING,
  ]);
};

export const deletePendingDeposits = async (db: Pool, phone: string): Promise<void> => {
  await db.execute(
    `UPDATE deposits d
     JOIN users u ON d.userId = u.id
     SET d.status = ?
     WHERE u.phone = ? AND d.status = ?`,
    [PaymentStatus.CANCELLED, phone, PaymentStatus.PENDING],
  );
};

/**
 * Get pending deposits (from admin.queries.ts)
 */
export const getPendingDepositsAdmin = async (db: Pool): Promise<any[]> => {
  const [rows] = await db.execute(
    `SELECT d.id, d.orderId, d.userId, d.amount, d.status, d.utrNumber, d.createdAt,
            u.phone as userPhone, u.userName
     FROM deposits d
     JOIN users u ON d.userId = u.id
     WHERE d.status = 0
     ORDER BY d.createdAt DESC`,
    [],
  );
  return rows as any[];
};

/**
 * Get processed deposits (completed/failed) (from admin.queries.ts)
 */
export const getProcessedDepositsAdmin = async (db: Pool, limit: number = 100): Promise<any[]> => {
  const [rows] = await db.execute(
    `SELECT d.id, d.orderId, d.userId, d.amount, d.status, d.utrNumber, d.createdAt,
            u.phone as userPhone, u.userName
     FROM deposits d
     JOIN users u ON d.userId = u.id
     WHERE d.status IN (2, 3)
     ORDER BY d.createdAt DESC
     LIMIT ?`,
    [limit],
  );
  return rows as any[];
};

/**
 * Get pending withdrawals (from admin.queries.ts)
 */
export const getPendingWithdrawalsAdmin = async (db: Pool): Promise<any[]> => {
  const [rows] = await db.execute(
    `SELECT w.id, w.orderId, w.userId, w.amount, w.fee, w.netAmount, w.status,
            w.rejectionReason, w.requestedAt, u.phone as userPhone, u.userName
     FROM withdrawals w
     JOIN users u ON w.userId = u.id
     WHERE w.status = 0
     ORDER BY w.requestedAt DESC`,
    [],
  );
  return rows as any[];
};

/**
 * Get processed withdrawals (from admin.queries.ts)
 */
export const getProcessedWithdrawalsAdmin = async (
  db: Pool,
  limit: number = 100,
): Promise<any[]> => {
  const [rows] = await db.execute(
    `SELECT w.id, w.orderId, w.userId, w.amount, w.fee, w.netAmount, w.status,
            w.rejectionReason, w.requestedAt, u.phone as userPhone, u.userName
     FROM withdrawals w
     JOIN users u ON w.userId = u.id
     WHERE w.status IN (1, 2, 3)
     ORDER BY w.requestedAt DESC
     LIMIT ?`,
    [limit],
  );
  return rows as any[];
};

/**
 * Get deposit by ID (from admin.queries.ts)
 */
export const getDepositByIdAdmin = async (db: Pool, id: number): Promise<any | null> => {
  const [rows] = await db.execute(
    `SELECT d.id, d.orderId, d.userId, d.amount, d.status, d.utrNumber, d.createdAt,
            u.phone as userPhone, u.userName
     FROM deposits d
     JOIN users u ON d.userId = u.id
     WHERE d.id = ?`,
    [id],
  );
  return (rows as any[])[0] || null;
};

/**
 * Get withdrawal by ID (from admin.queries.ts)
 */
export const getWithdrawalByIdAdmin = async (db: Pool, id: number): Promise<any | null> => {
  const [rows] = await db.execute(
    `SELECT w.id, w.orderId, w.userId, w.amount, w.fee, w.netAmount, w.status,
            w.rejectionReason, w.requestedAt
     FROM withdrawals w
     WHERE w.id = ?`,
    [id],
  );
  return (rows as any[])[0] || null;
};

/**
 * Update deposit status (from admin.queries.ts)
 */
export const updateDepositStatusAdmin = async (
  db: Pool,
  id: number,
  status: number,
  utrNumber?: string,
): Promise<void> => {
  if (utrNumber) {
    await db.execute("UPDATE deposits SET status = ?, utrNumber = ? WHERE id = ?", [
      status,
      utrNumber,
      id,
    ]);
  } else {
    await db.execute("UPDATE deposits SET status = ? WHERE id = ?", [status, id]);
  }
};

/**
 * Update withdrawal status (from admin.queries.ts)
 */
export const updateWithdrawalStatusAdmin = async (
  db: Pool,
  id: number,
  status: number,
  reason?: string,
): Promise<void> => {
  if (reason) {
    await db.execute("UPDATE withdrawals SET status = ?, rejectionReason = ? WHERE id = ?", [
      status,
      reason,
      id,
    ]);
  } else {
    await db.execute("UPDATE withdrawals SET status = ? WHERE id = ?", [status, id]);
  }
};

export const getDepositsByUsersDaily = async (
  db: Pool,
  userIds: number[],
  startDate?: Date,
  endDate?: Date,
): Promise<any[]> => {
  if (userIds.length === 0) return [];

  const placeholders = userIds.map(() => "?").join(",");
  let query = `SELECT id, userId, amount, status, createdAt FROM deposits WHERE userId IN (${placeholders}) AND status = 2`;
  const params: (number | Date)[] = [...userIds];

  if (startDate && endDate) {
    query += ` AND createdAt BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  const [rows] = await db.execute<RowDataPacket[]>(query, params);
  return rows as any[];
};

export const getWithdrawalsByUsersDaily = async (
  db: Pool,
  userIds: number[],
  startDate?: Date,
  endDate?: Date,
): Promise<any[]> => {
  if (userIds.length === 0) return [];

  const placeholders = userIds.map(() => "?").join(",");
  let query = `SELECT id, userId, amount, status, createdAt FROM withdrawals WHERE userId IN (${placeholders}) AND status = 2`;
  const params: (number | Date)[] = [...userIds];

  if (startDate && endDate) {
    query += ` AND createdAt BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }

  const [rows] = await db.execute<RowDataPacket[]>(query, params);
  return rows as any[];
};

export const getUserDepositsUser = async (
  db: Pool,
  userId: number,
  status?: number,
): Promise<any[]> => {
  let query = "SELECT * FROM deposits WHERE userId = ?";
  const params: (number | number)[] = [userId];

  if (status !== undefined) {
    query += " AND status = ?";
    params.push(status);
  }

  query += " ORDER BY createdAt DESC";

  const [rows] = await db.execute<RowDataPacket[]>(query, params);
  return rows as any[];
};

export const getUserWithdrawalsUser = async (
  db: Pool,
  userId: number,
  status?: number,
): Promise<any[]> => {
  let query = "SELECT * FROM withdrawals WHERE userId = ?";
  const params: (number | number)[] = [userId];

  if (status !== undefined) {
    query += " AND status = ?";
    params.push(status);
  }

  query += " ORDER BY requestedAt DESC";

  const [rows] = await db.execute<RowDataPacket[]>(query, params);
  return rows as any[];
};

export const getTotalDepositsUser = async (db: Pool, userId: number): Promise<number> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT COALESCE(SUM(amount), 0) as total FROM deposits WHERE userId = ? AND status = 2",
    [userId, 2], // DepositStatus.COMPLETED is usually 2
  );
  return Number(rows[0]?.total || 0);
};

export const getTotalWithdrawalsUser = async (db: Pool, userId: number): Promise<number> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE userId = ? AND status = 2",
    [userId, 2], // WithdrawalStatus.COMPLETED is usually 2
  );
  return Number(rows[0]?.total || 0);
};

export const getTodayWithdrawalCountUser = async (db: Pool, userId: number): Promise<number> => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM withdrawals WHERE userId = ? AND requestedAt >= ?",
    [userId, startOfDay.getTime()],
  );
  return Number(rows[0]?.count || 0);
};

export const createWithdrawalUser = async (
  db: Pool,
  data: {
    userId: number;
    orderId: string;
    amount: number;
    bankAccountId: number;
  },
): Promise<any> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO withdrawals
     (userId, orderId, amount, status, requestedAt)
     VALUES (?, ?, ?, ?, ?)`,
    [data.userId, data.orderId, data.amount, 0, Date.now()], // WithdrawalStatus.PENDING is usually 0
  );

  return {
    id: result.insertId,
    ...data,
    status: 0,
    rejectionReason: null,
    requestedAt: Date.now(),
  } as any;
};

export const createDepositUser = async (
  db: Pool,
  data: {
    userId: number;
    orderId: string;
    amount: number;
    status: number;
  },
): Promise<any> => {
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
  } as any;
};

export const findDepositByOrderIdUser = async (db: Pool, orderId: string): Promise<any | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM deposits WHERE orderId = ? LIMIT 1",
    [orderId],
  );
  return rows[0] as any | null;
};

export const updateDepositStatusUser = async (
  db: Pool,
  orderId: string,
  status: number,
): Promise<void> => {
  await db.execute("UPDATE deposits SET status = ? WHERE orderId = ?", [status, orderId]);
};

export const deletePendingDepositsUser = async (db: Pool, userId: number): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    "DELETE FROM deposits WHERE userId = ? AND status = 0",
    [
      userId,
      0, // DepositStatus.PENDING is usually 0
    ],
  );
  return result.affectedRows;
};

// ==========================================
// PAYMENT METHOD QUERIES
// ==========================================

export const getPaymentMethods = async (
  db: Pool,
  activeOnly: boolean = true,
): Promise<PaymentMethod[]> => {
  let query = "SELECT * FROM paymentMethods";
  if (activeOnly) {
    query += " WHERE isActive = true";
  }
  query += " ORDER BY displayOrder ASC";

  const [rows] = await db.execute<RowDataPacket[]>(query);
  return rows as PaymentMethod[];
};

export const getPaymentMethodByType = async (
  db: Pool,
  type: string,
): Promise<PaymentMethod | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM paymentMethods WHERE type = ? AND isActive = true LIMIT 1",
    [type],
  );
  return rows[0] as PaymentMethod | null;
};

export const updatePaymentMethod = async (
  db: Pool,
  type: string,
  data: Partial<PaymentMethod>,
): Promise<void> => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  await db.execute(`UPDATE paymentMethods SET ${setClause} WHERE type = ?`, [...values, type]);
};

export const createPaymentMethod = async (
  db: Pool,
  data: Partial<PaymentMethod>,
): Promise<PaymentMethod> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO paymentMethods
     (type, bankName, accountName, accountNumber, ifscCode, upiId, cryptoAddress, qrCodeUrl, isActive, displayOrder, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.type,
      data.bankName || null,
      data.accountName || null,
      data.accountNumber || null,
      data.ifscCode || null,
      data.upiId || null,
      data.cryptoAddress || null,
      data.qrCodeUrl || null,
      data.isActive ?? true,
      data.displayOrder || 0,
      Date.now(),
    ],
  );

  return {
    id: result.insertId,
    ...data,
    createdAt: Date.now(),
  } as PaymentMethod;
};

// ==========================================
// COMMISSION QUERIES
// ==========================================

export const createSalaryRecord = async (
  db: Pool,
  data: Partial<SalaryRecord>,
): Promise<SalaryRecord> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO salaryRecords
     (userId, amount, type, description, periodStart, periodEnd, isPaid, paidAt, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.userId,
      data.amount,
      data.type,
      data.description,
      data.periodStart,
      data.periodEnd,
      data.isPaid || false,
      data.paidAt || null,
      Date.now(),
    ],
  );

  return {
    id: result.insertId,
    ...data,
    createdAt: Date.now(),
  } as SalaryRecord;
};

export const getDepositBonusConfig = async (db: Pool): Promise<Record<string, number>> => {
  // Fetch from configuration table or return defaults
  return {
    firstDepositPercentage: 0.15,
    regularDepositPercentage: 0.05,
    maxFreeBonusPercentage: 0.1,
  };
};

// ==========================================
// TRANSACTION LOG QUERIES
// ==========================================

export const createTransactionLog = async (
  db: Pool,
  data: Partial<TransactionLog>,
): Promise<TransactionLog> => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO transactionLogs
     (userId, relatedUserId, typeId, amount, balanceBefore, balanceAfter, referenceId, referenceType, description, ipAddress, userAgent, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.userId,
      data.relatedUserId || null,
      data.typeId,
      data.amount,
      data.balanceBefore,
      data.balanceAfter,
      data.referenceId || null,
      data.referenceType || null,
      data.description,
      data.ipAddress || null,
      data.userAgent || null,
      Date.now(),
    ],
  );

  return {
    id: BigInt(result.insertId),
    ...data,
    createdAt: Date.now(),
  } as TransactionLog;
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

export const getCurrentTimeForTodayField = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")} ${date.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}`;
};

export const getDMYDateOfTodayField = (today: string): string => {
  const parts = today.split(" ");
  if (parts.length > 0) {
    const dateParts = parts[0].split("-");
    if (dateParts.length === 3) {
      return `${dateParts[1]}-${dateParts[2]}-${dateParts[0]}`;
    }
  }
  return today;
};
