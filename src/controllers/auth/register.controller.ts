import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import {
  createUser,
  createUserPoints,
  findUserByPhone,
  findUserByReferralCode,
  isReferralCodeExists,
} from "../../db/user.queries";
import { hashPassword } from "../../services/auth.service";
import {
  RegisterErrorResponse,
  RegisterInput,
  registerSchema,
  RegisterSuccessResponse,
} from "../../types/auth.types";
import {
  generateRandomNumber,
  generateReferralCode,
  getClientIp,
  getTimestamp,
} from "../../utils/helpers";

// Configuration
const CONFIG = {
  FREE_BONUS: 500,
  DEFAULT_USER_LEVEL: 0,
} as const;

// Main registration handler
export const registerHandler =
  (db: Pool) =>
  async (
    req: Request<{}, {}, RegisterInput>,
    res: Response<RegisterSuccessResponse | RegisterErrorResponse>,
  ): Promise<void> => {
    const requestId = crypto.randomUUID();
    // const timestamp = new Date().toISOString();

    try {
      // 1. Validate input with Zod
      const parseResult = registerSchema.safeParse(req.body);

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

      const { username, pwd, inviteCode } = parseResult.data;

      // 2. Check if phone already registered and verified
      const existingUser = await findUserByPhone(db, username);

      if (existingUser && existingUser.isVerified) {
        res.status(409).json({
          success: false,
          message: "Phone number already registered",
          code: "PHONE_EXISTS",
        });
        return;
      }

      // 3. Validate inviter/referral code
      const inviter = await findUserByReferralCode(db, inviteCode);

      if (!inviter) {
        res.status(404).json({
          success: false,
          message: "Invalid referral code",
          code: "INVALID_REFERRAL",
        });
        return;
      }

      // 4. Check inviter status
      if (inviter.status !== 0) {
        res.status(403).json({
          success: false,
          message: "Referrer account is not active",
          code: "INACTIVE_REFERRER",
        });
        return;
      }

      // 5. Generate user data
      const passwordHash = await hashPassword(pwd);
      const userName = `Member${generateRandomNumber(10000, 99999)}`;
      const referralCode = await generateReferralCode((code) => isReferralCodeExists(db, code));
      const otpCode = generateRandomNumber(100000, 999999).toString();
      const ipAddress = getClientIp(req);
      const now = getTimestamp();

      // Determine CTV (collaborator)
      const ctv = inviter.userLevel === 2 ? inviter.phone : inviter.phone; // Adjust logic as needed

      // 6. Create user
      const userId = await createUser(db, {
        phone: username,
        userName,
        passwordHash,
        referralCode,
        invitedBy: inviter.id,
        ctv,
        otpCode,
        ipAddress,
        freeBonus: CONFIG.FREE_BONUS,
      });

      // 7. Initialize user points
      await createUserPoints(db, username);

      // 8. Log registration (optional)
      await db.execute(
        `INSERT INTO activityLogs (userId, action, entityType, newValues, ipAddress, createdAt)
       VALUES (?, 'register', 'user', ?, ?, ?)`,
        [userId, JSON.stringify({ phone: username, invitedBy: inviter.id }), ipAddress, now],
      );

      // 9. Success response
      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
          userId,
          phone: username,
          userName,
          referralCode,
        },
      });
    } catch (error) {
      console.error(`[${requestId}] Registration error:`, error);

      // Check for duplicate entry error (race condition)
      if (error instanceof Error && error.message.includes("Duplicate entry")) {
        res.status(409).json({
          success: false,
          message: "Phone number already registered",
          code: "PHONE_EXISTS",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        code: "INTERNAL_ERROR",
      });
    }
  };
