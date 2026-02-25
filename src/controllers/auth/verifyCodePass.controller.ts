import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { findVerifiedUserByPhone, updateUserOtp } from "src/db/user.queries";
import { VerifyCodePassInput, verifyCodePassSchema } from "src/types/auth.types";
import { generateOtp, getOtpExpiryTime, getTimestamp, sendSms } from "src/utils/helpers";

export const verifyCodePassHandler =
  (db: Pool) =>
  async (req: Request<{}, {}, VerifyCodePassInput>, res: Response): Promise<void> => {
    const requestId = crypto.randomUUID();
    // const timestamp = getTimestamp();

    try {
      // 1. Validate input
      const parseResult = verifyCodePassSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          message: "Invalid phone number",
          errors: parseResult.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { phone } = parseResult.data;
      const otp = generateOtp();
      const otpExpiresAt = getOtpExpiryTime();
      const now = getTimestamp();

      // 2. Check if verified user exists
      const user = await findVerifiedUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Account does not exist or not verified",
          data: { timestamp: now.toString() },
          code: "ACCOUNT_NOT_FOUND",
        });
        return;
      }

      // 3. Check OTP cooldown
      if (user.otpExpiresAt - now > 0) {
        res.status(429).json({
          success: false,
          message: "Please wait before requesting a new code",
          data: {
            timestamp: now.toString(),
            retryAfter: Math.ceil((user.otpExpiresAt - now) / 1000),
          },
          code: "RATE_LIMITED",
        });
        return;
      }

      // 4. Send SMS
      const smsResponse = await sendSms(phone, otp, now);
      const smsData = JSON.parse(smsResponse);

      if (smsData.code !== "00000") {
        res.status(502).json({
          success: false,
          message: "Failed to send SMS",
          code: "SMS_FAILED",
        });
        return;
      }

      // 5. Update OTP
      await updateUserOtp(db, phone, otp, otpExpiresAt);

      res.status(200).json({
        success: true,
        message: "Verification code sent successfully",
        data: {
          timestamp: now.toString(),
          expiresAt: otpExpiresAt.toString(),
        },
      });
    } catch (error) {
      console.error(`[${requestId}] Verify code pass error:`, error);

      res.status(500).json({
        success: false,
        message: "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      });
    }
  };
