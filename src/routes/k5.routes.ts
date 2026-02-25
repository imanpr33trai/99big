import { Router } from "express";
import { Pool } from "mysql2/promise";
import { add5dHandler } from "../controllers/5d/add5d.controller";
import { bet5dHandler } from "../controllers/5d/bet5d.controller";
import { getMyEmerdList5dHandler } from "../controllers/5d/getMyEmerdList.controller";
import { listOrderOld5dHandler } from "../controllers/5d/listOrderOld.controller";
import { create5DController } from "../controllers/admin/adminMember.controller";
import { k5dAuthMiddleware } from "../middleware/5dAuth.middleware";

// Simple admin auth middleware (placeholder - implement based on your auth system)
const createAdminAuthMiddleware = (db: Pool) => {
  return async (req: any, res: any, next: any) => {
    // Implement admin authentication logic
    // Check if user is admin (level 1)
    next();
  };
};

export const create5dRoutes = (db: Pool): Router => {
  const router = Router();
  const adminAuth = createAdminAuthMiddleware(db);

  // User routes (require user auth)
  router.post("/bet", k5dAuthMiddleware(db), bet5dHandler(db));
  router.post("/history", k5dAuthMiddleware(db), listOrderOld5dHandler(db));
  router.post("/my-bets", k5dAuthMiddleware(db), getMyEmerdList5dHandler(db));

  // Admin routes (require admin auth)
  router.use(adminAuth);
  router.post("/listOrderOld", create5DController(db).listOrderOld);
  router.post("/editResult", create5DController(db).editResult);

  // Game management (internal)
  router.post("/admin/add-period", async (req, res) => {
    try {
      const { game } = req.body;
      await add5dHandler(db)(parseInt(game));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to add period" });
    }
  });

  return router;
};
