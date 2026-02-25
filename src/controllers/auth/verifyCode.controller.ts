import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { createUserWithOtp, findUserByPhone, updateUserOtp } from "src/db/user.queries";
import { generateOtp, getOtpExpiryTime, sendSms } from "src/services/auth.service";
import { VerifyCodeInput, verifyCodeSchema } from "src/types/auth.types";
import { getTimestamp } from "src/utils/helpers";

export const verifyCodeHandler =
  (db: Pool) =>
  async (req: Request<{}, {}, VerifyCodeInput>, res: Response): Promise<void> => {
    const requestId = crypto.randomUUID();
    const timestamp = getTimestamp();

    try {
      // 1. Validate input
      const parseResult = verifyCodeSchema.safeParse(req.body);
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

      // 2. Check existing user
      const existingUser = await findUserByPhone(db, phone);
      const now = getTimestamp();

      // 3. New user or existing user with expired OTP
      if (!existingUser) {
        // Send SMS for new user
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

        await createUserWithOtp(db, phone, otp, otpExpiresAt);

        res.status(200).json({
          success: true,
          message: "Verification code sent successfully",
          data: {
            timestamp: now.toString(),
            expiresAt: otpExpiresAt.toString(),
          },
        });
        return;
      }

      // 4. Existing user - check cooldown
      if (existingUser.otpExpiresAt - now > 0) {
        res.status(429).json({
          success: false,
          message: "Please wait before requesting a new code",
          data: {
            retryAfter: Math.ceil((existingUser.otpExpiresAt - now) / 1000),
          },
          code: "RATE_LIMITED",
        });
        return;
      }

      // 5. Resend OTP for existing user
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
      console.error(`[${requestId}] Verify code error:`, error);

      res.status(500).json({
        success: false,
        message: "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      });
    }
  };
