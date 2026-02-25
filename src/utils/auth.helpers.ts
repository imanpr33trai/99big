import bcrypt from 'bcrypt';
import crypto from 'crypto';

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
  return crypto.randomBytes(32).toString('hex');
};
