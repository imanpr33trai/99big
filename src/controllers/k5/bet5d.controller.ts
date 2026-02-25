import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { z } from "zod";
import { create5dBet, get5dCurrentSession } from "../../db/5d.queries";
import { createCommissionRecord, getCommissionLevels } from "../../db/user.queries";
import { getUserByToken, updateUserBalance } from "../../services/auth.service";
import { validate5dBet } from "../../services/k5/5dValidation.service";
import { distributeCommissions } from "../../services/k5/commission.service";

const bet5dSchema = z.object({
  join: z.enum(["a", "b", "c", "d", "e", "total"]),
  list_join: z.string().max(10),
  x: z.string().regex(/^\d+$/),
  money: z.enum(["1", "10", "100", "1000"]),
  game: z.enum(["1", "3", "5", "10"]),
});

export const bet5dHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = req.cookies?.auth;
      if (!auth) {
        res.status(401).json({ message: "Authentication required", status: false });
        return;
      }

      const parseResult = bet5dSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ message: "Invalid bet data", status: false });
        return;
      }

      const { join, list_join, x, money, game } = parseResult.data;

      if (!validate5dBet(join, list_join, x, money, game)) {
        res.status(400).json({ message: "Invalid bet", status: false });
        return;
      }

      const session = await get5dCurrentSession(db, parseInt(game));
      const user = await getUserByToken(db, auth);

      if (!session || !user) {
        res.status(400).json({ message: "Error!", status: false });
        return;
      }

      const total = parseInt(money) * parseInt(x) * list_join.length;
      const fee = total * 0.02;
      const price = total - fee;

      if (user.balance < total) {
        res.status(400).json({ message: "The amount is not enough", status: false });
        return;
      }

      const date = new Date();
      const years = String(date.getFullYear());
      const months = String(date.getMonth() + 1).padStart(2, "0");
      const days = String(date.getDate()).padStart(2, "0");
      const idProduct = years + months + days + Math.floor(Math.random() * 1000000000000000);
      const timeNow = Date.now();

      await create5dBet(db, {
        idProduct,
        phone: user.phone,
        code: user.referralCode,
        invite: user.invitedBy,
        stage: session.period,
        level: user.userLevel,
        money: total,
        price,
        amount: parseInt(x),
        fee,
        game: parseInt(game),
        joinBet: join,
        bet: list_join,
        status: 0,
        time: timeNow,
      });

      await updateUserBalance(db, auth, -total);

      const updatedUser = await getUserByToken(db, auth);

      await distributeCommissions(db)(auth, total);

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
          time: timeNow,
        });
      }

      res.status(200).json({
        message: "Successful bet",
        status: true,
        change: updatedUser?.userLevel,
        money: updatedUser?.balance,
      });
    } catch (error) {
      console.error("Bet 5D error:", error);
      res.status(500).json({ message: "Internal error", status: false });
    }
  };
