// controllers/admin/adminAuth.controller.ts
import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { findUserByPhone, updateUserStatus } from "../../db/admin.queries";
import { authenticateUser } from "../../services/auth/auth.service";
import { ApiResponse, LoginSchema, RegisterSchema } from "../../types/admin.types";
import {
  generateRandomNumber,
  generateReferralCode,
  getCurrentTimestamp,
  getIpAddress,
  hashPassword,
} from "../../utils/admin.helpers";

const timeNow = Date.now();

export const createAdminAuthController = (db: Pool) => ({
  login: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const parsed = LoginSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          message: "Invalid input",
          status: false,
          timeStamp: timeNow,
          errors: parsed.error.errors,
        });
        return;
      }

      const { phone, password } = parsed.data;
      const user = await authenticateUser(db, phone, password);

      if (!user) {
        res.status(401).json({
          message: "Invalid credentials",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      if (user.userLevel !== 1) {
        res.status(403).json({
          message: "Access denied",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      res.status(200).json({
        message: "Login successful",
        status: true,
        timeStamp: timeNow,
        data: {
          phone: user.phone,
          userName: user.userName,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Internal server error",
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  register: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const parsed = RegisterSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          message: "Invalid input",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const { username, password, invitecode } = parsed.data;

      const existingUser = await findUserByPhone(db, username);
      if (existingUser) {
        res.status(400).json({
          message: "Phone number already registered",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const passwordHash = await hashPassword(password);
      const referralCode = generateReferralCode();
      const idUser = generateRandomNumber(10000, 99999);
      const nameUser = "Member" + generateRandomNumber(10000, 99999);
      const ip = getIpAddress(req);
      const time = getCurrentTimestamp();

      // Default invite code if not provided
      const finalInviteCode = invitecode || "2cOCs36373";

      // Insert new user
      await db.execute(
        `INSERT INTO users (
          id_user, phone, userName, passwordHash, balance, userLevel,
          referralCode, invitedBy, isVerified, lastLoginIp, status, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?,
          (SELECT id FROM users WHERE referralCode = ? LIMIT 1),
          ?, ?, ?, ?)`,
        [
          idUser,
          username,
          nameUser,
          passwordHash,
          0,
          2,
          referralCode,
          finalInviteCode,
          true,
          ip,
          0,
          time,
        ],
      );

      // Insert into userPoints
      await db.execute(
        "INSERT INTO userPoints (userId, points, createdAt) VALUES ((SELECT id FROM users WHERE phone = ?), 0, ?)",
        [username, time],
      );

      res.status(200).json({
        message: "Registration successful",
        status: true,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        message: "Registration failed",
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  changeAdmin: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { value, type, typeid } = req.body;

      if (!value || !type || !typeid) {
        res.status(400).json({
          message: "Missing required fields",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      let game = "";
      let bs = "";

      switch (typeid) {
        case "1":
          game = "wingo1_control";
          bs = "bs1";
          break;
        case "2":
          game = "wingo3_control";
          bs = "bs3";
          break;
        case "3":
          game = "wingo5_control";
          bs = "bs5";
          break;
        case "4":
          game = "wingo10_control";
          bs = "bs10";
          break;
        default:
          res.status(400).json({
            message: "Invalid typeid",
            status: false,
            timeStamp: timeNow,
          });
          return;
      }

      if (type === "change-wingo1") {
        await db.execute("UPDATE adminConfigs SET configValue = ? WHERE configKey = ?", [
          value,
          game,
        ]);
        res.status(200).json({
          message: "Editing results successfully",
          status: true,
          timeStamp: timeNow,
        });
        return;
      }

      if (type === "change-win_rate") {
        await db.execute("UPDATE adminConfigs SET configValue = ? WHERE configKey = ?", [
          value,
          bs,
        ]);
        res.status(200).json({
          message: "Editing win rate successfully",
          status: true,
          timeStamp: timeNow,
        });
        return;
      }

      res.status(400).json({
        message: "Invalid type",
        status: false,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.error("Change admin error:", error);
      res.status(500).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  settingCskh: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { telegram, cskh, myapp_web } = req.body;

      if (!telegram || !cskh) {
        res.status(400).json({
          message: "Missing required fields",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      await db.execute(
        "UPDATE adminConfigs SET configValue = CASE configKey WHEN ? THEN ? WHEN ? THEN ? WHEN ? THEN ? END WHERE configKey IN (?, ?, ?)",
        [
          "telegram_link",
          telegram,
          "customer_service",
          cskh,
          "app_download_link",
          myapp_web || "#",
          "telegram_link",
          "customer_service",
          "app_download_link",
        ],
      );

      res.status(200).json({
        message: "Successful change",
        status: true,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.error("Setting CSKH error:", error);
      res.status(500).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  banned: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { id, type } = req.body;

      if (!id || !type) {
        res.status(400).json({
          message: "Missing required fields",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const status = type === "open" ? 0 : 2;
      await updateUserStatus(db, id, status);

      res.status(200).json({
        message: "Successful change",
        status: true,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.error("Banned error:", error);
      res.status(500).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      });
    }
  },
});
