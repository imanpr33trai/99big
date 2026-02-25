import { Router } from "express";
import { Pool } from "mysql2/promise";
import {
  userAuthMiddleware,
  sensitiveOperationRateLimit,
  requireLevel,
} from "../middleware/userAuth.middleware";

// Import all controllers
import { verifyCodeHandler } from "../controllers/user/verifyCode.controller";
import { userInfoHandler } from "../controllers/user/userInfo.controller";
import { changeUserHandler } from "../controllers/user/changeUser.controller";
import { changePasswordHandler } from "../controllers/user/changePassword.controller";
import { checkInHandler } from "../controllers/user/checkIn.controller";
import { aviatorHandler } from "../controllers/user/aviator.controller";
import { promotionHandler } from "../controllers/user/promotion.controller";
import { myTeamHandler } from "../controllers/user/myTeam.controller";
import { listMyTeamHandler } from "../controllers/user/listMyTeam.controller";
import { rechargeHandler } from "../controllers/user/recharge.controller";
import { cancelRechargeHandler } from "../controllers/user/cancelRecharge.controller";
import { recharge2Handler } from "../controllers/user/recharge2.controller";
import { listRechargeHandler } from "../controllers/user/listRecharge.controller";
import { confirmRechargeHandler } from "../controllers/user/confirmRecharge.controller";
import { updateRechargeHandler } from "../controllers/user/updateRecharge.controller";
import { addBankHandler } from "../controllers/user/addBank.controller";
import { infoUserBankHandler } from "../controllers/user/infoUserBank.controller";
import { withdrawalHandler } from "../controllers/user/withdrawal.controller";
import { listWithdrawHandler } from "../controllers/user/listWithdraw.controller";
import { transferHandler } from "../controllers/user/transfer.controller";
import { transferHistoryHandler } from "../controllers/user/transferHistory.controller";
import { useRedEnvelopeHandler } from "../controllers/user/useRedEnvelope.controller";
import { searchHandler } from "../controllers/user/search.controller";
import { callbackBankHandler } from "../controllers/user/callbackBank.controller";
import { confirmUSDTRechargeHandler } from "../controllers/user/confirmUSDTRecharge.controller";

export const createUserRoutes = (db: Pool): Router => {
  const router = Router();

  // Auth & Account
  router.post("/verify-code", userAuthMiddleware(db), verifyCodeHandler(db));
  router.get("/user-info", userAuthMiddleware(db), userInfoHandler(db));
  router.post("/change-user", userAuthMiddleware(db), changeUserHandler(db));
  router.post(
    "/change-password",
    userAuthMiddleware(db),
    sensitiveOperationRateLimit(3, 300000), // 3 attempts per 5 minutes
    changePasswordHandler(db),
  );

  // Check-in
  router.post("/check-in", userAuthMiddleware(db), checkInHandler(db));

  // Games
  router.get("/aviator", userAuthMiddleware(db), aviatorHandler(db));

  // Promotion & Team
  router.get("/promotion", userAuthMiddleware(db), promotionHandler(db));
  router.get("/my-team", userAuthMiddleware(db), myTeamHandler(db));
  router.get("/list-my-team", userAuthMiddleware(db), listMyTeamHandler(db));

  // Banking
  router.post("/add-bank", userAuthMiddleware(db), addBankHandler(db));
  router.get("/info-user-bank", userAuthMiddleware(db), infoUserBankHandler(db));

  // Recharge
  router.post("/recharge", userAuthMiddleware(db), rechargeHandler(db));
  router.post("/cancel-recharge", userAuthMiddleware(db), cancelRechargeHandler(db));
  router.get("/recharge2", userAuthMiddleware(db), recharge2Handler(db));
  router.get("/list-recharge", userAuthMiddleware(db), listRechargeHandler(db));
  router.post("/confirm-recharge", userAuthMiddleware(db), confirmRechargeHandler(db));
  router.post("/update-recharge", userAuthMiddleware(db), updateRechargeHandler(db));

  // Withdrawal
  router.post(
    "/withdrawal",
    userAuthMiddleware(db),
    sensitiveOperationRateLimit(3, 86400000), // 3 attempts per day
    withdrawalHandler(db),
  );
  router.get("/list-withdraw", userAuthMiddleware(db), listWithdrawHandler(db));

  // Transfer
  router.post(
    "/transfer",
    userAuthMiddleware(db),
    sensitiveOperationRateLimit(5, 3600000), // 5 attempts per hour
    transferHandler(db),
  );
  router.get("/transfer-history", userAuthMiddleware(db), transferHistoryHandler(db));

  // Red Envelope
  router.post("/use-red-envelope", userAuthMiddleware(db), useRedEnvelopeHandler(db));

  // Search (Admin/CTV only)
  router.post(
    "/search",
    userAuthMiddleware(db),
    requireLevel(2), // CTV or Admin only
    searchHandler(db),
  );

  // Callbacks (Public endpoints for payment gateways)
  router.post("/callback-bank", callbackBankHandler(db));
  router.post("/confirm-usdt-recharge", confirmUSDTRechargeHandler(db));

  return router;
};

export default createUserRoutes;
