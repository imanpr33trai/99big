import { z } from "zod";

// ==========================================
// USER ENUMS
// ==========================================

export enum UserStatus {
  ACTIVE = 0,
  SUSPENDED = 1,
  BANNED = 2,
}

export enum UserLevel {
  USER = 0,
  ADMIN = 1,
  CTV = 2,
}

export enum UserDepositStatus {
  PENDING = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELLED = 4,
}

export enum UserWithdrawalStatus {
  PENDING = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  REJECTED = 3,
}

export enum UserBankAccountType {
  BANK = "bank",
  UPI = "upi",
  CRYPTO = "crypto",
}

// ==========================================
// ZOD SCHEMAS
// ==========================================

export const UserVerifyCodeSchema = z.object({});

export const UserChangePasswordSchema = z.object({
  password: z.string().min(6),
  newPassWord: z.string().min(6),
});

export const UserChangeInfoSchema = z.object({
  name: z.string().min(3).max(50),
  type: z.enum(["editname"]),
});

export const UserCheckInSchema = z.object({
  data: z.number().int().min(1).max(7).optional(),
});

export const UserBankSchema = z.object({
  name_bank: z.string().min(3),
  name_user: z.string().min(3),
  stk: z.string().min(5),
  email: z.email(),
  tinh: z.string().min(1),
});

export const UserWithdrawSchema = z.object({
  money: z.number().int().min(299),
  password: z.string().min(6),
});

export const UserTransferSchema = z.object({
  amount: z.number().int().positive(),
  phone: z.string().min(10),
});

export const UserRedEnvelopeSchema = z.object({
  code: z.string().min(1),
});

export const UserRechargeSchema = z.object({
  money: z.number().int().positive(),
  type: z.string().optional(),
});

export const UserUpdateRechargeSchema = z.object({
  money: z.number().int().positive(),
  id_order: z.string().min(1),
  inputData: z.string().min(1),
});

export const UserConfirmRechargeSchema = z.object({
  client_txn_id: z.string().min(1),
});

export const UserSearchSchema = z.object({
  phone: z.string().min(10),
});

// ==========================================
// INTERFACES
// ==========================================

export interface UserApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
  [key: string]: unknown;
}

export interface UserAuthPayload {
  userId: number;
  phone: string;
  userLevel: number;
}

export interface User {
  id: number;
  phone: string;
  userName: string;
  passwordHash: string;
  authToken: string | null;
  balance: number;
  referralCode: string;
  invitedBy: number | null;
  isVerified: boolean;
  otpCode: string | null;
  otpExpiresAt: number | null;
  otpAttempts: number;
  status: UserStatus;
  userLevel: UserLevel;
  createdAt: string; // SQL BIGINT but often handled as string in raw SQL to avoid overflow
  updatedAt: string;
  freeBonus: number;
  firstDepositBonus: boolean;
  totalDeposited: string;
  totalWithdrawn: string;
  totalBet: string;
  totalWon: string;
}

export interface UserFinancialData {
  code: string;
  id_user: number;
  name_user: string;
  phone_user: string;
  money_user: string; // DECIMAL
  totalRecharge: string;
  totalWithdraw: string;
  freeBonus: number;
}

export interface ReferralData {
  f1: number;
  f2: number;
  f3: number;
  f4: number;
  total_f: number;
  f1_today: number;
  f_all_today: number;
  roses_f1: number;
  roses_f: number;
  roses_all: number;
  roses_today: number;
}

export interface TeamMember {
  id_user: number;
  name_user: string;
  phone: string;
  code: string;
  invite: string;
  rank: number;
  total_money: number;
  invite_count: number;
  user_level: number;
  daily_turn_over: number;
  total_turn_over: number;
}

export interface UserBankAccount {
  id: number;
  userId: number;
  type: UserBankAccountType;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string | null;
  isDefault: boolean;
  isVerified: boolean;
}

export interface DepositRecord {
  id: number;
  orderId: string;
  transactionId: string | null;
  userId: number;
  amount: string; // DECIMAL(15,2)
  paymentMethodId: number | null;
  status: UserDepositStatus;
  utrNumber: string | null;
  receiptUrl: string | null;
  processedAt: string | null; // BIGINT as string
  processedBy: number | null;
  remarks: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface TransactionLog {
  id?: string; // BIGINT as string
  userId: number;
  relatedUserId?: number | null;
  typeId: number;
  amount: string; // DECIMAL(15,2)
  balanceBefore: string;
  balanceAfter: string;
  referenceId?: number;
  referenceType?: string;
  description: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export type UserChangePasswordInput = z.infer<typeof UserChangePasswordSchema>;
export type UserChangeInfoInput = z.infer<typeof UserChangeInfoSchema>;
export type UserCheckInInput = z.infer<typeof UserCheckInSchema>;
export type UserBankInput = z.infer<typeof UserBankSchema>;
export type UserWithdrawInput = z.infer<typeof UserWithdrawSchema>;
export type UserTransferInput = z.infer<typeof UserTransferSchema>;
export type UserRedEnvelopeInput = z.infer<typeof UserRedEnvelopeSchema>;
export type UserRechargeInput = z.infer<typeof UserRechargeSchema>;
export type UserUpdateRechargeInput = z.infer<typeof UserUpdateRechargeSchema>;
export type UserConfirmRechargeInput = z.infer<typeof UserConfirmRechargeSchema>;
export type UserSearchInput = z.infer<typeof UserSearchSchema>;
