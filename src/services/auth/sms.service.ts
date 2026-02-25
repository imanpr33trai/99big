import request from "request";

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  SMS_API_URL: "http://47.243.168.18:9090/sms/batch/v2",
  SMS_APP_KEY: "NFJKdK",
  SMS_APP_SECRET: "brwkTw",
} as const;

// ============================================================================
// SMS SERVICES
// ============================================================================

/**
 * Send OTP via SMS
 */
export const sendOtpSms = (phone: string, otp: number, timestamp: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = `${CONFIG.SMS_API_URL}?appkey=${CONFIG.SMS_APP_KEY}&appsecret=${CONFIG.SMS_APP_SECRET}&phone=84${phone}&msg=Your verification code is ${otp}&extend=${timestamp}`;

    request(url, (error, response, body) => {
      if (error) return reject(error);
      resolve(body);
    });
  });
};

/**
 * Parse SMS API response
 */
export const parseSmsResponse = (response: string): { code: string; message?: string } => {
  try {
    return JSON.parse(response);
  } catch {
    return { code: "ERROR", message: "Invalid response" };
  }
};

/**
 * Check if SMS was sent successfully
 */
export const isSmsSent = (responseCode: string): boolean => {
  return responseCode === "00000";
};
