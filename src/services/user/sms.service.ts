import request from "request";
import { helperGenerateRandomNumber } from "../helpers/common.helpers";

export const smsServiceSendOTP = async (
  phone: string,
  otp: string,
): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve, reject) => {
    request(
      `http://47.243.168.18:9090/sms/batch/v2?appkey=NFJKdK&appsecret=brwkTw&phone=84${phone}&msg=Your verification code is ${otp}&extend=${Date.now()}`,
      (error, response, body) => {
        if (error) {
          reject(error);
          return;
        }
        try {
          const data = JSON.parse(body);
          if (data.code === "00000") {
            resolve({ success: true });
          } else {
            resolve({ success: false, message: data.message || "SMS sending failed" });
          }
        } catch (e) {
          reject(e);
        }
      },
    );
  });
};

export const smsServiceGenerateAndSendOTP = async (
  phone: string,
): Promise<{
  otp: string;
  timeEnd: number;
}> => {
  const otp = helperGenerateRandomNumber(100000, 999999);
  const now = Date.now();
  const timeEnd = now + 1000 * (60 * 2 + 0) + 500;

  const result = await smsServiceSendOTP(phone, otp);
  if (!result.success) {
    throw new Error(result.message || "Failed to send OTP");
  }

  return { otp, timeEnd };
};
