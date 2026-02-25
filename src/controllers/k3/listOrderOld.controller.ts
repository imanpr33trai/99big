import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { getCurrentK3Session, getK3ControlSettings, getK3History } from "../../db/k3.queries";
import { K3ApiResponse, K3GameSession, K3HistorySchema } from "../../types/k3.types";

interface HistoryResponse {
  code: number;
  msg: string;
  data: {
    gameslist: K3GameSession[];
  };
  period?: string;
  page?: number;
  bet?: unknown[];
  settings?: string | null;
  join?: string;
  status: boolean;
}

export const listOrderOldHandler =
  (db: Pool) =>
  async (req: Request, res: Response<HistoryResponse | K3ApiResponse>): Promise<void> => {
    try {
      // 1. Validate input
      const parsed = K3HistorySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          message: "Invalid input",
          status: false,
          timeStamp: Date.now(),
        } as K3ApiResponse);
        return;
      }

      const { gameJoin, pageno, pageto } = parsed.data;

      // 2. Get game history
      const gameNum = parseInt(gameJoin);
      const history = await getK3History(db, gameNum, pageno, pageto);

      // 3. Get current period
      const currentSession = await getCurrentK3Session(db, gameNum);
      const currentPeriod = currentSession ? currentSession.period : "";

      // 4. Get control settings
      const settings = await getK3ControlSettings(db, gameNum);

      // 5. Return formatted response
      const response: HistoryResponse = {
        code: 0,
        msg: "Get success",
        data: {
          gameslist: history,
        },
        period: currentPeriod,
        page: pageno,
        bet: [],
        settings,
        join: "",
        status: true,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("listOrderOldHandler error:", error);
      res.status(500).json({
        message: "Failed to retrieve history",
        status: false,
        timeStamp: Date.now(),
      } as K3ApiResponse);
    }
  };
