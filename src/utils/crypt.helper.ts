import bcrypt from "bcrypt";
import crypto from "crypto";
import { PaymentWowPayParams } from "../types/payment.types";
import { APP_CONFIG } from "../utils/constants";

export const cryptoGenerateWowPaySign = (
  params: PaymentWowPayParams,
  secretKey: string,
): string => {
  const keys = Object.keys(params).sort() as (keyof PaymentWowPayParams)[];
  const stringParts: string[] = [];

  for (const key of keys) {
    if (key === "sign" || key === "sign_type") continue;
    const value = params[key];
    if (value !== undefined && value !== null) {
      stringParts.push(`${key}=${value}`);
    }
  }

  const signStr = stringParts.join("&") + "&key=" + secretKey;
  return crypto.createHash("md5").update(signStr).digest("hex");
};

export const cryptoValidateWowPaySign = (
  signSource: string,
  key: string,
  retSign: string,
): boolean => {
  const fullSource = signSource + "&key=" + key;
  const signKey = crypto.createHash("md5").update(fullSource).digest("hex");
  return signKey === retSign;
};

export const cryptoWowPayCallbackValidate = (data: Record<string, string>): boolean => {
  const signStr = [
    `amount=${data.amount}`,
    `mchId=${data.mchId}`,
    `mchOrderNo=${data.mchOrderNo}`,
    `merRetMsg=${data.merRetMsg}`,
    `orderDate=${data.orderDate}`,
    `orderNo=${data.orderNo}`,
    `oriAmount=${data.oriAmount}`,
    `tradeResult=${data.tradeResult}`,
  ].join("&");

  return cryptoValidateWowPaySign(signStr, APP_CONFIG.WOWPAY_MERCHANT_KEY, data.sign);
};

const SALT_ROUNDS = 12;

export const cryptoHashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const cryptoVerifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const cryptoHashMD5 = (input: string): string => {
  // For legacy compatibility only
  const crypto = require("crypto");
  return crypto.createHash("md5").update(input).digest("hex");
};

export const cryptoVerifyMD5 = (input: string, hash: string): boolean => {
  return cryptoHashMD5(input) === hash;
};
