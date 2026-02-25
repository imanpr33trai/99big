import { z } from "zod";

// ==========================================
// ZOD SCHEMAS
// ==========================================

export const PaymentMethodSchema = z.object({
  type: z.enum(["bank", "upi", "crypto", "wallet"]),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  upiId: z.email().optional(),
  cryptoAddress: z.string().optional(),
  qrCodeUrl: z.url().optional(),
});

export const UPIPaymentSchema = z.object({
  money: z.number().int().positive(),
});

export const UPIPaymentVerifySchema = z.object({
  client_txn_id: z.string(),
});

export const ManualPaymentSchema = z.object({
  money: z.number().int().positive(),
  utr: z.string().length(12),
});

export const USDTPaymentSchema = z.object({
  money: z.number().int().positive(),
  utr: z.string().min(1),
});

export const WowPaySchema = z.object({
  money: z.number().int().positive(),
});

export const WowPayCallbackSchema = z.object({
  mchId: z.string(),
  amount: z.string(),
  mchOrderNo: z.string(),
  merRetMsg: z.string(),
  orderDate: z.string(),
  orderNo: z.string(),
  oriAmount: z.string(),
  tradeResult: z.string(),
  signType: z.string(),
  sign: z.string(),
});

// ==========================================
// ENUMS
// ==========================================

export enum PaymentStatus {
  PENDING = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELLED = 4,
}

export enum PaymentMethodType {
  UPI_GATEWAY = "upi_gateway",
  UPI_MANUAL = "upi_manual",
  USDT_MANUAL = "usdt_manual",
  WOW_PAY = "wow_pay",
  BANK = "bank",
  CRYPTO = "crypto",
}

// ==========================================
// INTERFACES
// ==========================================

export interface PaymentApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number | string;
  urls?: {
    web_url: string;
    bhim_link: string;
    phonepe_link: string;
    paytm_link: string;
    gpay_link: string;
  };
  recharge?: DepositRecord;
  payment_url?: string;
  [key: string]: unknown;
}

export interface PaymentMethod {
  id: number;
  type: PaymentMethodType;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  upiId: string | null;
  cryptoAddress: string | null;
  qrCodeUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: number;
}

export interface DepositRecord {
  id: number;
  orderId: string;
  transactionId: string | null;
  userId: number;
  amount: number;
  paymentMethodId: number | null;
  status: PaymentStatus;
  utrNumber: string | null;
  receiptUrl: string | null;
  processedAt: number | null;
  processedBy: number | null;
  remarks: string | null;
  ipAddress: string | null;
  createdAt: number;
  // Additional fields for internal use
  phone?: string;
  today?: string;
  url?: string;
  time?: string | number;
}

export interface User {
  id: number;
  phone: string;
  userName: string;
  balance: number;
  referralCode: string;
  invitedBy: number | null;
  firstDepositBonus: boolean;
  freeBonus: number;
  createdAt: number;
  updatedAt: number;
}

export interface EKQRResponse {
  status: boolean;
  msg?: string;
  data: {
    payment_url: string;
    upi_intent?: {
      bhim_link: string;
      phonepe_link: string;
      paytm_link: string;
      gpay_link: string;
    };
    status: "created" | "scanning" | "success" | "failure" | "close";
  };
}

export interface WowPayResponse {
  respCode: string;
  respMsg: string;
  payInfo: string;
  mchOrderNo: string;
  sign: string;
}

export interface WowPayCallbackParams {
  mchId: string;
  amount: string;
  mchOrderNo: string;
  merRetMsg: string;
  orderDate: string;
  orderNo: string;
  oriAmount: string;
  tradeResult: string;
  signType: string;
  sign: string;
}

export interface DepositBonus {
  isFirstDeposit: boolean;
  bonusPercentage: number;
  freeBonus: number;
  salary: number;
}

export interface EKQRConfig {
  key: string;
  p_info: string;
  email: string;
  redirect_url: string;
}

export interface WowPayConfig {
  mch_id: string;
  mch_key: string;
  pay_type: string;
  notify_url: string;
  page_url: string;
}

export interface SalaryRecord {
  id?: number;
  userId: number;
  amount: number;
  type: string;
  description: string;
  periodStart: string;
  periodEnd: string;
  isPaid: boolean;
  paidAt: number | null;
  createdAt: number;
}

export interface TransactionLog {
  id?: bigint;
  userId: number;
  relatedUserId?: number | null;
  typeId: number;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId?: number;
  referenceType?: string;
  description: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: number;
}

// Type exports for Zod schemas
export type UPIPaymentInput = z.infer<typeof UPIPaymentSchema>;
export type ManualPaymentInput = z.infer<typeof ManualPaymentSchema>;
export type USDTPaymentInput = z.infer<typeof USDTPaymentSchema>;
export type WowPayInput = z.infer<typeof WowPaySchema>;
export type WowPayCallbackInput = z.infer<typeof WowPayCallbackSchema>;
