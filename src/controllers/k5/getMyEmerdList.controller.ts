import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { z } from "zod";
import { countUserBets5d, getUserBets5d, getUserByToken } from "../../db/5d.queries";

const myBetsSchema = z.object({
  gameJoin: z.enum(["1", "3", "5", "10"]),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

export const getMyEmerdList5dHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = req.cookies?.auth;
      if (!auth) {
        res.status(401).json({ code: 0, msg: "No auth", data: { gameslist: [] }, status: false });
        return;
      }

      const parseResult = myBetsSchema.safeParse(req.body);
      if (!parseResult.success) {
        res
          .status(400)
          .json({ code: 0, msg: "Invalid params", data: { gameslist: [] }, status: false });
        return;
      }

      const { gameJoin, pageno, pageto } = parseResult.data;
      const game = parseInt(gameJoin);

      const user = await getUserByToken(db, auth);
      if (!user) {
        res
          .status(401)
          .json({ code: 0, msg: "User not found", data: { gameslist: [] }, status: false });
        return;
      }

      const bets = await getUserBets5d(db, user.phone, game, pageno, pageto);
      const total = await countUserBets5d(db, user.phone, game);

      if (bets.length === 0) {
        res
          .status(200)
          .json({ code: 0, msg: "No more data", data: { gameslist: [] }, page: 1, status: false });
        return;
      }

      const page = Math.ceil(total / 10);

      const sanitized = bets.map(({ id, phone, code, invite, level, game, ...others }) => others);

      res.status(200).json({
        code: 0,
        msg: "Get Success",
        data: { gameslist: sanitized },
        page,
        status: true,
      });
    } catch (error) {
      console.error("Get my emerd list 5D error:", error);
      res.status(500).json({ code: 0, msg: "Error", data: { gameslist: [] }, status: false });
    }
  };
