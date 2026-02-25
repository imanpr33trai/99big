import { z } from "zod";

// ==========================================
// ZOD SCHEMAS
// ==========================================

// Authentication
export const UserVerifyCodeSchema = z.object({
  // Empty body - just triggers OTP send
});

export const UserChangePasswordSchema = z.object({
  password: z.string().min(6, "Current password required"),
  newPassWord: z.string().min(6, "New password must be at least 6 characters"),
});

export const UserChangeInfoSchema = z.object({
  name: z.string().min(3).max(50),
  type: z.enum(["editname"]),
});

// Check-in
export const UserCheckInSchema = z.object({
  data: z.number().int().min(1).max(7).optional(),
});

// Banking
export const UserBankSchema = z.object({
  name_bank: z.string().min(3, "Bank name required"),
  name_user: z.string().min(3, "Account holder name required"),
  stk: z.string().min(5, "Account number required"),
  email: z.email("Valid email required"),
  tinh: z.string().min(1, "State/City required"),
});

export const UserInfoBankSchema = z.object({
  // No body required
});

// Withdrawal
export const UserWithdrawSchema = z.object({
  money: z.number().int().min(299, "Minimum withdrawal is ₹299"),
  password: z.string().min(6, "Password required"),
});

// Transfer
export const UserTransferSchema = z.object({
  amount: z.number().int().positive("Amount must be positive"),
  phone: z.string().min(10, "Valid phone number required"),
});

// Red Envelope
export const UserRedEnvelopeSchema = z.object({
  code: z.string().min(1, "Red envelope code required"),
});

// Recharge
export const UserRechargeSchema = z.object({
  money: z.number().int().positive("Amount must be positive"),
  type: z.string().optional(),
});

export const UserUpdateRechargeSchema = z.object({
  money: z.number().int().positive(),
  id_order: z.string().min(1, "Order ID required"),
  inputData: z.string().min(1, "UTR/Transaction ID required"),
});

export const UserConfirmRechargeSchema = z.object({
  client_txn_id: z.string().min(1, "Transaction ID required"),
});

// Search
export const UserSearchSchema = z.object({
  phone: z.string().min(10, "Valid phone number required"),
});

// ==========================================
// ENUMS
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

export enum DepositStatus {
  PENDING = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELLED = 4,
}

export enum WithdrawalStatus {
  PENDING = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  REJECTED = 3,
}

export enum BankAccountType {
  BANK = "bank",
  UPI = "upi",
  CRYPTO = "crypto",
}

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
  createdAt: number;
  updatedAt: number;
  freeBonus: number;
  firstDepositBonus: boolean;
}

export interface UserFinancialData {
  code: string;
  id_user: number;
  name_user: string;
  phone_user: string;
  money_user: number;
  totalRecharge: number;
  totalWithdraw: number;
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

export interface CheckInReward {
  day: number;
  requiredDeposit: number;
  reward: number;
}

export const CHECK_IN_REWARDS: CheckInReward[] = [
  { day: 1, requiredDeposit: 300, reward: 300 },
  { day: 2, requiredDeposit: 3000, reward: 3000 },
  { day: 3, requiredDeposit: 6000, reward: 6000 },
  { day: 4, requiredDeposit: 12000, reward: 12000 },
  { day: 5, requiredDeposit: 28000, reward: 28000 },
  { day: 6, requiredDeposit: 100000, reward: 100000 },
  { day: 7, requiredDeposit: 200000, reward: 200000 },
];

export interface BankAccount {
  id: number;
  userId: number;
  type: BankAccountType;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string | null;
  isDefault: boolean;
  isVerified: boolean;
}

export interface Deposit {
  id: number;
  orderId: string;
  userId: number;
  amount: number;
  status: DepositStatus;
  utrNumber: string | null;
  createdAt: number;
}

export interface Withdrawal {
  id: number;
  orderId: string;
  userId: number;
  amount: number;
  status: WithdrawalStatus;
  rejectionReason: string | null;
  requestedAt: number;
}

export interface RedEnvelope {
  id: number;
  envelopeId: string;
  creatorId: number;
  totalAmount: number;
  totalCount: number;
  claimedCount: number;
  status: number;
  expiredAt: number;
}

export interface RedEnvelopeClaim {
  id: number;
  envelopeId: number;
  claimerId: number;
  amount: number;
  claimedAt: number;
}

export interface CheckInRecord {
  id: number;
  userId: number;
  consecutiveDays: number;
  rewardAmount: number;
  checkInDate: string;
  createdAt: number;
}

export interface Transfer {
  id: number;
  senderId: number;
  receiverId: number;
  amount: number;
  status: number;
  createdAt: number;
}

export interface CommissionLevel {
  id: number;
  level: number;
  rateF1: number;
  rateF2: number;
  rateF3: number;
  rateF4: number;
  minTurnover: number;
}

// Type exports for Zod schemas
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
