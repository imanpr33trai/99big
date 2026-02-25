import { randomInt } from "crypto";
import { Request } from "express";
import request from "request";
import { AUTH_CONFIG } from "src/config/config";

// Generate cryptographically secure random number
export const generateRandomNumber = (min: number, max: number): number => {
  return randomInt(min, max + 1);
};

// Generate random string
export const generateRandomString = (length: number): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomInt(0, chars.length));
  }
  return result;
};

// Generate unique referral code
export const generateReferralCode = async (
  existsCheck: (code: string) => Promise<boolean>,
): Promise<string> => {
  let code: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    const prefix = generateRandomString(5);
    const suffix = generateRandomNumber(10000, 99999);
    code = `${prefix}${suffix}`;
    attempts++;
  } while ((await existsCheck(code)) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    throw new Error("Failed to generate unique referral code");
  }

  return code;
};

// Get client IP address
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? typeof forwarded === "string"
      ? forwarded.split(",")[0]
      : forwarded[0]
    : req.socket.remoteAddress;
  return ip || "unknown";
};
// export const getClientIp = (req: any): string => {
//   return req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
// };

// Current timestamp
export const getTimestamp = (): number => Date.now();

export const generateOtp = (): number => Math.floor(100000 + Math.random() * 900000);

export const getOtpExpiryTime = (): number =>
  getTimestamp() + AUTH_CONFIG.OTP_EXPIRY_MINUTES * 60 * 1000 + AUTH_CONFIG.OTP_COOLDOWN_MS;

export const sendSms = (phone: string, otp: number, timestamp: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = `${AUTH_CONFIG.SMS_API_URL}?appkey=${AUTH_CONFIG.SMS_APP_KEY}&appsecret=${AUTH_CONFIG.SMS_APP_SECRET}&phone=84${phone}&msg=Your verification code is ${otp}&extend=${timestamp}`;

    request(url, (error, response, body) => {
      if (error) return reject(error);
      resolve(body);
    });
  });
};

/**
 * Generate random ID of specified length
 */
export const makeid = (length: number): string => {
  let result = "";
  const characters = "123456";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const getRechargeOrderId = (): string => {
  const date = new Date();
  const id_time = date.getUTCFullYear() + "" + (date.getUTCMonth() + 1) + "" + date.getUTCDate();
  const id_order =
    Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  return id_time + id_order;
};

export const getCurrentTimestamp = (): bigint => {
  return BigInt(Date.now());
};

export const getCurrentTimestampString = (): string => {
  return new Date().toISOString();
};

export const formatISTTime = (date: Date = new Date()): string => {
  const timeIST = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return timeIST.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const calculateSalary = (amount: number): number => {
  if (amount >= 100 && amount <= 299) return 20;
  if (amount >= 300 && amount <= 999) return 60;
  if (amount >= 1000) return 150;
  return 0;
};
