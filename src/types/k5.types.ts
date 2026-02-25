import { z } from "zod";

// Bet Validation Schema
export const K5DBetSchema = z.object({
  join: z.enum(["a", "b", "c", "d", "e", "total"]),
  list_join: z.string().min(1).max(10),
  x: z.string().regex(/^\d+$/, "x must be a positive integer"),
  money: z.number().int().positive(),
  game: z.enum(["1", "3", "5", "10"]),
});

// Game History Schema
export const K5DHistorySchema = z.object({
  gameJoin: z.enum(["1", "3", "5", "10"]),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

// User Bets Schema
export const K5DMyBetsSchema = z.object({
  gameJoin: z.enum(["1", "3", "5", "10"]),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

// Admin Edit Result Schema
export const K5DEditResultSchema = z.object({
  game: z.number().int().min(1).max(10),
  list: z.string(),
});

// TypeScript Types
export type K5DBetInput = z.infer<typeof K5DBetSchema>;
export type K5DHistoryInput = z.infer<typeof K5DHistorySchema>;
export type K5DMyBetsInput = z.infer<typeof K5DMyBetsSchema>;
export type K5DEditResultInput = z.infer<typeof K5DEditResultSchema>;

export interface K5DApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
  [key: string]: unknown;
}

export interface K5DGameSession {
  id: number;
  period: string;
  gameTypeId: number;
  result: string | null;
  status: number;
  startedAt: number;
  closedAt: number | null;
  resultAt: number | null;
}

export interface K5DBetRecord {
  id: number;
  sessionId: number;
  userId: number;
  gameTypeId: number;
  stage: number;
  betAmount: number;
  potentialWin: number;
  fee: number;
  actualWin: number;
  selection: string;
  betType: string;
  result: string | null;
  isWin: boolean | null;
  status: number;
  createdAt: number;
}

export interface K5DBetCalculation {
  total: number;
  fee: number;
  price: number;
}

export interface K5DResult {
  message: string;
  status: boolean;
  money?: number;
  change?: number;
}

export interface K5DHistoryResponse {
  gameslist: K5DGameSession[];
  period?: string;
  page?: number;
}

export interface K5DMyBetsResponse {
  gameslist: Partial<K5DBetRecord>[];
  page: number;
}

// Bet type constants
export type K5DGameDuration = "1" | "3" | "5" | "10";
export type K5DPosition = "a" | "b" | "c" | "d" | "e" | "total";
export type K5DCategory = "b" | "s" | "c" | "l"; // small, big, odd, even

export interface K5DUser {
  id: number;
  phone: string;
  userName: string;
  balance: number;
  authToken: string;
  userLevel: number;
  invitedBy: number | null;
  status: number;
}

export interface K5DCommissionLevel {
  id: number;
  level: number;
  rateF1: number;
  rateF2: number;
  rateF3: number;
  rateF4: number;
}
