import { z } from "zod";

// ==========================================
// GAME BASE TYPES
// ==========================================

export interface GameSession {
  id: number;
  period: string;
  gameTypeId: number;
  result: string | null;
  status: number; // 0=pending, 1=open, 2=closed, 3=completed
  startedAt: string; // BIGINT as string for raw SQL safety
  closedAt: string | null;
  resultAt: string | null;
  createdAt: string;
}

export interface BetRecord {
  id: number;
  sessionId: number;
  userId: number;
  gameTypeId: number;
  stage: number | string;
  betAmount: string; // DECIMAL(15,2)
  odds: string; // DECIMAL(8,2)
  potentialWin: string;
  fee: string;
  actualWin: string;
  selection: string;
  betType: string;
  result: string | null;
  isWin: boolean | null;
  status: number; // 0=pending, 1=won, 2=lost, 3=cancelled
  createdAt: string;
}

export interface BetCalculation {
  total: number;
  fee: number;
  price: number;
  typeGame?: string;
}

// ==========================================
// COMMISSION & TURNOVER
// ==========================================

export interface CommissionRecord {
  id: number;
  userId: number;
  fromUserId: number;
  level: number;
  amount: number;
  sourceType: string;
  sourceId: number;
  createdAt: number;
}

export interface TurnoverRecord {
  id: number;
  userId: number;
  dailyTurnover: number;
  totalTurnover: number;
  recordDate: string;
  updatedAt: number;
}

// ==========================================
// ADMIN CONFIG
// ==========================================

export interface AdminConfig {
  id: number;
  configKey: string;
  configValue: string;
  description?: string;
  updatedAt: number;
}
