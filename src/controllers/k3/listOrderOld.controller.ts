import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { z } from "zod";

const listOrderOldSchema = z.object({
  gameJoin: z.enum(["1", "3", "5", "10"]),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(0),
});

export const listOrderOldHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = req.cookies?.auth;
      if (!auth) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
          code: "UNAUTHORIZED",
        });
        return;
      }

      const parseResult = listOrderOldSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          code: 0,
          msg: "Invalid parameters",
          data: { gameslist: [] },
          status: false,
        });
        return;
      }

      const { gameJoin, pageno, pageto } = parseResult.data;
      const game = Number(gameJoin);

      // Get user
      const [userRows] = await db.execute(
        "SELECT phone, referralCode, invitedBy, userLevel, balance FROM users WHERE authToken = ? AND isVerified = TRUE LIMIT 1",
        [auth],
      );

      if ((userRows as any[]).length === 0) {
        res.status(401).json({
          success: false,
          message: "User not found",
          code: "USER_NOT_FOUND",
        });
        return;
      }

      // Get game history with pagination
      const [k3Rows] = await db.query(
        `SELECT * FROM k3 WHERE status != 0 AND game = ? ORDER BY id DESC LIMIT ?, ?`,
        [game, pageno, pageto],
      );

      const [k3AllRows] = await db.query(`SELECT * FROM k3 WHERE status != 0 AND game = ?`, [game]);

      const [periodRows] = await db.query(
        `SELECT period FROM k3 WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1`,
        [game],
      );

      if ((k3Rows as any[]).length === 0) {
        res.status(200).json({
          code: 0,
          msg: "No more data",
          data: { gameslist: [] },
          page: 1,
          status: false,
        });
        return;
      }

      const page = Math.ceil((k3AllRows as any[]).length / 10);

      res.status(200).json({
        code: 0,
        msg: "Get success",
        data: {
          gameslist: k3Rows,
        },
        period: (periodRows as any[])[0]?.period,
        page,
        status: true,
      });
    } catch (error) {
      console.error("List order old error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  };
