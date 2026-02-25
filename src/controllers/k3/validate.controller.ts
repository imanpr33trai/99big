import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { z } from "zod";
import { distributeCommissions } from "../../../services/commission.service";
import { createK3Bet, getCurrentK3Session } from "../queries/k3.queries";
import { validateK3Bet } from "../services/k3Validation.service";
import { K3BetInput, k3BetSchema } from "../types/k3.types";

// ============================================================================
// BET PLACEMENT CONTROLLER
// ============================================================================

export const placeK3BetHandler =
  (db: Pool) =>
  async (
    req: Request<{}, {}, K3BetInput & { authToken: string }>,
    res: Response,
  ): Promise<void> => {
    const requestId = crypto.randomUUID();
    const timestamp = Date.now();

    try {
      // 1. Validate input schema
      const schema = k3BetSchema.extend({
        authToken: z.string().min(1, "Auth token required"),
      });

      const parseResult = schema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          message: "Invalid bet data",
          errors: parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { join, listJoin, multiplier, money, game, authToken } = parseResult.data;

      // 2. Validate bet logic
      const validation = validateK3Bet(join, listJoin, multiplier, money, game);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: "Invalid bet",
          errors: validation.errors,
          code: "INVALID_BET",
        });
        return;
      }

      // 3. Get current game session
      const session = await getCurrentK3Session(db, parseInt(game));
      if (!session || session.status !== "open") {
        res.status(400).json({
          success: false,
          message: "Game session not available for betting",
          code: "SESSION_CLOSED",
        });
        return;
      }

      // 4. Get user from token
      const [userRows] = await db.execute(
        "SELECT id, phone, balance, referralCode FROM users WHERE authToken = ? AND isVerified = TRUE LIMIT 1",
        [authToken],
      );

      if ((userRows as any[]).length === 0) {
        res.status(401).json({
          success: false,
          message: "User not found or not verified",
          code: "UNAUTHORIZED",
        });
        return;
      }

      const user = (userRows as any[])[0];

      // 5. Calculate bet amounts
      const betAmount = parseInt(money);
      const multiplierValue = parseInt(multiplier);
      const totalAmount = betAmount * multiplierValue * (validation.parsedBets?.length || 1);

      // 6. Check balance
      if (user.balance < totalAmount) {
        res.status(400).json({
          success: false,
          message: "Insufficient balance",
          data: {
            required: totalAmount,
            available: user.balance,
          },
          code: "INSUFFICIENT_BALANCE",
        });
        return;
      }

      // 7. Deduct balance and create bet (transaction)
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Deduct balance
        await connection.execute("UPDATE users SET balance = balance - ? WHERE id = ?", [
          totalAmount,
          user.id,
        ]);

        // Create bet record
        const betId = await createK3Bet(connection as Pool, {
          sessionId: session.id,
          userId: user.id,
          joinType: join,
          betSelections: validation.parsedBets!,
          multiplier: multiplierValue,
          betAmount,
          totalAmount,
          potentialWin: totalAmount * 2, // Adjust based on game rules
          status: "pending",
          createdAt: timestamp,
        });

        await connection.commit();

        // 8. Distribute commissions asynchronously (don't block response)
        distributeCommissions(db, authToken, totalAmount, "k3_bet").catch((err) => {
          console.error(`[${requestId}] Commission distribution failed:`, err);
        });

        res.status(201).json({
          success: true,
          message: "Bet placed successfully",
          data: {
            betId,
            sessionPeriod: session.period,
            totalAmount,
            potentialWin: totalAmount * 2,
            remainingBalance: user.balance - totalAmount,
            timestamp: timestamp.toString(),
          },
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(`[${requestId}] K3 bet error:`, error);

      res.status(500).json({
        success: false,
        message: "Failed to place bet",
        code: "INTERNAL_ERROR",
      });
    }
  };
