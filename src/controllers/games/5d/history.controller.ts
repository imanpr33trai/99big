import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { getUser5DBets } from "../../../db";
import { K5DApiResponse, K5DMyBetsResponse, K5DMyBetsSchema } from "../../../types";

/**
 * Handler for getting user's 5D bet history
 */
export const getMyEmerdList5dHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validate input
      const validationResult = K5DMyBetsSchema.safeParse(req.body);

      if (!validationResult.success) {
        const response: K5DApiResponse = {
          message: "Invalid parameters",
          status: false,
          timeStamp: Date.now(),
        };
        res.status(400).json(response);
        return;
      }

      const { gameJoin, pageno, pageto } = validationResult.data;

      // 2. Get authenticated user
      const user = req.user;
      if (!user) {
        const response: K5DApiResponse = {
          message: "User not authenticated",
          status: false,
          timeStamp: Date.now(),
        };
        res.status(401).json(response);
        return;
      }

      // 3. Get user's bets
      const bets = await getUser5DBets(db, user.id, parseInt(gameJoin), pageno, pageto);

      const response: K5DApiResponse<K5DMyBetsResponse> = {
        code: 0,
        message: "Get success",
        data: {
          gameslist: bets,
          page: pageno,
        },
        status: true,
      };

      res.json(response);
    } catch (error) {
      console.error("My bets fetch error:", error);
      const response: K5DApiResponse = {
        message: "Internal server error",
        status: false,
        timeStamp: Date.now(),
      };
      res.status(500).json(response);
    }
  };
