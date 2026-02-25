
import bcrypt from 'bcrypt';

// Password hashing configuration
export const PASSWORD_SALT_ROUNDS = 10;

// OTP configuration
export const OTP_EXPIRY_MINUTES = 10;
export const OTP_RATE_LIMIT_SECONDS = 60;

// Withdrawal limits
export const MAX_WITHDRAWALS_PER_DAY = 3;
export const MIN_WITHDRAWAL_AMOUNT = 299;

// Transfer limits
export const MAX_TRANSFER_PER_HOUR = 5;

/\*\*

- Hash password using bcrypt
  \*/
  export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  };

/\*\*

- Verify password using bcrypt
  \*/
  export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
  };

/\*\*

- Security headers for responses
  \*/
  export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };
