import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import {
  findUserByPhone,
  incrementFailedLoginAttempts,
  lockUserAccount,
  recordLoginActivity,
  updateUserAuthToken,
} from "../../db/user.queries";
import {
  dummyBcryptCompare,
  generateAccessToken,
  sanitizeUserForResponse,
  shouldLockAccount,
  verifyPassword,
} from "../../services/auth.service";
import {
  LoginErrorResponse,
  LoginInput,
  loginSchema,
  LoginSuccessResponse,
} from "../../types/auth.types";

// Configuration
const CONFIG = {
  MAX_FAILED_ATTEMPTS: 5,
  TOKEN_EXPIRY_HOURS: 24,
} as const;

// Main login handler - pure async function
export const loginHandler =
  (db: Pool) =>
  async (
    req: Request<{}, {}, LoginInput>,
    res: Response<LoginSuccessResponse | LoginErrorResponse>,
  ): Promise<void> => {
    const requestId = crypto.randomUUID();
    // const timestamp = new Date().toISOString();
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";

    try {
      // 1. Validate input
      const parseResult = loginSchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parseResult.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { username, pwd } = parseResult.data;

      // 2. Fetch user
      const user = await findUserByPhone(db, username);

      // 3. User not found - prevent timing attacks
      if (!user) {
        await dummyBcryptCompare(pwd);
        await recordLoginActivity(db, username, clientIp, false);

        res.status(401).json({
          success: false,
          message: "Invalid credentials",
          code: "INVALID_CREDENTIALS",
        });
        return;
      }

      // 4. Check account status
      if (user.status === 1) {
        res.status(403).json({
          success: false,
          message: "Account has been locked due to security concerns. Please contact support.",
          code: "ACCOUNT_LOCKED",
        });
        return;
      }

      if (user.status === 2) {
        res.status(403).json({
          success: false,
          message: "Account has been banned",
          code: "ACCOUNT_BANNED",
        });
        return;
      }

      // 5. Verify password
      const isPasswordValid = await verifyPassword(pwd, user.passwordHash);

      if (!isPasswordValid) {
        await incrementFailedLoginAttempts(db, username);
        await recordLoginActivity(db, username, clientIp, false);

        // Check lock threshold
        if (shouldLockAccount(user.otpAttempts + 1, CONFIG.MAX_FAILED_ATTEMPTS)) {
          await lockUserAccount(db, username);

          res.status(403).json({
            success: false,
            message: "Account locked due to too many failed attempts. Please contact support.",
            code: "ACCOUNT_LOCKED",
          });
          return;
        }

        res.status(401).json({
          success: false,
          message: "Invalid credentials",
          code: "INVALID_CREDENTIALS",
        });
        return;
      }

      // 6. Success - generate token
      const accessToken = generateAccessToken(user);
      const expiresAt = new Date(
        Date.now() + CONFIG.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
      ).toISOString();

      // 7. Update user record
      await updateUserAuthToken(db, username, accessToken, clientIp);
      await recordLoginActivity(db, username, clientIp, true);

      // 8. Send response
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          accessToken,
          expiresAt,
          user: sanitizeUserForResponse(user),
        },
      });
    } catch (error) {
      console.error(`[${requestId}] Login error:`, error);

      res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        code: "INTERNAL_ERROR",
      });
    }
  };
