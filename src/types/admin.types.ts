import { z } from "zod";

// Admin Authentication Schemas
export const AdminLoginSchema = z.object({
  phone: z.string().min(10).max(20),
  password: z.string().min(6),
});

export const AdminRegisterSchema = z.object({
  phone: z.string().min(10).max(20),
  password: z.string().min(6),
  userName: z.string().min(2).max(100),
  inviteCode: z.string().optional(),
  userLevel: z.enum(["0", "1", "2"]).default("0"), // 0=user, 1=admin, 2=ctv
});

export const PaginationSchema = z.object({
  page: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(10),
});

export const UserInfoSchema = z.object({
  phone: z.string().min(10).max(20),
});

export const RechargeActionSchema = z.object({
  id: z.number().int().positive(),
  type: z.enum(["confirm", "cancel"]),
  utrNumber: z.string().optional(),
});

export const WithdrawActionSchema = z.object({
  id: z.number().int().positive(),
  type: z.enum(["confirm", "cancel"]),
  reason: z.string().optional(),
});

export const SettingBankSchema = z.object({
  type: z.enum(["bank", "upi", "crypto"]),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  upiId: z.string().optional(),
  cryptoAddress: z.string().optional(),
  qrCodeUrl: z.string().optional(),
});

export const SettingCskhSchema = z.object({
  telegram: z.string().optional(),
  whatsapp: z.string().optional(),
  supportEmail: z.string().optional(),
});

export const BannedSchema = z.object({
  phone: z.string().min(10).max(20),
  status: z.enum(["0", "1", "2"]), // 0=active, 1=suspended, 2=banned
});

export const CreateBonusSchema = z.object({
  amount: z.number().positive(),
  count: z.number().int().positive(),
  userId: z.number().int().positive(),
});

export const SettingBuffSchema = z.object({
  phone: z.string().min(10).max(20),
  amount: z.number(),
  type: z.enum(["add", "subtract"]),
  reason: z.string(),
});

export const ChangeAdminSchema = z.object({
  game: z.enum(["wingo", "5d", "k3"]),
  duration: z.enum(["1", "3", "5", "10"]),
  value: z.string(),
});

export const TotalJoinSchema = z.object({
  gameJoin: z.enum(["1", "3", "5", "10"]),
});

export const EditResultSchema = z.object({
  game: z.number().int().min(1).max(10),
  list: z.string(),
});

export const CreateSalarySchema = z.object({
  phone: z.string().min(10).max(20),
  amount: z.number().positive(),
  type: z.enum(["daily", "weekly", "monthly"]),
});

export const UpdateLevelSchema = z.object({
  level: z.number().int().min(0).max(10),
  rateF1: z.number().min(0).max(100),
  rateF2: z.number().min(0).max(100),
  rateF3: z.number().min(0).max(100),
  rateF4: z.number().min(0).max(100),
  minTurnover: z.number().positive(),
});

export const ListCTVSchema = z.object({
  page: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(10),
});

// TypeScript Types
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
export type AdminRegisterInput = z.infer<typeof AdminRegisterSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type UserInfoInput = z.infer<typeof UserInfoSchema>;
export type RechargeActionInput = z.infer<typeof RechargeActionSchema>;
export type WithdrawActionInput = z.infer<typeof WithdrawActionSchema>;
export type SettingBankInput = z.infer<typeof SettingBankSchema>;
export type SettingCskhInput = z.infer<typeof SettingCskhSchema>;
export type BannedInput = z.infer<typeof BannedSchema>;
export type CreateBonusInput = z.infer<typeof CreateBonusSchema>;
export type SettingBuffInput = z.infer<typeof SettingBuffSchema>;
export type ChangeAdminInput = z.infer<typeof ChangeAdminSchema>;
export type TotalJoinInput = z.infer<typeof TotalJoinSchema>;
export type EditResultInput = z.infer<typeof EditResultSchema>;
export type CreateSalaryInput = z.infer<typeof CreateSalarySchema>;
export type UpdateLevelInput = z.infer<typeof UpdateLevelSchema>;
export type ListCTVInput = z.infer<typeof ListCTVSchema>;

export interface AdminApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
  [key: string]: unknown;
}

export interface AdminAuthPayload {
  userId: number;
  phone: string;
  userLevel: number;
  authToken: string;
}

export interface UserFinancialData {
  totalDeposit: number;
  totalWithdraw: number;
  totalBet: number;
  totalWin: number;
  balance: number;
}

export interface StatisticalData {
  totalUsers: number;
  todayUsers: number;
  totalDeposits: number;
  todayDeposits: number;
  totalWithdrawals: number;
  todayWithdrawals: number;
  totalBets: number;
  todayBets: number;
  platformProfit: number;
}

export interface CTVInfoData {
  ctvId: number;
  ctvName: string;
  f1Count: number;
  f2Count: number;
  f3Count: number;
  f4Count: number;
  todayF1: number;
  todayF2: number;
  todayF3: number;
  todayF4: number;
  totalCommission: number;
  todayCommission: number;
}

export interface RechargeStats {
  pending: number;
  completed: number;
  totalAmount: number;
}

export interface WithdrawStats {
  pending: number;
  completed: number;
  rejected: number;
  totalAmount: number;
}

export interface GameStatistics {
  gameType: string;
  totalBets: number;
  totalBetAmount: number;
  totalWinAmount: number;
  profit: number;
}

export interface ReferralHierarchy {
  f1: Array<{ id: number; phone: string; userName: string; createdAt: number }>;
  f2: Array<{ id: number; phone: string; userName: string; createdAt: number }>;
  f3: Array<{ id: number; phone: string; userName: string; createdAt: number }>;
  f4: Array<{ id: number; phone: string; userName: string; createdAt: number }>;
}

export interface CommissionData {
  level: number;
  rateF1: number;
  rateF2: number;
  rateF3: number;
  rateF4: number;
  minTurnover: number;
}

export interface AdminUser {
  id: number;
  phone: string;
  userName: string;
  passwordHash: string;
  authToken: string;
  balance: number;
  referralCode: string;
  invitedBy: number | null;
  isVerified: boolean;
  status: number;
  userLevel: number;
  createdAt: number;
}

export interface DepositRecord {
  id: number;
  orderId: string;
  userId: number;
  amount: number;
  status: number;
  utrNumber: string | null;
  createdAt: number;
  userPhone?: string;
  userName?: string;
}

export interface WithdrawalRecord {
  id: number;
  orderId: string;
  userId: number;
  amount: number;
  fee: number;
  netAmount: number;
  status: number;
  rejectionReason: string | null;
  requestedAt: number;
  userPhone?: string;
  userName?: string;
}
