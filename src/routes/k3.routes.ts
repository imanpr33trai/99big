import { Request, Response, Router } from "express";
import { Pool } from "mysql2/promise";
import { addK3Handler } from "src/controllers/k3/addK3.controller";
import { betK3Handler } from "src/controllers/k3/betK3.controller";
import { getMyEmerdListHandler } from "src/controllers/k3/getMyEmerdList.controller";
import { listOrderOldHandler } from "src/controllers/k3/listOrderOld.controller";
import { placeK3BetHandler } from "src/controllers/k3/validate.controller";
import { commissionDistributionHandler } from "../controllers/k3/commission.controller";
import { authenticate, authenticateAdmin } from "../middleware/auth.middleware";

export const createCommissionRoutes = (db: Pool): Router => {
  const router = Router();

  // POST /api/commissions/distribute
  router.post("/distribute", authenticate, commissionDistributionHandler(db));
  router.post("/bet", authenticate, placeK3BetHandler(db));
  router.post("/bet", authenticate, betK3Handler(db));

  // Admin routes (for game management)
  router.post("/admin/add-period", authenticateAdmin, (req: Request, res: Response) => {
    const { game } = req.body;
    addK3Handler(db)(parseInt(game))
      .then(() => res.json({ success: true, message: "Period added" }))
      .catch(() => res.status(500).json({ success: false, message: "Failed to add period" }));
  });

  router.post("/bet", authenticate(db), betK3Handler(db));
  router.post("/history", authenticate(db), listOrderOldHandler(db));
  router.post("/my-bets", authenticate(db), getMyEmerdListHandler(db));

  // Additional routes can be added here
  // router.get('/history', authenticate, getK3HistoryHandler(db));
  // router.get('/current-session', getCurrentK3SessionHandler(db));

  return router;
};
