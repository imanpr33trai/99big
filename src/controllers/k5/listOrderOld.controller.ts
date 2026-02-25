import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { z } from "zod";
import {
  count5dHistory,
  get5dCurrentPeriod,
  get5dHistory,
  getUserByToken,
} from "../../db/5d.queries";

const listOrderSchema = z.object({
  gameJoin: z.enum(["1", "3", "5", "10"]),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

export const listOrderOld5dHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = req.cookies?.auth;
      if (!auth) {
        res.status(401).json({ code: 0, msg: "No auth", data: { gameslist: [] }, status: false });
        return;
      }

      const parseResult = listOrderSchema.safeParse(req.body);
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

      const history = await get5dHistory(db, game, pageno, pageto);
      const total = await count5dHistory(db, game);
      const period = await get5dCurrentPeriod(db, game);

      if (history.length === 0) {
        res
          .status(200)
          .json({ code: 0, msg: "No more data", data: { gameslist: [] }, page: 1, status: false });
        return;
      }

      const page = Math.ceil(total / 10);

      res.status(200).json({
        code: 0,
        msg: "Get success",
        data: { gameslist: history },
        period: period?.period,
        page,
        status: true,
      });
    } catch (error) {
      console.error("List order old 5D error:", error);
      res.status(500).json({ code: 0, msg: "Error", data: { gameslist: [] }, status: false });
    }
  };
