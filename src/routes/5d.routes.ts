import { Router } from "express";
import { Pool } from "mysql2/promise";
import { create5DController } from "src/controllers/admin/5d.controller";
import { createAdminAuthMiddleware } from "src/middleware/adminAuth.middleware";
import { bet5dHandler } from "../controllers/5d/bet5d.controller";
import { getMyEmerdList5dHandler } from "../controllers/5d/getMyEmerdList.controller";
import { listOrderOld5dHandler } from "../controllers/5d/listOrderOld.controller";
import { authenticate } from "../middleware/auth.middleware";

export const create5dRoutes = (db: Pool): Router => {
  const router = Router();
  const adminAuth = createAdminAuthMiddleware(db);
  const controller = create5DController(db);

  // Apply auth middleware to all routes
  router.use(adminAuth);

  router.post("/listOrderOld", controller.listOrderOld);
  router.post("/editResult", controller.editResult);

  router.post("/bet", authenticate(db), bet5dHandler(db));
  router.post("/history", authenticate(db), listOrderOld5dHandler(db));
  router.post("/my-bets", authenticate(db), getMyEmerdList5dHandler(db));

  return router;
};
