import { calculateBetAmount, processK3Bet, validateBetSelection } from "@/services/games/k3";
import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { findUserByToken, getCurrentK3Session, updateUserBalance } from "../../../db/";
import { K3ApiResponse, K3BetSchema } from "../../../types/k3.types";

export const betK3Handler =
  (db: Pool) =>
  async (req: Request, res: Response<K3ApiResponse>): Promise<void> => {
    try {
      // 1. Validate input with Zod
      const parsed = K3BetSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          message: "Invalid input: " + parsed.error.issues.map((e) => e.message).join(", "),
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      const { listJoin, game, gameJoin, xvalue, money } = parsed.data;
      const auth = req.cookies?.auth || req.headers?.authorization?.replace("Bearer ", "");

      if (!auth) {
        res.status(401).json({
          message: "Authentication required",
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      // 2. Get current game session
      const gameNum = parseInt(game);
      const session = await getCurrentK3Session(db, gameNum);

      if (!session) {
        res.status(400).json({
          message: "No active game session",
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      // Check if betting is still open
      const now = Date.now();
      if (session.closedAt && now >= session.closedAt) {
        res.status(400).json({
          message: "Betting is closed for this period",
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      // 3. Get user and check balance
      const user = await findUserByToken(db, auth);
      if (!user) {
        res.status(401).json({
          message: "Unauthorized",
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      // 4. Validate bet selection
      if (!validateBetSelection(listJoin, gameJoin)) {
        res.status(400).json({
          message: "Invalid bet selection",
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      // 5. Calculate total bet amount and fee
      const calculation = calculateBetAmount(gameJoin, listJoin, money, xvalue);

      // 6. Check sufficient balance
      if (user.balance < calculation.total) {
        res.status(400).json({
          message: "The amount is not enough",
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      // 7. Create bet record
      const bet = await processK3Bet(db, user.id, {
        sessionId: session.id,
        stage: session.period,
        listJoin,
        gameJoin,
        money,
        xvalue,
        game: gameNum,
      });

      // 8. Deduct balance
      await updateUserBalance(db, user.id, -calculation.total);

      // 9. Get updated balance
      const newBalance = user.balance - calculation.total;

      // 10. Return success response
      res.status(200).json({
        message: "Successful bet",
        status: true,
        money: newBalance,
        change: user.userLevel,
        timeStamp: Date.now(),
      });
    } catch (error) {
      console.error("betK3Handler error:", error);
      res.status(500).json({
        message: "Failed to place bet",
        status: false,
        timeStamp: Date.now(),
      });
    }
  };
