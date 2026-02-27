import { z } from 'zod';
import { ApiResponse } from './common.types';

// Zod Schemas
export const BuffMoneySchema = z.object({
  username: z.string().min(10).max(10), // Phone number
  select: z.enum(['1', '2']), // 1 = add, 2 = subtract
  money: z.number().positive(),
});

export const DailyPaginationSchema = z.object({
  pageno: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(10),
});

export const SettingsSchema = z.object({
  type: z.enum(['get', 'update']).optional(),
  value: z.string().optional(),
});

export const CreateDailyBonusSchema = z.object({
  amount: z.number().positive(),
  count: z.number().int().positive(),
  expiryHours: z.number().int().positive().default(24),
});

// TypeScript Types
export type BuffMoneyInput = z.infer<typeof BuffMoneySchema>;
export type DailyPaginationInput = z.infer<typeof DailyPaginationSchema>;
export type SettingsInput = z.infer<typeof SettingsSchema>;
export type CreateDailyBonusInput = z.infer<typeof CreateDailyBonusSchema>;

export interface DailyCTVUser {
  id: number;
  phone: string;
  referralCode: string;
  level: number;
  status: number;
  balance: number;
  totalMoney: number;
  createdAt: Date | number;
}

export interface DailyCTVMember {
  id: number;
  phone: string;
  balance: number;
  totalMoney: number;
  status: number;
  createdAt: Date | number;
}

export interface RechargeRecord {
  id: number;
  userId: number;
  amount: number;
  status: number;
  createdAt: Date | number;
  userPhone?: string;
}

export interface WithdrawRecord {
  id: number;
  userId: number;
  amount: number;
  status: number;
  createdAt: Date | number;
  userPhone?: string;
}

export interface DailyBetRecord {
  id: number;
  userId: number;
  game: string;
  amount: number;
  result: number;
  winAmount: number;
  status: number;
  createdAt: Date | number;
}

export interface DailyRedEnvelope {
  id: number;
  ctvId: number;
  code: string;
  amount: number;
  remainingCount: number;
  totalCount: number;
  expiryDate: Date | number;
  createdAt: Date | number;
}

export interface DailyApiResponse extends ApiResponse {
  datas?: any;
  f1?: number;
  f2?: number;
  f3?: number;
  f4?: number;
  list_mems?: DailyCTVMember[];
  total_recharge?: number;
  total_withdraw?: number;
  total_recharge_today?: number;
  total_withdraw_today?: number;
  list_mem_baned?: number;
  win?: number;
  loss?: number;
  list_recharge_news?: RechargeRecord[];
  list_withdraw_news?: WithdrawRecord[];
  moneyCTV?: number;
  redenvelopes_used?: number;
  financial_details_today?: number;
  telegram?: string;
  telegram2?: string;
  page_total?: number;
}
