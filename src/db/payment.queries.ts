import moment from "moment";
import { Pool } from "mysql2/promise";
import dbConfigPool from "../config/db.config";
import {
  PaymentBalanceTransferRecord,
  PaymentBankRecord,
  PaymentCommissionRecord,
  PaymentLevelRecord,
  PaymentMethod,
  PaymentPointRecord,
  PaymentRechargeRecord,
  PaymentRedEnvelopeRecord,
  PaymentStatus,
  PaymentTurnoverRecord,
  PaymentUserBankRecord,
  PaymentWithdrawRecord,
  RechargeRecord,
} from "../types/payment.types";

export const getRechargesByPhoneAndStatus = async (
  db: Pool,
  phone: string,
  status: PaymentStatus,
  type?: PaymentMethod,
): Promise<RechargeRecord[]> => {
  let query = "SELECT * FROM recharges WHERE phone = ? AND status = ?";
  const params: any[] = [phone, status];

  if (type) {
    query += " AND type = ?";
    params.push(type);
  }

  const [rows] = await db.execute(query, params);

  return (rows as any[]).map((item) => ({
    id: item.id,
    orderId: item.orderId,
    transactionId: item.transactionId,
    utr: item.utr,
    phone: item.phone,
    money: item.money,
    type: item.type,
    status: item.status,
    today: item.today,
    url: item.url,
    time: item.time,
  }));
};

export const cancelRechargeById = async (db: Pool, id: number): Promise<void> => {
  await db.execute("UPDATE recharges SET status = 2 WHERE id = ?", [id]);
};

export const getRechargeByOrderId = async (
  db: Pool,
  orderId: string,
): Promise<RechargeRecord | null> => {
  const [rows] = await db.execute("SELECT * FROM recharges WHERE orderId = ?", [orderId]);

  if ((rows as any[]).length === 0) return null;

  const item = (rows as any[])[0];
  return {
    id: item.id,
    orderId: item.orderId,
    transactionId: item.transactionId,
    utr: item.utr,
    phone: item.phone,
    money: item.money,
    type: item.type,
    status: item.status,
    today: item.today,
    url: item.url,
    time: item.time,
  };
};

export const setRechargeStatusSuccess = async (
  db: Pool,
  id: number,
  orderId: string,
): Promise<void> => {
  await db.execute("UPDATE recharges SET status = 1 WHERE id = ? AND orderId = ?", [id, orderId]);
};

export const createRecharge = async (
  db: Pool,
  recharge: RechargeRecord,
): Promise<RechargeRecord> => {
  const [result] = await db.execute(
    `INSERT INTO recharges (orderId, transactionId, phone, money, type, status, today, url, time, utr)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      recharge.orderId,
      recharge.transactionId || "NULL",
      recharge.phone,
      recharge.money,
      recharge.type,
      recharge.status,
      recharge.today,
      recharge.url || "0",
      recharge.time,
      recharge.utr || "NULL",
    ],
  );

  const [rows] = await db.execute("SELECT * FROM recharges WHERE orderId = ?", [recharge.orderId]);

  if ((rows as any[]).length === 0) {
    throw new Error("Unable to create recharge!");
  }

  const item = (rows as any[])[0];
  return {
    id: item.id,
    orderId: item.orderId,
    transactionId: item.transactionId,
    utr: item.utr,
    phone: item.phone,
    money: item.money,
    type: item.type,
    status: item.status,
    today: item.today,
    url: item.url,
    time: item.time,
  };
};

export const getCurrentTimeForTodayField = (): string => {
  return moment().format("YYYY-DD-MM h:mm:ss A");
};

export const getDMYDateOfTodayField = (today: string): string => {
  return moment(today, "YYYY-DD-MM h:mm:ss A").format("DD-MM-YYYY");
};

export const paymentQueryFindRechargeByPhoneAndStatus = async (
  phone: string,
  status: number,
): Promise<PaymentRechargeRecord[]> => {
  const [rows] = await dbConfigPool.execute<PaymentRechargeRecord[]>(
    "SELECT * FROM recharge WHERE phone = ? AND status = ? ORDER BY id DESC",
    [phone, status],
  );
  return rows;
};

export const paymentQueryFindRechargeByOrderId = async (
  orderId: string,
): Promise<PaymentRechargeRecord | null> => {
  const [rows] = await dbConfigPool.execute<PaymentRechargeRecord[]>(
    "SELECT * FROM recharge WHERE id_order = ?",
    [orderId],
  );
  return rows[0] || null;
};

export const paymentQueryFindRechargeByUTR = async (
  utr: string,
): Promise<PaymentRechargeRecord | null> => {
  const [rows] = await dbConfigPool.execute<PaymentRechargeRecord[]>(
    "SELECT * FROM recharge WHERE utr = ?",
    [utr],
  );
  return rows[0] || null;
};

export const paymentQueryCreateRecharge = async (data: {
  id_order: string;
  transaction_id: string;
  phone: string;
  money: number;
  type: string;
  status: number;
  today: string;
  url: string;
  time: number;
}): Promise<void> => {
  await dbConfigPool.execute(
    `INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, url, time)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id_order,
      data.transaction_id,
      data.phone,
      data.money,
      data.type,
      data.status,
      data.today,
      data.url,
      data.time,
    ],
  );
};

export const paymentQueryUpdateRechargeStatus = async (
  orderId: string,
  status: number,
): Promise<void> => {
  await dbConfigPool.execute("UPDATE recharge SET status = ? WHERE id_order = ?", [
    status,
    orderId,
  ]);
};

export const paymentQueryUpdateRechargeUTR = async (
  phone: string,
  orderId: string,
  utr: string,
): Promise<void> => {
  await dbConfigPool.execute("UPDATE recharge SET utr = ? WHERE phone = ? AND id_order = ?", [
    utr,
    phone,
    orderId,
  ]);
};

export const paymentQueryDeletePendingRecharge = async (phone: string): Promise<void> => {
  await dbConfigPool.execute("DELETE FROM recharge WHERE phone = ? AND status = ?", [phone, 0]);
};

export const paymentQueryFindWithdrawByPhoneAndStatus = async (
  phone: string,
  status: number,
): Promise<PaymentWithdrawRecord[]> => {
  const [rows] = await dbConfigPool.execute<PaymentWithdrawRecord[]>(
    "SELECT * FROM withdraw WHERE phone = ? AND status = ?",
    [phone, status],
  );
  return rows;
};

export const paymentQueryFindWithdrawByPhoneAndToday = async (
  phone: string,
  today: string,
): Promise<PaymentWithdrawRecord[]> => {
  const [rows] = await dbConfigPool.execute<PaymentWithdrawRecord[]>(
    "SELECT * FROM withdraw WHERE phone = ? AND today = ?",
    [phone, today],
  );
  return rows;
};

export const paymentQueryCreateWithdraw = async (data: {
  id_order: string;
  phone: string;
  money: number;
  stk: string;
  name_bank: string;
  ifsc: string;
  name_user: string;
  status: number;
  today: string;
  time: number;
}): Promise<void> => {
  await dbConfigPool.execute(
    `INSERT INTO withdraw (id_order, phone, money, stk, name_bank, ifsc, name_user, status, today, time)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id_order,
      data.phone,
      data.money,
      data.stk,
      data.name_bank,
      data.ifsc,
      data.name_user,
      data.status,
      data.today,
      data.time,
    ],
  );
};

export const paymentQueryFindUserBankByPhone = async (
  phone: string,
): Promise<PaymentUserBankRecord[]> => {
  const [rows] = await dbConfigPool.execute<PaymentUserBankRecord[]>(
    "SELECT * FROM user_bank WHERE phone = ?",
    [phone],
  );
  return rows;
};

export const paymentQueryFindUserBankBySTK = async (
  stk: string,
): Promise<PaymentUserBankRecord[]> => {
  const [rows] = await dbConfigPool.execute<PaymentUserBankRecord[]>(
    "SELECT * FROM user_bank WHERE stk = ?",
    [stk],
  );
  return rows;
};

export const paymentQueryCreateUserBank = async (data: {
  phone: string;
  name_bank: string;
  name_user: string;
  stk: string;
  email: string;
  tinh: string;
  time: number;
}): Promise<void> => {
  await dbConfigPool.execute(
    `INSERT INTO user_bank (phone, name_bank, name_user, stk, email, tinh, time)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.phone, data.name_bank, data.name_user, data.stk, data.email, data.tinh, data.time],
  );
};

export const paymentQueryUpdateUserBank = async (data: {
  phone: string;
  name_bank: string;
  name_user: string;
  stk: string;
  email: string;
  tinh: string;
  time: number;
}): Promise<void> => {
  await dbConfigPool.execute(
    `UPDATE user_bank SET name_bank = ?, name_user = ?, stk = ?, email = ?, tinh = ?, time = ?
     WHERE phone = ?`,
    [data.name_bank, data.name_user, data.stk, data.email, data.tinh, data.time, data.phone],
  );
};

export const paymentQueryUpdateUserBankSTK = async (stk: string, phone: string): Promise<void> => {
  await dbConfigPool.execute("UPDATE user_bank SET stk = ? WHERE phone = ?", [stk, phone]);
};

export const paymentQueryFindBankRecharge = async (): Promise<PaymentBankRecord[]> => {
  const [rows] = await dbConfigPool.execute<PaymentBankRecord[]>("SELECT * FROM bank_recharge", []);
  return rows;
};

export const paymentQueryFindBalanceTransferBySender = async (
  phone: string,
): Promise<PaymentBalanceTransferRecord[]> => {
  const [rows] = await dbConfigPool.execute<PaymentBalanceTransferRecord[]>(
    "SELECT * FROM balance_transfer WHERE sender_phone = ?",
    [phone],
  );
  return rows;
};

export const paymentQueryFindBalanceTransferByReceiver = async (
  phone: string,
): Promise<PaymentBalanceTransferRecord[]> => {
  const [rows] = await dbConfigPool.execute<PaymentBalanceTransferRecord[]>(
    "SELECT * FROM balance_transfer WHERE receiver_phone = ?",
    [phone],
  );
  return rows;
};

export const paymentQueryCreateBalanceTransfer = async (data: {
  sender_phone: string;
  receiver_phone: string;
  amount: number;
  time: number;
}): Promise<void> => {
  await dbConfigPool.execute(
    `INSERT INTO balance_transfer (sender_phone, receiver_phone, amount, time)
     VALUES (?, ?, ?, ?)`,
    [data.sender_phone, data.receiver_phone, data.amount, data.time],
  );
};

export const paymentQueryFindPointByPhone = async (
  phone: string,
): Promise<PaymentPointRecord | null> => {
  const [rows] = await dbConfigPool.execute<PaymentPointRecord[]>(
    "SELECT * FROM point_list WHERE phone = ?",
    [phone],
  );
  return rows[0] || null;
};

export const paymentQueryUpdatePointTotal = async (
  phone: string,
  field: string,
  value: number,
): Promise<void> => {
  await dbConfigPool.execute(`UPDATE point_list SET ${field} = ? WHERE phone = ?`, [value, phone]);
};

export const paymentQueryFindRedEnvelopeById = async (
  id: string,
): Promise<PaymentRedEnvelopeRecord | null> => {
  const [rows] = await dbConfigPool.execute<PaymentRedEnvelopeRecord[]>(
    "SELECT * FROM redenvelopes WHERE id_redenvelope = ?",
    [id],
  );
  return rows[0] || null;
};

export const paymentQueryUpdateRedEnvelopeStatus = async (id: string): Promise<void> => {
  await dbConfigPool.execute(
    "UPDATE redenvelopes SET used = ?, status = ? WHERE id_redenvelope = ?",
    [0, 1, id],
  );
};

export const paymentQueryCreateRedEnvelopeUsed = async (data: {
  phone: string;
  phone_used: string;
  id_redenvelops: string;
  money: number;
  time: number;
}): Promise<void> => {
  await dbConfigPool.execute(
    `INSERT INTO redenvelopes_used (phone, phone_used, id_redenvelops, money, time)
     VALUES (?, ?, ?, ?, ?)`,
    [data.phone, data.phone_used, data.id_redenvelops, data.money, data.time],
  );
};

export const paymentQueryFindLevel = async (): Promise<PaymentLevelRecord[]> => {
  const [rows] = await dbConfigPool.execute<PaymentLevelRecord[]>("SELECT * FROM level", []);
  return rows;
};

export const paymentQueryFindUsersByInvite = async (inviteCode: string): Promise<any[]> => {
  const [rows] = await dbConfigPool.execute<any[]>(
    "SELECT phone, code, invite, time FROM users WHERE invite = ?",
    [inviteCode],
  );
  return rows;
};

export const paymentQueryFindUsersByInviteWithDetails = async (
  inviteCode: string,
): Promise<any[]> => {
  const [rows] = await dbConfigPool.execute<any[]>(
    `SELECT id_user, name_user, phone, code, invite, rank, user_level, total_money
     FROM users WHERE invite = ?`,
    [inviteCode],
  );
  return rows;
};

export const paymentQueryFindTurnoverByPhone = async (
  phone: string,
): Promise<PaymentTurnoverRecord | null> => {
  const [rows] = await dbConfigPool.execute<PaymentTurnoverRecord[]>(
    "SELECT * FROM turn_over WHERE phone = ?",
    [phone],
  );
  return rows[0] || null;
};

export const paymentQueryFindRosesByInvite = async (inviteCode: string): Promise<any[]> => {
  const [rows] = await dbConfigPool.execute<any[]>(
    "SELECT f1, invite, code, phone, time FROM roses WHERE invite = ? ORDER BY id DESC LIMIT 100",
    [inviteCode],
  );
  return rows;
};

export const paymentQueryFindMinutes1ByPhone = async (phone: string): Promise<any[]> => {
  const [rows] = await dbConfigPool.execute<any[]>("SELECT * FROM minutes_1 WHERE phone = ?", [
    phone,
  ]);
  return rows;
};

export const paymentQueryFindCommissionByInvite = async (
  code: string,
): Promise<PaymentCommissionRecord[]> => {
  const [rows] = await dbConfigPool.execute<PaymentCommissionRecord[]>(
    "SELECT * FROM roses WHERE invite = ?",
    [code],
  );
  return rows;
};
