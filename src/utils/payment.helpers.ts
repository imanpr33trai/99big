import crypto from 'crypto';
import moment from 'moment';
import { DepositBonus } from '../types/payment.types';

/**
 * Generate unique order ID based on date and random number
 */
export const generateOrderIdPayment = (): string => {
  const date = new Date();
  const id_time = String(date.getUTCFullYear()) +
    String(date.getUTCMonth() + 1).padStart(2, '0') +
    String(date.getUTCDate()).padStart(2, '0');
  const id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  return id_time + id_order;
};

/**
 * Generate unique order ID (from user.helpers.ts)
 */
export const generateOrderIdUser = (): string => {
  const date = new Date();
  const id_time = String(date.getUTCFullYear()) +
    String(date.getUTCMonth() + 1).padStart(2, '0') +
    String(date.getUTCDate()).padStart(2, '0');
  const id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
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
  return moment().format('YYYY-DD-MM h:mm:ss A');
};

/**
 * Get DMY date from today field format
 */
export const getDMYDateOfTodayField = (today: string): string => {
  return moment(today, 'YYYY-DD-MM h:mm:ss A').format('DD-MM-YYYY');
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
  freeBonus: number
): DepositBonus => {
  const tenPercent = 0.1 * amount;
  const incrementPercentage = isFirstDeposit ? 0.15 : 0.05;

  let salary = 0;
  if (amount >= 100 && amount <= 299) salary = 20;
  else if (amount >= 300 && amount <= 999) salary = 60;
  else if (amount >= 1000) salary = 150;

  let bonusMoney = amount + (amount * incrementPercentage);
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
  const merchantName = name || 'UPI Payment';
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR`;
};

/**
 * Generate WowPay MD5 signature
 */
export const generateWowPaySign = (params: Record<string, unknown>, secretKey: string): string => {
  const keys = Object.keys(params).sort();
  const stringArr: string[] = [];

  for (const key of keys) {
    if (key === 'sign' || key === 'signType') continue;
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      stringArr.push(`${key}=${value}`);
    }
  }

  const signStr = stringArr.join('&') + '&key=' + secretKey;
  return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
};

/**
 * Validate WowPay signature
 */
export const validateWowPaySign = (signSource: string, key: string, retSign: string): boolean => {
  let signStr = signSource;
  if (key) {
    signStr += '&key=' + key;
  }
  const signKey = crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
  return signKey === retSign.toUpperCase();
};

/**
 * Get current date for WowPay
 */
export const getCurrentDate = (): string => {
  return moment().format('YYYY-MM-DD H:mm:ss');
};
