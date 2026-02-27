import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request } from "express";
import moment from "moment";
import { DepositBonus } from "../types/payment.types";

const SALT_ROUNDS = 10;

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify password using bcrypt
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate 6-digit OTP
 */
export const generateOTP = (): string => {
  return String(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
};

/**
 * Generate secure random token
 */
export const generateAuthToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

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
  return (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
};

/**
 * Format time in IST
 */
export const formatTimeIST = (timestamp?: number): string => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

/**
 * Get today's date string
 */
export const getTodayString = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
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
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

/**
 * Calculate pagination
 */
export const calculatePagination = (
  page: number,
  limit: number,
  total: number,
): {
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
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Format currency to INR
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Generate unique order ID based on date and random number
 */
export const generateOrderIdPayment = (): string => {
  const date = new Date();
  const id_time =
    String(date.getUTCFullYear()) +
    String(date.getUTCMonth() + 1).padStart(2, "0") +
    String(date.getUTCDate()).padStart(2, "0");
  const id_order =
    Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  return id_time + id_order;
};

/**
 * Generate unique order ID (from user.helpers.ts)
 */
export const generateOrderIdUser = (): string => {
  const date = new Date();
  const id_time =
    String(date.getUTCFullYear()) +
    String(date.getUTCMonth() + 1).padStart(2, "0") +
    String(date.getUTCDate()).padStart(2, "0");
  const id_order =
    Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  return id_time + id_order;
};

/**
 * Generate order ID (from admin.helpers.ts)
 */
export const generateOrderIdAdmin = (prefix: string): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

/**
 * Get current time formatted for 'today' field
 */
export const getCurrentTimeForTodayField = (): string => {
  return moment().format("YYYY-DD-MM h:mm:ss A");
};

/**
 * Get DMY date from today field format
 */
export const getDMYDateOfTodayField = (today: string): string => {
  return moment(today, "YYYY-DD-MM h:mm:ss A").format("DD-MM-YYYY");
};

/**
 * Validate UTR (12 digits)
 */
export const validateUTR = (utr: string): boolean => {
  return /^\d{12}$/.test(utr);
};

/**
 * Validate amount against minimum
 */
export const validateAmount = (amount: number, minimum: number): boolean => {
  return amount >= minimum;
};

/**
 * Calculate deposit bonus including percentage and salary
 */
export const calculateDepositBonus = (
  amount: number,
  isFirstDeposit: boolean,
  freeBonus: number,
): DepositBonus => {
  const tenPercent = 0.1 * amount;
  const incrementPercentage = isFirstDeposit ? 0.15 : 0.05;

  let salary = 0;
  if (amount >= 100 && amount <= 299) salary = 20;
  else if (amount >= 300 && amount <= 999) salary = 60;
  else if (amount >= 1000) salary = 150;

  let bonusMoney = amount + amount * incrementPercentage;
  let usedFreeBonus = 0;

  if (freeBonus >= tenPercent) {
    bonusMoney += tenPercent;
    usedFreeBonus = tenPercent;
  } else {
    bonusMoney += freeBonus;
    usedFreeBonus = freeBonus;
  }

  return {
    isFirstDeposit,
    bonusPercentage: incrementPercentage,
    freeBonus: usedFreeBonus,
    salary,
  };
};

/**
 * Generate UPI payment string for QR code
 */
export const generateUPIString = (upiId: string, amount: number, name?: string): string => {
  const merchantName = name || "UPI Payment";
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR`;
};

/**
 * Generate WowPay MD5 signature
 */
export const generateWowPaySign = (params: Record<string, unknown>, secretKey: string): string => {
  const keys = Object.keys(params).sort();
  const stringArr: string[] = [];

  for (const key of keys) {
    if (key === "sign") continue;
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") {
      stringArr.push(`${key}=${value}`);
    }
  }

  const signStr = stringArr.join("&") + "&key=" + secretKey;
  return crypto.createHash("md5").update(signStr).digest("hex").toUpperCase();
};

/**
 * Validate WowPay signature
 */
export const validateWowPaySign = (signSource: string, key: string, retSign: string): boolean => {
  let signStr = signSource;
  if (key) {
    signStr += "&key=" + key;
  }
  const signKey = crypto.createHash("md5").update(signStr).digest("hex").toUpperCase();
  return signKey === retSign.toUpperCase();
};

/**
 * Get current date for WowPay
 */
export const getCurrentDate = (): string => {
  return moment().format("YYYY-MM-DD H:mm:ss");
};

/**
 * Generate unique referral code (5 letters + 5 digits)
 */
export const generateReferralCodeUser = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const randomNum = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  result += String(randomNum);
  return result;
};

/**
 * Generate random referral code (from admin.helpers.ts)
 */
export const generateReferralCodeAdmin = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Mask phone number for privacy (91 + first digit + **** + last 4 digits)
 */
export const maskPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length < 5) return cleanPhone;
  return "91" + cleanPhone.slice(0, 1) + "****" + cleanPhone.slice(-4);
};

/**
 * Get check-in reward amount for specific day
 */
export const getCheckInReward = (day: number): number => {
  const rewards = [300, 3000, 6000, 12000, 28000, 100000, 200000];
  return rewards[day - 1] || 0;
};

/**
 * Get required deposit amount for specific check-in day
 */
export const getRequiredDeposit = (day: number): number => {
  const deposits = [300, 3000, 6000, 12000, 28000, 100000, 200000];
  return deposits[day - 1] || 0;
};

/**
 * Validate Indian phone number format
 */
export const isValidIndianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, "");
  return /^[6-9]\d{9}$/.test(cleanPhone);
};

export * from "./game.helpers";
