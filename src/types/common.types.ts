import { z } from "zod";

// ==========================================
// COMMON SCHEMAS
// ==========================================

export const PaginationSchema = z.object({
  page: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(10),
});

export const DateFilterSchema = z.object({
  timeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

// ==========================================
// COMMON TYPES
// ==========================================

export type PaginationInput = z.infer<typeof PaginationSchema>;
export type DateFilterInput = z.infer<typeof DateFilterSchema>;

export interface ApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number | string;
  code?: number;
  [key: string]: unknown;
}

// ==========================================
// ENTITY TYPES
// ==========================================

export interface CTVUser {
  id: number;
  phone: string;
  referralCode: string;
  level: number;
  status: number;
  balance: number;
  totalMoney: number;
  createdAt: Date | number;
}

export interface CTVMember {
  id: number;
  phone: string;
  balance: number;
  totalMoney: number;
  status: number;
  createdAt: Date | number;
}
