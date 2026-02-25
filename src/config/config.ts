export const AUTH_CONFIG = {
  OTP_EXPIRY_MINUTES: 2,
  OTP_COOLDOWN_MS: 500,
  SMS_API_URL: "http://47.243.168.18:9090/sms/batch/v2",
  SMS_APP_KEY: "NFJKdK",
  SMS_APP_SECRET: "brwkTw",
  BCRYPT_ROUNDS: 12,
} as const;

export const K3_CONFIG = {
  MINIMUM_BET_FOR_COMMISSION: 10000,
  MAX_REFERRAL_DEPTH: 4,
} as const;

export const k3PayoutOdds = {
  total: {
    t3: 207.36,
    t4: 69.12,
    t5: 34.56,
    t6: 20.74,
    t7: 13.83,
    t8: 9.88,
    t9: 8.3,
    t10: 7.68,
    t11: 7.68,
    t12: 8.3,
    t13: 9.88,
    t14: 13.83,
    t15: 20.74,
    t16: 34.56,
    t17: 69.12,
    t18: 207.36,
    b: 1.92,
    s: 1.92,
    l: 1.92,
    c: 1.92,
  },
  two: {
    twoSame: 13.83,
    twoD: 69.12,
  },
  three: {
    threeD: 207.36,
    threeSame: 34.56,
  },
  unlike: {
    unlikeThree: 34.56,
    threeL: 8.64,
    unlikeTwo: 6.91,
  },
} as const;

export const APP_CONFIG = {
  MINIMUM_MONEY: parseFloat(process.env.MINIMUM_MONEY || "100"),
  UPI_GATEWAY_KEY: process.env.UPI_GATEWAY_PAYMENT_KEY || "",
  WOWPAY_MERCHANT_ID: process.env.WOWPAY_MERCHANT_ID || "",
  WOWPAY_MERCHANT_KEY: process.env.WOWPAY_MERCHANT_KEY || "",
  APP_BASE_URL: process.env.APP_BASE_URL || "",
  PAYMENT_INFO: process.env.PAYMENT_INFO || "",
  PAYMENT_EMAIL: process.env.PAYMENT_EMAIL || "",
  APP_NAME: process.env.APP_NAME || "",
  USDT_EXCHANGE_RATE: 82,
} as const;

export const TRANSACTION_TYPE_IDS = {
  DEPOSIT: 1,
  WITHDRAW: 2,
  BET: 3,
  WIN: 4,
  BONUS: 5,
  TRANSFER_IN: 6,
  TRANSFER_OUT: 7,
  COMMISSION: 8,
  CHECK_IN: 9,
} as const;

export const SALARY_TIERS = [
  { min: 100, max: 299, amount: 20 },
  { min: 300, max: 999, amount: 60 },
  { min: 1000, max: Infinity, amount: 150 },
] as const;
