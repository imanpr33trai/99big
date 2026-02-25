import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import {
  findVerifiedUserByPhone,
  incrementOtpAttempts,
  updatePasswordAndOtp,
} from "src/db/user.queries";
import {
  generateOtp,
  getOtpExpiryTime,
  getTimestamp,
  hashPassword,
} from "src/services/auth.service";
import { ForgotPasswordInput, forgotPasswordSchema } from "src/types/auth.types";

export const forgotPasswordHandler =
  (db: Pool) =>
  async (req: Request<{}, {}, ForgotPasswordInput>, res: Response): Promise<void> => {
    const requestId = crypto.randomUUID();
    const timestamp = getTimestamp();

    try {
      // 1. Validate input
      const parseResult = forgotPasswordSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parseResult.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { username, otp, pwd } = parseResult.data;
      const now = getTimestamp();

      // 2. Find verified user
      const user = await findVerifiedUserByPhone(db, username);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Account does not exist or not verified",
          data: { timestamp: now.toString() },
          code: "ACCOUNT_NOT_FOUND",
        });
        return;
      }

      // 3. Check OTP expiry
      if (user.otpExpiresAt - now <= 0) {
        res.status(400).json({
          success: false,
          message: "OTP code has expired",
          data: { timestamp: now.toString() },
          code: "OTP_EXPIRED",
        });
        return;
      }

      // 4. Verify OTP
      if (user.otpCode !== otp) {
        await incrementOtpAttempts(db, username);

        res.status(400).json({
          success: false,
          message: "OTP code is incorrect",
          data: { timestamp: now.toString() },
          code: "INVALID_OTP",
        });
        return;
      }

      // 5. Hash new password with bcrypt (NOT md5)
      const passwordHash = await hashPassword(pwd);
      const newOtp = generateOtp();
      const otpExpiresAt = getOtpExpiryTime();

      // 6. Update password and rotate OTP
      await updatePasswordAndOtp(db, username, passwordHash, newOtp, otpExpiresAt);

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
        data: {
          timestamp: now.toString(),
          expiresAt: otpExpiresAt.toString(),
        },
      });
    } catch (error) {
      console.error(`[${requestId}] Forgot password error:`, error);

      res.status(500).json({
        success: false,
        message: "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      });
    }
  };
