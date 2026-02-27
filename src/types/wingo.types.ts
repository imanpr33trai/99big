import { z } from 'zod';

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const WingoBetSchema = z.object({
  typeid: z.enum(['1', '3', '5', '10']),
  join: z.string().min(1).max(2),
  x: z.string().regex(/^\d+$/),
  money: z.number().int().positive(),
});

export const WingoHistorySchema = z.object({
  typeid: z.enum(['1', '3', '5', '10']),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

export const WingoMyBetsSchema = z.object({
  typeid: z.enum(['1', '3', '5', '10']),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

export const GameManagementSchema = z.object({
  game: z.union([z.number(), z.string()]),
  typeid: z.union([z.number(), z.string()]),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WingoApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
  [key: string]: unknown;
}

export interface WingoGameSession {
  id: number;
  period: string;
  gameTypeId: number;
  result: string | null;
  amount: number;
  status: number; // 0=pending, 1=open, 2=closed, 3=completed
  startedAt: number;
  closedAt: number | null;
  resultAt: number | null;
  createdAt: number;
}

export interface WingoBetRecord {
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
  status: number; // 0=pending, 1=won, 2=lost, 3=cancelled
  createdAt: number;
}

export interface WingoBetCalculation {
  total: number;
  fee: number;
  price: number;
}

export interface WingoPayout {
  bet: string;
  result: number;
  multiplier: number;
}

export interface WingoResult {
  message: string;
  status: boolean;
  data?: string;
  money?: number;
  change?: number;
}

export interface WingoHistoryResponse {
  gameslist: WingoGameSession[];
  period: string;
  page: number;
}

export interface WingoMyBetsResponse {
  gameslist: Partial<WingoBetRecord>[];
  page: number;
  totalWin?: number;
}

export interface WingoUser {
  id: number;
  phone: string;
  userName: string;
  passwordHash: string;
  authToken: string | null;
  balance: number;
  referralCode: string;
  invitedBy: number | null;
  isVerified: boolean;
  status: number;
  userLevel: number;
  createdAt: number;
  updatedAt: number;
  totalMoney: number;
}

export interface WingoCommissionLevel {
  id: number;
  level: number;
  name: string;
  rateF1: number;
  rateF2: number;
  rateF3: number;
  rateF4: number;
  minTurnover: number;
  createdAt: number;
}

// ============================================================================
// TYPE ALIASES
// ============================================================================

export type WingoGameDuration = '1' | '3' | '5' | '10';
export type WingoBetSelection = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'l' | 'n' | 'd' | 'x' | 't';
export type WingoColor = 'red' | 'green' | 'violet';
export type WingoSize = 'big' | 'small';

// ============================================================================
// CONSTANTS & MAPPINGS
// ============================================================================

export const NUMBER_COLOR: Record<string, WingoColor[]> = {
  '0': ['red', 'violet'],
  '1': ['green'],
  '2': ['red'],
  '3': ['green'],
  '4': ['red'],
  '5': ['green', 'violet'],
  '6': ['red'],
  '7': ['green'],
  '8': ['red'],
  '9': ['green'],
};

export const NUMBER_SIZE: Record<string, WingoSize> = {
  '0': 'small', '1': 'small', '2': 'small', '3': 'small', '4': 'small',
  '5': 'big', '6': 'big', '7': 'big', '8': 'big', '9': 'big',
};

export const BET_PAYOUTS: Record<string, number> = {
  'number': 9,
  'big': 2,
  'small': 2,
  'red': 2,
  'green': 2,
  'violet': 4.5,
};

export const VALID_SELECTIONS: WingoBetSelection[] = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'l', 'n', 'd', 'x', 't'
];

export const GAME_TYPE_MAP: Record<string, string> = {
  '1': 'wingo',
  '3': 'wingo3',
  '5': 'wingo5',
  '10': 'wingo10',
};

export const GAME_TYPE_REVERSE: Record<string, string> = {
  'wingo': '1',
  'wingo3': '3',
  'wingo5': '5',
  'wingo10': '10',
};

export const MINIMUM_TURNOVER_FOR_COMMISSION = 100;
export const BET_FEE_PERCENTAGE = 2;
