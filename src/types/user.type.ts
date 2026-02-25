import { z } from "zod";

export const userVerifyCodeSchema = z.object({
  // No body required, uses auth cookie
});

export const userChangeInfoSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["editname"]).or(z.string()),
});

export const userChangePasswordSchema = z.object({
  password: z.string().min(1),
  newPassWord: z.string().min(6),
});

export const userCheckInSchema = z.object({
  data: z.number().int().min(0).max(7).optional(),
});

export const userBankSchema = z.object({
  name_bank: z.string().min(1).max(100),
  name_user: z.string().min(1).max(100),
  stk: z.string().min(1).max(50),
  email: z.email().max(150),
  tinh: z.string().min(1).max(100),
});

export const userWithdrawSchema = z.object({
  money: z.number().positive().min(300),
  password: z.string().min(1),
});

export const userTransferSchema = z.object({
  amount: z.number().positive(),
  phone: z.string().min(10).max(20),
});

export const userRedEnvelopeSchema = z.object({
  code: z.string().min(1).max(50),
});

export const userRechargeSchema = z.object({
  money: z.number().positive(),
  type: z.enum(["momo", "upi", "usdt", "wallet", "wowpay", "cancel"]),
  typeid: z.string().optional(),
});

export const userUpdateRechargeSchema = z.object({
  money: z.number().positive(),
  id_order: z.string().min(1),
  inputData: z.string().min(1).max(12),
});

export const userConfirmRechargeSchema = z.object({
  client_txn_id: z.string().min(1),
});

export const userSearchSchema = z.object({
  phone: z.string().min(10).max(20),
});

export const userCancelRechargeSchema = z.object({
  // Uses auth cookie only
});

export const userInfoBankSchema = z.object({
  // Uses auth cookie only
});

export const userTransferHistorySchema = z.object({
  // Uses auth cookie only
});

export const userListRechargeSchema = z.object({
  // Uses auth cookie only
});

export const userListWithdrawSchema = z.object({
  // Uses auth cookie only
});

export const userPromotionSchema = z.object({
  // Uses auth cookie only
});

export const userMyTeamSchema = z.object({
  // Uses auth cookie only
});

export const userListMyTeamSchema = z.object({
  // Uses auth cookie only
});

export const userRecharge2Schema = z.object({
  // Uses auth cookie only
});

export const userAviatorSchema = z.object({
  // Uses auth cookie only
});

export const userCallbackBankSchema = z.object({
  transaction_id: z.string().min(1),
  client_transaction_id: z.string().min(1),
  amount: z.string().or(z.number()),
  requested_datetime: z.string().optional(),
  expired_datetime: z.string().optional(),
  payment_datetime: z.string().optional(),
  status: z.number().or(z.string()),
});

export const userConfirmUSDTRechargeSchema = z.object({
  // Empty or add fields if needed
});

export type UserVerifyCodeInput = z.infer<typeof userVerifyCodeSchema>;
export type UserChangeInfoInput = z.infer<typeof userChangeInfoSchema>;
export type UserChangePasswordInput = z.infer<typeof userChangePasswordSchema>;
export type UserCheckInInput = z.infer<typeof userCheckInSchema>;
export type UserBankInput = z.infer<typeof userBankSchema>;
export type UserWithdrawInput = z.infer<typeof userWithdrawSchema>;
export type UserTransferInput = z.infer<typeof userTransferSchema>;
export type UserRedEnvelopeInput = z.infer<typeof userRedEnvelopeSchema>;
export type UserRechargeInput = z.infer<typeof userRechargeSchema>;
export type UserUpdateRechargeInput = z.infer<typeof userUpdateRechargeSchema>;
export type UserConfirmRechargeInput = z.infer<typeof userConfirmRechargeSchema>;
export type UserSearchInput = z.infer<typeof userSearchSchema>;
export type UserCancelRechargeInput = z.infer<typeof userCancelRechargeSchema>;
export type UserCallbackBankInput = z.infer<typeof userCallbackBankSchema>;

export interface UserRecord {
  id: number;
  phone: string;
  userName: string;
  passwordHash: string;
  plainPassword: string;
  authToken: string | null;
  balance: number;
  referralCode: string;
  invitedBy: number | null;
  isCollaborator: boolean;
  isVerified: boolean;
  otpCode: string | null;
  otpExpiresAt: bigint;
  otpAttempts: number;
  lastLoginIp: string | null;
  status: UserStatusEnum;
  createdAt: bigint;
  updatedAt: bigint;
  userLevel: number;
  commissionLevel: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalBet: number;
  totalWon: number;
  commissionF1: number;
  commissionF2: number;
  commissionF3: number;
  commissionF4: number;
  commissionToday: number;
  rank: number;
  freeBonus: number;
  firstDepositBonus: boolean;
}

export interface UserSafeInfo {
  id: number;
  phone: string;
  userName: string;
  referralCode: string;
  invitedBy: number | null;
  balance: number;
  freeBonus: number;
  firstDepositBonus: boolean;
  isVerified: boolean;
  status: UserStatusEnum;
}

export interface UserAuthRequest {
  id: number;
  phone: string;
  userName: string;
  referralCode: string;
  invitedBy: number | null;
  balance: number;
}

export interface UserApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp: number;
  [key: string]: any;
}
export enum UserStatusEnum {
  ACTIVE = 0,
  SUSPENDED = 1,
  BANNED = 2,
}

export enum UserRoleEnum {
  SUPER = "super",
  ADMIN = "admin",
  MODERATOR = "moderator",
  FINANCE = "finance",
}

export enum UserLevelEnum {
  USER = 0,
  AGENT = 1,
  ADMIN = 2,
}

export interface UserRecord {
  id: number;
  phone: string;
  userName: string;
  passwordHash: string;
  plainPassword: string;
  authToken: string | null;
  balance: number;
  referralCode: string;
  invitedBy: number | null;
  isCollaborator: boolean;
  isVerified: boolean;
  otpCode: string | null;
  otpExpiresAt: bigint;
  otpAttempts: number;
  lastLoginIp: string | null;
  status: UserStatusEnum;
  createdAt: bigint;
  updatedAt: bigint;
  userLevel: number;
  commissionLevel: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalBet: number;
  totalWon: number;
  commissionF1: number;
  commissionF2: number;
  commissionF3: number;
  commissionF4: number;
  commissionToday: number;
  rank: number;
  freeBonus: number;
  firstDepositBonus: boolean;
}

export interface UserBankAccount {
  id: number;
  userId: number;
  type: "bank" | "upi" | "crypto";
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  upiId: string | null;
  cryptoAddress: string | null;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: bigint;
}

export interface UserReferralInfo {
  f1: number;
  f2: number;
  f3: number;
  f4: number;
  f1Today: number;
  fAllToday: number;
  totalReferrals: number;
}
