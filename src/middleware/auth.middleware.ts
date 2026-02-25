import { NextFunction, Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { userQueryFindByToken } from "src/db/user.queries";
import { helperGetCurrentTimestamp } from "src/utils/common.helpers";
import { verifyAccessToken } from "../services/auth/auth.service";

// ============================================================================
// EXTENDED REQUEST TYPE
// ============================================================================

// ============================================================================
// AUTHENTICATE USER (Standard user)
// ============================================================================

export const authenticate =
  (db: Pool) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get token from cookie or header
      const token = req.cookies?.auth || req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
          code: "UNAUTHORIZED",
        });
        return;
      }

      // Verify JWT
      let payload;
      try {
        payload = verifyAccessToken(token);
      } catch {
        res.status(401).json({
          success: false,
          message: "Invalid or expired token",
          code: "INVALID_TOKEN",
        });
        return;
      }

      // Verify user exists and is active
      const [rows] = await db.execute(
        "SELECT id, phone, userName, userLevel, commissionLevel, status FROM users WHERE authToken = ? AND isVerified = TRUE LIMIT 1",
        [token],
      );

      if ((rows as any[]).length === 0) {
        res.status(401).json({
          success: false,
          message: "User not found or not verified",
          code: "USER_NOT_FOUND",
        });
        return;
      }

      const user = (rows as any[])[0];

      // Check account status (0 = active, 1 = locked, 2 = banned)
      if (user.status !== 0) {
        res.status(403).json({
          success: false,
          message: user.status === 1 ? "Account locked" : "Account banned",
          code: "ACCOUNT_DISABLED",
        });
        return;
      }

      // Attach user to request
      req.user = {
        id: user.id,
        phone: user.phone,
        userName: user.userName,
        userLevel: user.userLevel,
        commissionLevel: user.commissionLevel,
      };

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({
        success: false,
        message: "Authentication failed",
        code: "AUTH_ERROR",
      });
    }
  };

// ============================================================================
// AUTHENTICATE ADMIN (Admin only)
// ============================================================================

export const authenticateAdmin =
  (db: Pool) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get token from cookie or header
      const token = req.cookies?.auth || req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
          code: "UNAUTHORIZED",
        });
        return;
      }

      // Verify JWT
      let payload;
      try {
        payload = verifyAccessToken(token);
      } catch {
        res.status(401).json({
          success: false,
          message: "Invalid or expired token",
          code: "INVALID_TOKEN",
        });
        return;
      }

      // Verify user exists, is active, and is admin
      const [rows] = await db.execute(
        `SELECT u.id, u.phone, u.userName, u.userLevel, u.commissionLevel, u.status,
              a.role, a.isActive as adminActive
       FROM users u
       LEFT JOIN adminUsers a ON u.id = a.userId
       WHERE u.authToken = ? AND u.isVerified = TRUE
       LIMIT 1`,
        [token],
      );

      if ((rows as any[]).length === 0) {
        res.status(401).json({
          success: false,
          message: "User not found or not verified",
          code: "USER_NOT_FOUND",
        });
        return;
      }

      const user = (rows as any[])[0];

      // Check account status
      if (user.status !== 0) {
        res.status(403).json({
          success: false,
          message: user.status === 1 ? "Account locked" : "Account banned",
          code: "ACCOUNT_DISABLED",
        });
        return;
      }

      // Check admin privileges
      // userLevel > 0 OR role in ('admin', 'super', 'moderator')
      const isAdmin =
        user.userLevel > 0 || (user.role && ["admin", "super", "moderator"].includes(user.role));

      if (!isAdmin) {
        res.status(403).json({
          success: false,
          message: "Admin access required",
          code: "FORBIDDEN",
        });
        return;
      }

      // Check if admin is active (if using adminUsers table)
      if (user.adminActive === false) {
        res.status(403).json({
          success: false,
          message: "Admin account inactive",
          code: "ADMIN_INACTIVE",
        });
        return;
      }

      // Attach user to request
      req.user = {
        id: user.id,
        phone: user.phone,
        userName: user.userName,
        userLevel: user.userLevel,
        commissionLevel: user.commissionLevel,
      };

      next();
    } catch (error) {
      console.error("Admin authentication error:", error);
      res.status(500).json({
        success: false,
        message: "Authentication failed",
        code: "AUTH_ERROR",
      });
    }
  };

// ============================================================================
// OPTIONAL AUTH (Doesn't fail if no token)
// ============================================================================

export const optionalAuth =
  (db: Pool) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies?.auth || req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        next();
        return;
      }

      try {
        const payload = verifyAccessToken(token);

        const [rows] = await db.execute(
          "SELECT id, phone, userName, userLevel, commissionLevel FROM users WHERE authToken = ? AND isVerified = TRUE AND status = 0 LIMIT 1",
          [token],
        );

        if ((rows as any[]).length > 0) {
          const user = (rows as any[])[0];
          req.user = {
            id: user.id,
            phone: user.phone,
            userName: user.userName,
            userLevel: user.userLevel,
            commissionLevel: user.commissionLevel,
          };
        }
      } catch {
        // Invalid token, continue without user
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export const middlewareAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const auth = req.cookies.auth || req.headers.authorization;

  if (!auth) {
    res.status(401).json({
      message: "Authentication required",
      status: false,
      timeStamp: helperGetCurrentTimestamp(),
    });
    return;
  }

  try {
    const user = await userQueryFindByToken(auth);
    if (!user) {
      res.status(401).json({
        message: "Invalid authentication",
        status: false,
        timeStamp: helperGetCurrentTimestamp(),
      });
      return;
    }

    (req as any).user = {
      id: user.id,
      phone: user.phone,
      userName: user.userName,
      referralCode: user.referralCode,
      invitedBy: user.invitedBy,
      balance: user.balance,
      freeBonus: user.freeBonus,
      firstDepositBonus: user.firstDepositBonus,
    } as UserFromToken;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed",
      status: false,
      timeStamp: helperGetCurrentTimestamp(),
    });
  }
};
