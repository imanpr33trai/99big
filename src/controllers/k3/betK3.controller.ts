import crypto from "crypto";
import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import {
  createK3Bet,
  getK3CurrentSession,
  getUserBalanceByToken,
  updateUserBalance,
} from "../../db/k3.queries";
import { createCommissionRecord, getCommissionLevels } from "../../db/user.queries";
import {
  calculateK3BetTotal,
  calculateK3Fees,
  determineK3GameType,
  generateK3ProductId,
  shouldDistributeCommission,
} from "../../services/k3.service";
import { BetK3Body, betK3Schema, K3GameDuration, K3GameJoin } from "../../types/k3.types";

// ============================================================================
// CONTROLLER
// ============================================================================

export const betK3Handler =
  (db: Pool) =>
  async (req: Request<{}, {}, BetK3Body>, res: Response): Promise<void> => {
    const requestId = crypto.randomUUID();
    const timestamp = Date.now();

    try {
      // 1. Get auth and validate body
      const auth = req.cookies?.auth;
      if (!auth) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
          code: "UNAUTHORIZED",
        });
        return;
      }

      const parseResult = betK3Schema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          message: "Invalid bet data",
          errors: parseResult.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { listJoin, game, gameJoin, xvalue, money } = parseResult.data;

      // 2. Get current K3 session
      const session = await getK3CurrentSession(db, parseInt(game) as K3GameDuration);
      if (!session) {
        res.status(400).json({
          success: false,
          message: "No active game session",
          code: "NO_ACTIVE_SESSION",
        });
        return;
      }

      // 3. Get user info
      const user = await getUserBalanceByToken(db, auth);
      if (!user) {
        res.status(401).json({
          success: false,
          message: "User not found or not verified",
          code: "USER_NOT_FOUND",
        });
        return;
      }

      // 4. Calculate bet total
      const total = calculateK3BetTotal({
        gameJoin: gameJoin as K3GameJoin,
        listJoin,
        xvalue,
        money,
      });

      const { fee, price } = calculateK3Fees(total);

      // 5. Check balance
      if (user.balance < total) {
        res.status(400).json({
          success: false,
          message: "Insufficient balance",
          data: {
            required: total,
            available: user.balance,
          },
          code: "INSUFFICIENT_BALANCE",
        });
        return;
      }

      // 6. Generate product ID
      const productId = generateK3ProductId();
      const typeGame = determineK3GameType(gameJoin);

      // 7. Execute transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Create bet record
        await createK3Bet(connection as Pool, {
          idProduct: productId,
          phone: user.phone,
          code: user.referralCode,
          invitedBy: user.invitedBy,
          stage: session.period,
          level: user.userLevel,
          money: total,
          price,
          amount: xvalue,
          fee,
          game: parseInt(game),
          joinBet: parseInt(gameJoin),
          typeGame,
          bet: listJoin,
          status: 0,
          time: timestamp,
        });

        // Deduct balance
        await updateUserBalance(connection as Pool, auth, -total);

        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }

      // 8. Distribute commissions (async, don't block)
      shouldDistributeCommission(db, auth, total, "k3_bet").catch((err) => {
        console.error(`[${requestId}] Commission distribution failed:`, err);
      });

      // 9. Log commission record
      const commissionLevels = await getCommissionLevels(db);
      if (commissionLevels) {
        const f1 = (total / 100) * commissionLevels.rateF1;
        const f2 = (total / 100) * commissionLevels.rateF2;
        const f3 = (total / 100) * commissionLevels.rateF3;
        const f4 = (total / 100) * commissionLevels.rateF4;

        await createCommissionRecord(db, {
          phone: user.phone,
          code: user.referralCode,
          invitedBy: user.invitedBy,
          f1,
          f2,
          f3,
          f4,
          time: timestamp,
        });
      }

      // 10. Get updated balance
      const updatedUser = await getUserBalanceByToken(db, auth);

      res.status(200).json({
        success: true,
        message: "Bet placed successfully",
        data: {
          productId,
          period: session.period,
          total,
          fee,
          price,
          remainingBalance: updatedUser?.balance || 0,
          timestamp: timestamp.toString(),
        },
      });
    } catch (error) {
      console.error(`[${requestId}] K3 bet error:`, error);

      res.status(500).json({
        success: false,
        message: "Failed to place bet",
        code: "INTERNAL_ERROR",
      });
    }
  };
