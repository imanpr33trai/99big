import { Pool } from 'mysql2/promise';
import {
  createDeposit,
  updateDepositStatus,
  deletePendingDeposits,
  findUserByPhone
} from '../../db/payment.queries';
import { DepositRecord, PaymentStatus, PaymentMethodType } from '../../types/payment.types';
import { generateOrderId, getCurrentTimeForTodayField } from '../../utils';
import { processDepositCredit } from './paymentHelpers.service';

/**
 * Create deposit record
 */
export const createDepositRecord = async (
  db: Pool,
  data: {
    orderId?: string;
    transactionId: string | null;
    utr: string | null;
    phone: string;
    money: number;
    type: PaymentMethodType;
    status: PaymentStatus;
    today?: string;
    url: string;
    time?: string | number;
    ipAddress?: string;
  }
): Promise<DepositRecord> => {
  const user = await findUserByPhone(db, data.phone);
  if (!user) {
    throw new Error('User not found');
  }

  const orderId = data.orderId || generateOrderId();

  const deposit = await createDeposit(db, {
    orderId,
    transactionId: data.transactionId,
    userId: user.id,
    amount: data.money,
    status: data.status,
    utrNumber: data.utr,
    receiptUrl: data.url,
    ipAddress: data.ipAddress || null,
    createdAt: Date.now(),
  });

  return {
    ...deposit,
    phone: data.phone,
    today: data.today || getCurrentTimeForTodayField(),
    url: data.url,
    time: data.time || Date.now(),
  };
};

/**
 * Cancel pending deposits for user
 */
export const cancelPendingDeposits = async (db: Pool, phone: string): Promise<void> => {
  await deletePendingDeposits(db, phone);
};

/**
 * Process manual deposit (UPI Manual or USDT Manual)
 */
export const processManualDeposit = async (db: Pool, deposit: DepositRecord): Promise<void> => {
  // Manual deposits require admin approval
  // This function is called when admin approves the deposit
  await updateDepositStatus(db, deposit.id, PaymentStatus.PROCESSING);

  try {
    await processDepositCredit(db, deposit);
    await updateDepositStatus(db, deposit.id, PaymentStatus.COMPLETED);
  } catch (error) {
    console.error('Manual deposit processing error:', error);
    await updateDepositStatus(db, deposit.id, PaymentStatus.FAILED);
    throw error;
  }
};

/**
 * Process gateway deposit (UPI Gateway or WowPay)
 */
export const processGatewayDeposit = async (db: Pool, deposit: DepositRecord): Promise<void> => {
  await updateDepositStatus(db, deposit.id, PaymentStatus.PROCESSING);

  try {
    await processDepositCredit(db, deposit);
    await updateDepositStatus(db, deposit.id, PaymentStatus.COMPLETED);
  } catch (error) {
    console.error('Gateway deposit processing error:', error);
    await updateDepositStatus(db, deposit.id, PaymentStatus.FAILED);
    throw error;
  }
};

/**
 * Handle deposit verification callback
 */
export const handleDepositVerification = async (
  db: Pool,
  deposit: DepositRecord,
  verified: boolean
): Promise<void> => {
  if (verified) {
    await processGatewayDeposit(db, deposit);
  } else {
    await updateDepositStatus(db, deposit.id, PaymentStatus.FAILED);
  }
};
