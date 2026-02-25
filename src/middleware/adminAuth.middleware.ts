// src/middleware/adminAuth.middleware.ts
import { NextFunction, Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { findAdminByToken } from "../db/admin.queries";
import { AdminApiResponse, AdminAuthPayload } from "../types/admin.types";

/**
 * Create admin authentication middleware
 */
export const createAdminAuthMiddleware = (db: Pool) => {
  return async (
    req: Request & { admin?: AdminAuthPayload },
    res: Response<AdminApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authToken = req.cookies?.auth || req.headers.authorization?.replace("Bearer ", "");

      if (!authToken) {
        res.status(401).json({
          message: "Authentication required",
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      const admin = await findAdminByToken(db, authToken);

      if (!admin) {
        res.status(401).json({
          message: "Invalid or expired token",
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      if (admin.status !== 0) {
        res.status(403).json({
          message: "Account is suspended or banned",
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      if (admin.userLevel !== 1) {
        res.status(403).json({
          message: "Admin access required",
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      req.admin = {
        id: admin.id,
        phone: admin.phone,
        userLevel: admin.userLevel,
        status: admin.status,
      };

      next();
    } catch (error) {
      console.error("Admin auth middleware error:", error);
      res.status(500).json({
        message: "Authentication error",
        status: false,
        timeStamp: Date.now(),
      });
    }
  };
};
