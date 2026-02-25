import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { countUserBets, getUserBets, getUserByToken } from "src/db/k3.queries";
import { GetMyEmerdListInput, getMyEmerdListSchema } from "src/types/k3.type";

export const getMyEmerdListHandler =
  (db: Pool) =>
  async (req: Request<{}, {}, GetMyEmerdListInput>, res: Response): Promise<void> => {
    try {
      const auth = req.cookies?.auth;
      if (!auth) {
        res.status(401).json({
          code: 0,
          msg: "Authentication required",
          data: { gameslist: [] },
          status: false,
        });
        return;
      }

      const parseResult = getMyEmerdListSchema.safeParse(req.body);
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

      const user = await getUserByToken(db, auth);
      if (!user) {
        res.status(401).json({
          code: 0,
          msg: "User not found",
          data: { gameslist: [] },
          status: false,
        });
        return;
      }

      const bets = await getUserBets(db, user.phone, game, pageno, pageto);
      const totalBets = await countUserBets(db, user.phone, game);

      if (bets.length === 0) {
        res.status(200).json({
          code: 0,
          msg: "No more data",
          data: { gameslist: [] },
          page: 1,
          status: false,
        });
        return;
      }

      const page = Math.ceil(totalBets / 10);

      // Sanitize data - remove sensitive fields
      const sanitizedBets = bets.map((bet) => {
        const { id, phone, code, invite, level, game: gameField, ...others } = bet;
        return others;
      });

      res.status(200).json({
        code: 0,
        msg: "Get success",
        data: {
          gameslist: sanitizedBets,
        },
        page,
        status: true,
      });
    } catch (error) {
      console.error("Get my emerd list error:", error);
      res.status(500).json({
        code: 0,
        msg: "Internal server error",
        data: { gameslist: [] },
        status: false,
      });
    }
  };
