import z from "zod";

export interface CommissionLevel {
  level: number;
  rateF1: number;
  rateF2: number;
  rateF3: number;
  rateF4: number;
}

export interface ReferrerInfo {
  phone: string;
  referralCode: string;
  invitedBy: string;
  rank: number;
}

export interface CommissionDistribution {
  level: number;
  phone: string;
  amount: number;
  rate: number;
}

export const commissionDistributionSchema = z.object({
  authToken: z.string().min(1, "Auth token required"),
  amount: z.number().positive("Amount must be positive"),
  sourceType: z.string().default("bet"),
});

export type CommissionDistributionInput = z.infer<typeof commissionDistributionSchema>;

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

export const K3_GAME_DURATIONS = ["1", "3", "5", "10"] as const;
export const K3_BET_AMOUNTS = ["1000", "10000", "100000", "1000000"] as const;
export const K3_JOIN_TYPES = ["a", "b", "c", "d", "e", "total"] as const;
export const K3_NUMBER_BETS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
export const K3_STRING_BETS = ["c", "l", "b", "s"] as const;

export type K3GameDuration = (typeof K3_GAME_DURATIONS)[number];

export type K3BetAmount = (typeof K3_BET_AMOUNTS)[number];
export type K3JoinType = (typeof K3_JOIN_TYPES)[number];
export type K3NumberBet = (typeof K3_NUMBER_BETS)[number];
export type K3StringBet = (typeof K3_STRING_BETS)[number];

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const k3BetSchema = z.object({
  join: z.enum(K3_JOIN_TYPES),
  listJoin: z.string().max(10, "Bet list too long"),
  multiplier: z.string().regex(/^\d+$/, "Multiplier must be numeric"),
  money: z.enum(K3_BET_AMOUNTS),
  game: z.enum(K3_GAME_DURATIONS),
});

export type K3BetInput = z.infer<typeof k3BetSchema>;
// export interface K3BetInput {
//   listJoin: string;
//   game: K3GameDuration;
//   gameJoin: K3GameJoin;
//   xvalue: number;
//   money: number;
// }
// ============================================================================
// BET TYPES
// ============================================================================

export type K3BetType = "number" | "string";

export interface K3BetValidationResult {
  isValid: boolean;
  errors?: string[];
  betType?: K3BetType;
  parsedBets?: string[];
}

export interface K3BetRecord {
  id: number;
  sessionId: number;
  userId: number;
  joinType: K3JoinType;
  betSelections: string[];
  multiplier: number;
  betAmount: number;
  totalAmount: number;
  potentialWin: number;
  status: "pending" | "won" | "lost" | "cancelled";
  createdAt: number;
}

export interface K3GameSession {
  id: number;
  period: string;
  gameType: "k3";
  duration: number;
  result: string | null;
  status: "pending" | "open" | "closed" | "completed";
  startedAt: number;
  closedAt: number | null;
  resultAt: number | null;
}

export const betK3Schema = z.object({
  listJoin: z.string().min(1, "Bet selection required"),
  game: z.enum(["1", "3", "5", "10"] as const),
  gameJoin: z.enum(["1", "2", "3", "4"] as const),
  xvalue: z.number().int().positive(),
  money: z.number().int().positive(),
});

export type BetK3Body = z.infer<typeof betK3Schema> & { auth?: string };

// Add to existing file

export type K3GameJoin = "1" | "2" | "3" | "4";

export const getMyEmerdListSchema = z.object({
  gameJoin: z.enum(["1", "3", "5", "10"]),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

export type GetMyEmerdListInput = z.infer<typeof getMyEmerdListSchema>;
