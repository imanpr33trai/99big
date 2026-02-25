import { z } from "zod";

// ==========================================
// ZOD SCHEMAS
// ==========================================

export const K3BetSchema = z.object({
  listJoin: z.string().min(1).max(10),
  game: z.enum(["1", "3", "5", "10"]),
  gameJoin: z.enum(["1", "2", "3", "4"]),
  xvalue: z.number().int().positive(),
  money: z.number().int().positive(),
});

export const K3HistorySchema = z.object({
  gameJoin: z.enum(["1", "3", "5", "10"]),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

export const K3MyBetsSchema = z.object({
  gameJoin: z.enum(["1", "3", "5", "10"]),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

export const K3EditResultSchema = z.object({
  game: z.number().int().min(1).max(10),
  list: z.string(),
});

// ==========================================
// INTERFACES
// ==========================================

export interface K3ApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
  code?: number;
  msg?: string;
  page?: number;
  period?: string;
  bet?: K3BetRecord[];
  settings?: any[];
  join?: string;
  [key: string]: unknown;
}

export interface K3GameSession {
  id: number;
  period: string;
  gameTypeId: number;
  result: string | null;
  status: number;
  startedAt: number;
  closedAt: number | null;
  resultAt: number | null;
  createdAt: number;
}

export interface K3BetRecord {
  id: number;
  productId: number;
  referralCode: number;
  invitedBy: number;
  userLevel: number;
  sessionId: number;
  userId: number;
  odds: number;
  gameTypeId: number;
  stage: number;
  betAmount: number;
  joinBet: number;
  potentialWin: number;
  quantity: number;
  game: number;
  fee: number;
  winAmount: number;
  actualWin: number;
  selection: string;
  betType: string;
  result: string | null;
  isWin: boolean | null;
  status: number;
  createdAt: number;
}

export interface K3BetCalculation {
  total: number;
  fee: number;
  price: number;
  typeGame: string;
}

export interface K3Result {
  message: string;
  status: boolean;
  money?: number;
  change?: number;
}

export interface K3HistoryResponse {
  gameslist: K3GameSession[];
  period?: string;
  page?: number;
  bet?: K3BetRecord[];
  settings?: any[];
  join?: string;
}

export interface K3MyBetsResponse {
  gameslist: Partial<K3BetRecord>[];
  page: number;
}

// ==========================================
// TYPE ALIASES
// ==========================================

export type K3GameDuration = "1" | "3" | "5" | "10";
export type K3GameJoin = "1" | "2" | "3" | "4";
export type K3GameType = "total" | "two-same" | "three-same" | "unlike";
export type K3BetSelection = "b" | "s" | "c" | "l" | string;

// ==========================================
// CONSTANTS
// ==========================================

export const K3_GAME_DURATIONS = ["1", "3", "5", "10"] as const;
export const K3_BET_AMOUNTS = [1000, 10000, 100000, 1000000] as const;
export const K3_JOIN_TYPES = ["a", "b", "c", "d", "e", "total"] as const;
export const K3_NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

// Type exports
export type K3BetInput = z.infer<typeof K3BetSchema>;
export type K3HistoryInput = z.infer<typeof K3HistorySchema>;
export type K3MyBetsInput = z.infer<typeof K3MyBetsSchema>;
export type K3EditResultInput = z.infer<typeof K3EditResultSchema>;
