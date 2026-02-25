import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { CONFIG } from "src/config/k3.config";
import {
  distributeCommissionToUser,
  findReferrerByCode,
  findUserByToken,
  getCommissionLevels,
  logCommissionDistribution,
} from "src/db/k3.queries";
import { calculateCommission, shouldDistributeCommission } from "src/services/k3.service";
import {
  CommissionDistribution,
  CommissionDistributionInput,
  commissionDistributionSchema,
} from "src/types/k3.types";

export const commissionDistributionHandler =
  (db: Pool) =>
  async (req: Request<{}, {}, CommissionDistributionInput>, res: Response): Promise<void> => {
    const requestId = crypto.randomUUID();
    const timestamp = Date.now();

    try {
      // Validate input
      const parseResult = commissionDistributionSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parseResult.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { authToken, amount, sourceType } = parseResult.data;

      // Distribute commissions
      const distributions = await distributeCommissionToUser(db, authToken, amount, sourceType);

      res.status(200).json({
        success: true,
        message: "Commissions distributed successfully",
        data: {
          betAmount: amount,
          totalDistributed: distributions.reduce((sum, d) => sum + d.amount, 0),
          distributions,
          timestamp: timestamp.toString(),
        },
      });
    } catch (error) {
      console.error(`[${requestId}] Commission distribution error:`, error);

      res.status(500).json({
        success: false,
        message: "Failed to distribute commissions",
        code: "INTERNAL_ERROR",
      });
    }
  };

export const distributeCommissions = async (
  db: Pool,
  authToken: string,
  betAmount: number,
  sourceType: string = "bet",
): Promise<CommissionDistribution[]> => {
  const distributions: CommissionDistribution[] = [];

  // Check minimum threshold
  if (!shouldDistributeCommission(betAmount)) {
    return distributions;
  }

  // Get commission rates
  const rates = await getCommissionLevels(db);

  // Find the betting user
  const user = await findUserByToken(db, authToken);
  if (!user) {
    throw new Error("User not found or not verified");
  }

  // Track current referrer in the chain
  let currentReferrerCode = user.invitedBy;
  let depth = 1;

  // Traverse up the referral chain (F1 -> F2 -> F3 -> F4)
  while (currentReferrerCode && depth <= CONFIG.MAX_REFERRAL_DEPTH) {
    const referrer = await findReferrerByCode(db, currentReferrerCode);

    if (!referrer) {
      break; // Stop if referrer not found
    }

    // Determine rate based on depth
    let rate: number;
    switch (depth) {
      case 1:
        rate = rates.rateF1;
        break;
      case 2:
        rate = rates.rateF2;
        break;
      case 3:
        rate = rates.rateF3;
        break;
      case 4:
        rate = rates.rateF4;
        break;
      default:
        rate = 0;
    }

    if (rate > 0) {
      const commissionAmount = calculateCommission(betAmount, rate);

      // Distribute commission
      await distributeCommissionToUser(db, referrer.phone, commissionAmount, depth === 1);

      // Log the distribution
      const [userRows] = await db.execute("SELECT id FROM users WHERE phone = ?", [user.phone]);
      const [referrerRows] = await db.execute("SELECT id FROM users WHERE phone = ?", [
        referrer.phone,
      ]);

      if ((userRows as any[])[0] && (referrerRows as any[])[0]) {
        await logCommissionDistribution(
          db,
          (referrerRows as any[])[0].id,
          (userRows as any[])[0].id,
          depth,
          commissionAmount,
          sourceType,
        );
      }

      distributions.push({
        level: depth,
        phone: referrer.phone,
        amount: commissionAmount,
        rate,
      });
    }

    // Move up the chain
    currentReferrerCode = referrer.invitedBy;
    depth++;
  }

  return distributions;
};
