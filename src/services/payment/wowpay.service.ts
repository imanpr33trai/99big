import crypto from "crypto";
import moment from "moment";

export const generateWowpaySign = (params: Record<string, any>, secretKey: string): string => {
  const keys = Object.keys(params).sort();
  const stringParts: string[] = [];

  for (const key of keys) {
    if (key === "sign") continue;
    stringParts.push(key + "=" + params[key]);
  }

  const signStr = stringParts.join("&") + "&key=" + secretKey;
  return crypto.createHash("md5").update(signStr).digest("hex");
};

export const validateWowpaySign = (signSource: string, key: string, retSign: string): boolean => {
  const fullSource = key ? signSource + "&key=" + key : signSource;
  const signKey = crypto.createHash("md5").update(fullSource).digest("hex");
  return signKey === retSign;
};

export const getWowpayCurrentDate = (): string => {
  return moment().format("YYYY-MM-DD H:mm:ss");
};
