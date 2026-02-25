// src/utils/admin.helpers.ts
import bcrypt from "bcrypt";
import { Request } from "express";

const SALT_ROUNDS = 10;

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify password against bcrypt hash
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate random number within range
 */
export const generateRandomNumber = (min: number, max: number): string => {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

/**
 * Generate random alphanumeric string
 */
export const generateRandomString = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Generate unique referral code
 */
export const generateReferralCode = (): string => {
  return generateRandomString(5) + generateRandomNumber(10000, 99999);
};

/**
 * Generate unique order ID
 */
export const generateOrderId = (): string => {
  return "ORD" + Date.now() + generateRandomNumber(1000, 9999);
};

/**
 * Generate authentication token
 */
export const generateAuthToken = (): string => {
  return generateRandomNumber(100000000, 999999999) + generateRandomString(10);
};

/**
 * Extract IP address from request
 */
export const getIpAddress = (req: Request): string => {
  let ip = "";
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    ip = forwarded.split(",")[0].trim();
  } else if (Array.isArray(forwarded)) {
    ip = forwarded[0].trim();
  } else if (req.connection?.remoteAddress) {
    ip = req.connection.remoteAddress;
  } else {
    ip = req.ip || "unknown";
  }
  return ip;
};

/**
 * Get current timestamp in milliseconds
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * Format time to IST (Asia/Kolkata) string
 */
export const formatTimeIST = (timestamp: number = Date.now()): string => {
  const date = new Date(timestamp);
  const timeIST = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = timeIST.getFullYear();
  const month = pad(timeIST.getMonth() + 1);
  const day = pad(timeIST.getDate());

  let hours = timeIST.getHours() % 12;
  hours = hours === 0 ? 12 : hours;
  const ampm = timeIST.getHours() < 12 ? "AM" : "PM";

  const minutes = pad(timeIST.getMinutes());
  const seconds = pad(timeIST.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
};

/**
 * Get today's date string in IST format
 */
export const getTodayString = (): string => {
  return formatTimeIST();
};

/**
 * Safely parse float from database decimal string
 */
export const safeParseFloat = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Safely parse integer
 */
export const safeParseInt = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "string" ? parseInt(value, 10) : value;
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Calculate pagination offset
 */
export const calculatePagination = (
  page: number,
  limit: number,
): { offset: number; limit: number } => {
  return {
    offset: page,
    limit: limit,
  };
};

/**
 * Format date from timestamp for comparison
 */
export const formatDateForComparison = (timestamp: number): string => {
  const date = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * Check if timestamp is today
 */
export const isToday = (timestamp: number): boolean => {
  return formatDateForComparison(timestamp) === formatDateForComparison(Date.now());
};

/**
 * Calculate commission based on amount and rate
 */
export const calculateCommission = (amount: number, rate: number): number => {
  return Math.floor(amount * rate * 100) / 100;
};

/**
 * Determine deposit bonus based on amount
 */
export const calculateDepositBonus = (
  amount: number,
  isFirstDeposit: boolean,
): { bonus: number; salary: number } => {
  let salary = 0;
  if (amount >= 100 && amount <= 299) salary = 20;
  else if (amount >= 300 && amount <= 999) salary = 60;
  else if (amount >= 1000) salary = 150;

  const bonusRate = isFirstDeposit ? 0.15 : 0.05;
  const bonus = amount * bonusRate;

  return { bonus, salary };
};
