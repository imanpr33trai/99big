import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { updateK3ControlSettings } from "../../../db/k3.queries";
import { K3ApiResponse, K3EditResultSchema } from "../../../types/k3.types";

export const editResultHandler =
  (db: Pool) =>
  async (req: Request, res: Response<K3ApiResponse>): Promise<void> => {
    try {
      const parsed = K3EditResultSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          message: "Invalid input",
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      const { game, list } = parsed.data;

      // Update control settings with predefined result
      await updateK3ControlSettings(db, game, list);

      res.status(200).json({
        message: "Result updated successfully",
        status: true,
        timeStamp: Date.now(),
      });
    } catch (error) {
      console.error("editResultHandler error:", error);
      res.status(500).json({
        message: "Failed to update result",
        status: false,
        timeStamp: Date.now(),
      });
    }
  };
