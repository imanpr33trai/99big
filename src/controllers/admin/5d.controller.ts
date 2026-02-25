// controllers/admin/5d.controller.ts
import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { get5DGameSessions, get5DWaitingBets, getCurrent5DPeriod } from "../../db/5d.queries";
import { ApiResponse } from "../../types/admin.types";

export const create5DController = (db: Pool) => ({
  listOrderOld: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { gameJoin } = req.body;

      const validGames = ["1", "3", "5", "10"];
      if (!validGames.includes(String(gameJoin))) {
        res.status(400).json({
          code: 0,
          msg: "No more data",
          data: { gameslist: [] },
          status: false,
        });
        return;
      }

      const game = Number(gameJoin);
      const join = `k5d${game === 1 ? "" : game}`;

      const k5d = await get5DGameSessions(db, game, 0, 10);
      const period = await getCurrent5DPeriod(db, game);
      const waiting = await get5DWaitingBets(db, game);

      const [settings] = await db.execute(
        "SELECT configValue FROM adminConfigs WHERE configKey = ?",
        [join],
      );

      if (k5d.length === 0) {
        res.status(404).json({
          code: 0,
          msg: "No more data",
          data: { gameslist: [] },
          status: false,
        });
        return;
      }

      res.status(200).json({
        code: 0,
        msg: "Get success",
        data: { gameslist: k5d },
        bet: waiting,
        settings,
        join,
        period,
        status: true,
      });
    } catch (error) {
      console.error("List order old error:", error);
      res.status(500).json({
        message: "Error!",
        status: false,
      });
    }
  },

  editResult: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { game, list } = req.body;

      if (!list || !game) {
        res.status(400).json({
          message: "ERROR!!!",
          status: false,
        });
        return;
      }

      const join = `k5d${game === 1 ? "" : game}`;

      await db.execute("UPDATE adminConfigs SET configValue = ? WHERE configKey = ?", [list, join]);

      res.status(200).json({
        message: "Editing is successful",
        status: true,
      });
    } catch (error) {
      console.error("Edit result error:", error);
      res.status(500).json({
        message: "ERROR!!!",
        status: false,
      });
    }
  },
});
