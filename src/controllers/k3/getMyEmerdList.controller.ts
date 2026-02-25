import { Response } from "express";
import { Pool } from "mysql2/promise";
import { getCurrentK3Session, getUserK3Bets } from "../../db/k3.queries";
import {
  AuthenticatedRequest,
  K3ApiResponse,
  K3MyBetsResponse,
  K3MyBetsSchema,
} from "../../types/k3.types";

export const getMyEmerdListHandler =
  (db: Pool) =>
  async (
    req: AuthenticatedRequest,
    res: Response<K3MyBetsResponse | K3ApiResponse>,
  ): Promise<void> => {
    try {
      // 1. Validate input
      const parsed = K3MyBetsSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          message: "Invalid input",
          status: false,
          timeStamp: Date.now(),
        } as K3ApiResponse);
        return;
      }

      const { gameJoin, pageno, pageto } = parsed.data;

      // 2. Get authenticated user
      const user = req.user;
      if (!user) {
        res.status(401).json({
          message: "Unauthorized",
          status: false,
          timeStamp: Date.now(),
        } as K3ApiResponse);
        return;
      }

      const gameNum = parseInt(gameJoin);

      // 3. Get user's bet history
      const bets = await getUserK3Bets(db, user.id, gameNum, pageno, pageto);

      // 4. Get current period for context
      const currentSession = await getCurrentK3Session(db, gameNum);
      const currentPeriod = currentSession ? parseInt(currentSession.period) : 0;

      // 5. Calculate total winnings for current stage
      let totalWin = 0;
      const formattedBets = bets.map((bet) => {
        if (bet.stage === currentPeriod && bet.status === 1) {
          totalWin += bet.actualWin;
        }

        return {
          id: bet.id,
          sessionId: bet.sessionId,
          stage: bet.stage,
          betAmount: bet.betAmount,
          selection: bet.selection,
          betType: bet.betType,
          result: bet.result,
          isWin: bet.isWin,
          status: bet.status,
          actualWin: bet.actualWin,
          createdAt: bet.createdAt,
        };
      });

      // 6. Return paginated response
      const response: K3MyBetsResponse = {
        gameslist: formattedBets,
        page: pageno,
        totalWin,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("getMyEmerdListHandler error:", error);
      res.status(500).json({
        message: "Failed to retrieve bet history",
        status: false,
        timeStamp: Date.now(),
      } as K3ApiResponse);
    }
  };
