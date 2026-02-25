// src/types/admin.types.ts
import { RowDataPacket } from "mysql2/promise";
import { z } from "zod";

// ============================================
// ENUM DEFINITIONS
// ============================================

export const UserStatusEnum = z.enum(["active", "suspended", "banned"]);
export type UserStatus = z.infer<typeof UserStatusEnum>;

export const UserLevelEnum = z.enum(["user", "admin", "ctv"]);
export type UserLevel = z.infer<typeof UserLevelEnum>;

export const TransactionStatusEnum = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "rejected",
]);
export type TransactionStatus = z.infer<typeof TransactionStatusEnum>;

export const DepositStatusEnum = z.enum(["pending", "processing", "completed", "failed"]);
export type DepositStatus = z.infer<typeof DepositStatusEnum>;

export const WithdrawalStatusEnum = z.enum(["pending", "processing", "completed", "rejected"]);
export type WithdrawalStatus = z.infer<typeof WithdrawalStatusEnum>;

export const BetStatusEnum = z.enum(["pending", "won", "lost", "cancelled"]);
export type BetStatus = z.infer<typeof BetStatusEnum>;

export const GameTypeEnum = z.enum(["wingo", "5d", "k3"]);
export type GameType = z.infer<typeof GameTypeEnum>;

export const PaymentTypeEnum = z.enum(["bank", "upi", "crypto", "wallet"]);
export type PaymentType = z.infer<typeof PaymentTypeEnum>;

export const BankAccountTypeEnum = z.enum(["bank", "upi", "crypto"]);
export type BankAccountType = z.infer<typeof BankAccountTypeEnum>;

// ============================================
// DATABASE ROW TYPES (MySQL2 RowDataPacket)
// ============================================

export interface UserRow extends RowDataPacket {
  id: number;
  phone: string;
  userName: string;
  passwordHash: string;
  plainPassword?: string;
  authToken: string | null;
  balance: string;
  referralCode: string;
  invitedBy: number | null;
  isCollaborator: boolean;
  isVerified: boolean;
  otpCode: string | null;
  otpExpiresAt: number;
  otpAttempts: number;
  lastLoginIp: string | null;
  status: number; // 0=active, 1=suspended, 2=banned
  createdAt: number;
  updatedAt: number;
  userLevel: number; // 0=user, 1=admin, 2=ctv
  commissionLevel: number;
  totalDeposited: string;
  totalWithdrawn: string;
  totalBet: string;
  totalWon: string;
  commissionF1: string;
  commissionF2: string;
  commissionF3: string;
  commissionF4: string;
  commissionToday: string;
  rank: number;
  freeBonus: number;
  firstDepositBonus: boolean;
}

export interface GameSessionRow extends RowDataPacket {
  id: number;
  period: string;
  gameTypeId: number;
  result: string | null;
  status: number;
  startedAt: number;
  closedAt: number;
  resultAt: number;
  createdAt: number;
}

export interface DepositRow extends RowDataPacket {
  id: number;
  orderId: string;
  transactionId: string | null;
  userId: number;
  amount: string;
  paymentMethodId: number | null;
  status: number;
  utrNumber: string | null;
  receiptUrl: string | null;
  processedAt: number | null;
  processedBy: number | null;
  remarks: string | null;
  ipAddress: string | null;
  createdAt: number;
  userPhone?: string; // Joined field
}

export interface WithdrawalRow extends RowDataPacket {
  id: number;
  orderId: string;
  userId: number;
  amount: string;
  fee: string;
  netAmount: string;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  upiId: string | null;
  status: number;
  requestedAt: number;
  processedAt: number | null;
  processedBy: number | null;
  remarks: string | null;
  rejectionReason: string | null;
  ipAddress: string | null;
  userPhone?: string; // Joined field
}

export interface BetRow extends RowDataPacket {
  id: number;
  sessionId: number;
  userId: number;
  gameTypeId: number;
  stage: number;
  betAmount: string;
  odds: string;
  potentialWin: string;
  fee: string;
  actualWin: string;
  selection: string;
  betType: string | null;
  result: string | null;
  isWin: boolean | null;
  status: number;
  settledAt: number | null;
  createdAt: number;
}

export interface CommissionLevelRow extends RowDataPacket {
  id: number;
  level: number;
  name: string;
  rateF1: string;
  rateF2: string;
  rateF3: string;
  rateF4: string;
  minTurnover: string;
  createdAt: number;
}

export interface AdminConfigRow extends RowDataPacket {
  id: number;
  configKey: string;
  configValue: string | null;
  description: string | null;
  updatedBy: number | null;
  updatedAt: number;
}

export interface SalaryRecordRow extends RowDataPacket {
  id: number;
  userId: number;
  amount: string;
  type: string;
  description: string | null;
  periodStart: Date | null;
  periodEnd: Date | null;
  isPaid: boolean;
  paidAt: number | null;
  createdAt: number;
  userPhone?: string; // Joined field
}

export interface PaymentMethodRow extends RowDataPacket {
  id: number;
  type: PaymentType;
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

export interface UserBankAccountRow extends RowDataPacket {
  id: number;
  userId: number;
  type: BankAccountType;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  upiId: string | null;
  cryptoAddress: string | null;
  email: string | null;
  phone: string | null;
  province: string | null;
  branch: string | null;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: number;
}

export interface RedEnvelopeRow extends RowDataPacket {
  id: number;
  envelopeId: string;
  creatorId: number;
  totalAmount: string;
  totalCount: number;
  claimedCount: number;
  claimedAmount: string;
  status: number;
  expiredAt: number;
  createdAt: number;
}

export interface UserPointsRow extends RowDataPacket {
  id: number;
  userId: number;
  points: string;
  pointsUs: string;
  telegramId: string | null;
  totalWeek1: string;
  totalWeek2: string;
  totalWeek3: string;
  totalWeek4: string;
  totalWeek5: string;
  totalWeek6: string;
  totalWeek7: string;
  currentLevel: number;
  updatedAt: number;
}

export interface GameTypeRow extends RowDataPacket {
  id: number;
  code: string;
  name: string;
  description: string | null;
  createdAt: number;
}

// ============================================
// ZOD VALIDATION SCHEMAS
// ============================================

export const AdminLoginSchema = z.object({
  phone: z.string().min(10).max(20).regex(/^\d+$/),
  password: z.string().min(6).max(100),
});

export const AdminRegisterSchema = z.object({
  username: z.string().min(10).max(20).regex(/^\d+$/),
  password: z.string().min(6).max(100),
  invitecode: z.string().optional().default("2cOCs36373"),
});

export const PaginationSchema = z.object({
  pageno: z.number().int().min(0),
  limit: z.number().int().min(1).max(100),
});

export const UserInfoSchema = z.object({
  phone: z.string().min(10).max(20),
});

export const RechargeActionSchema = z.object({
  id: z.number().int().positive(),
  type: z.enum(["confirm", "delete"]),
});

export const WithdrawActionSchema = z.object({
  id: z.number().int().positive(),
  type: z.enum(["confirm", "delete"]),
  remark: z.string().max(255).optional(),
});

export const SettingBankSchema = z.object({
  typer: z.enum(["bank", "momo"]),
  name_bank: z.string().max(100).optional(),
  name: z.string().max(100).optional(),
  info: z.string().max(100).optional(),
  qr: z.string().max(255).optional(),
  bank_name: z.string().max(100).optional(),
  username: z.string().max(100).optional(),
  upi_id: z.string().max(100).optional(),
  usdt_wallet_address: z.string().max(255).optional(),
});

export const SettingCskhSchema = z.object({
  telegram: z.string().max(255),
  cskh: z.string().max(255),
  myapp_web: z.string().max(255).default("#"),
});

export const BannedSchema = z.object({
  id: z.number().int().positive(),
  type: z.enum(["open", "close"]),
});

export const CreateBonusSchema = z.object({
  money: z.number().positive(),
  type: z.enum(["all", "two", "one", "three"]).optional(),
  select: z.enum(["1", "2"]).optional(),
  phone: z.string().min(10).max(20).optional(),
});

export const SettingBuffSchema = z.object({
  id_user: z.number().int().positive(),
  buff_acc: z.enum(["1", "2"]),
  money_value: z.number().positive(),
});

export const ChangeAdminSchema = z.object({
  value: z.string(),
  type: z.enum(["change-wingo1", "change-win_rate"]),
  typeid: z.enum(["1", "2", "3", "4"]),
});

export const TotalJoinSchema = z.object({
  typeid: z.enum(["1", "2", "3", "4"]),
});

export const EditResultSchema = z.object({
  game: z.number().int().min(1).max(10),
  list: z.string(),
});

export const CreateSalarySchema = z.object({
  phone: z.string().regex(/^\d{10}$/),
  amount: z.number().positive(),
  type: z.string().min(1).max(50),
});

export const UpdateLevelSchema = z.object({
  id: z.number().int().positive(),
  f1: z.number().min(0).max(1),
  f2: z.number().min(0).max(1),
  f3: z.number().min(0).max(1),
  f4: z.number().min(0).max(1),
});

export const ListCTVSchema = z.object({
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1).max(100),
});

export const GameJoinSchema = z.object({
  gameJoin: z.enum(["1", "3", "5", "10"]),
});

// ============================================
// REQUEST/RESPONSE TYPES
// ============================================

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
export type GameJoinInput = z.infer<typeof GameJoinSchema>;

// ============================================
// API RESPONSE TYPES
// ============================================

export interface AdminApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
  code?: number;
  errors?: z.ZodIssue[];
  [key: string]: unknown;
}

export interface AdminAuthPayload {
  id: number;
  phone: string;
  userLevel: number;
  status: number;
}

export interface UserFinancialData {
  user: Omit<UserRow, "passwordHash" | "authToken" | "plainPassword">;
  totalRecharge: number;
  totalWithdraw: number;
  f1: number;
  f2: number;
  f3: number;
  f4: number;
  f1Today: number;
  fAllToday: number;
  bankUser: UserBankAccountRow | null;
  telegram: string | null;
  ngMoi: string | null;
  daily: string | null;
}

export interface StatisticalData {
  win: number;
  loss: number;
  usersOnline: number;
  usersOffline: number;
  recharges: number;
  withdraws: number;
  rechargeToday: number;
  withdrawToday: number;
}

export interface CTVInfoData {
  user: UserRow;
  f1: number;
  f2: number;
  f3: number;
  f4: number;
  listMems: UserRow[];
  totalRecharge: number;
  totalWithdraw: number;
  totalRechargeToday: number;
  totalWithdrawToday: number;
  listMemBaned: number;
  win: number;
  loss: number;
  listRechargeNews: DepositRow[];
  listWithdrawNews: WithdrawalRow[];
  moneyCTV: number;
  redenvelopesUsed: unknown[];
  financialDetailsToday: unknown[];
}

export interface RechargeStats {
  pending: DepositRow[];
  processed: DepositRow[];
}

export interface WithdrawStats {
  pending: WithdrawalRow[];
  processed: WithdrawalRow[];
}

export interface GameStatistics {
  wingoall: BetRow[];
  lotterys: GameSessionRow[];
  listOrders: GameSessionRow[];
  setting: AdminConfigRow[];
}

export interface ReferralHierarchy {
  f1: UserRow[];
  f2: UserRow[];
  f3: UserRow[];
  f4: UserRow[];
  f1Today: number;
  f2Today: number;
  f3Today: number;
  f4Today: number;
}

export interface CommissionData {
  totalCommission: number;
  f1Commission: number;
  f2Commission: number;
  f3Commission: number;
  f4Commission: number;
}

// ============================================
// EXPRESS EXTENSIONS
// ============================================

declare global {
  namespace Express {
    interface Request {
      admin?: AdminAuthPayload;
    }
  }
}
