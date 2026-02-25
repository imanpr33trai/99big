import { Request } from 'express';

/**
 * Generate random number in range
 */
export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Get current timestamp
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * Get IP address from request
 */
export const getIpAddress = (req: Request): string => {
  return (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'unknown';
};

/**
 * Format time in IST
 */
export const formatTimeIST = (timestamp?: number): string => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

/**
 * Get today's date string
 */
export const getTodayString = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's start timestamp
 */
export const getTodayStartTimestamp = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
};

/**
 * Safe parse float
 */
export const safeParseFloat = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

/**
 * Calculate pagination
 */
export const calculatePagination = (page: number, limit: number, total: number): {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrev: page > 0,
  };
};

/**
 * Check if string is numeric
 */
export const isNumber = (str: string): boolean => {
  return /^\d+$/.test(str);
};

/**
 * Format timer join (helper for time formatting)
 */
export const timerJoin = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Format currency to INR
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};
