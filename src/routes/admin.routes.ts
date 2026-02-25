// routes/admin.routes.ts
import { Router } from "express";
import { Pool } from "mysql2/promise";
import { createAdminAuthController } from "../controllers/admin/adminAuth.controller";
import { createAdminMemberController } from "../controllers/admin/adminMember.controller";
import { createAdminAuthMiddleware } from "../middleware/adminAuth.middleware";

export const createAdminRoutes = (db: Pool): Router => {
  const router = Router();
  const adminAuth = createAdminAuthMiddleware(db);
  const authController = createAdminAuthController(db);
  const memberController = createAdminMemberController(db);

  // Public routes (no auth required)
  router.post("/login", authController.login);
  router.post("/register", authController.register);

  // Protected routes
  router.use(adminAuth);

  // Member management
  router.post("/listMember", memberController.listMember);
  router.post("/listCTV", memberController.listCTV);
  router.post("/userInfo", memberController.userInfo);
  router.post("/profileUser", memberController.profileUser);
  router.post("/infoCtv", memberController.infoCtv);

  // Financial
  router.get("/statistical2", memberController.statistical2);
  router.get("/recharge", memberController.recharge);
  router.post("/rechargeDuyet", memberController.rechargeDuyet);
  router.post("/handlWithdraw", memberController.handlWithdraw);

  // User details
  router.post("/listRechargeMem/:phone", memberController.listRechargeMem);
  router.post("/listWithdrawMem/:phone", memberController.listWithdrawMem);
  router.post("/listBet/:phone", memberController.listBet);

  // Settings
  router.post("/changeAdmin", authController.changeAdmin);
  router.get("/settingGet", memberController.settingGet);
  router.post("/settingBank", memberController.settingBank);
  router.post("/settingCskh", authController.settingCskh);
  router.post("/banned", authController.banned);

  // Bonus & Salary
  router.post("/createBonus", memberController.createBonus);
  router.get("/listRedenvelops", memberController.listRedenvelops);
  router.post("/settingbuff", memberController.settingBuff);

  // Levels
  router.get("/getLevelInfo", memberController.getLevelInfo);
  router.post("/updateLevel", memberController.updateLevel);

  // Salary
  router.post("/CreatedSalary", memberController.CreatedSalary);
  router.get("/getSalary", memberController.getSalary);

  return router;
};
