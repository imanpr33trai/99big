import { Router } from "express";
import { middlewareAuth } from "../middleware/auth.middleware";
import { middlewareValidate } from "../middleware/validate.middleware";
import {
  userVerifyCodeSchema,
  userChangeInfoSchema,
  userChangePasswordSchema,
  userCheckInSchema,
  userBankSchema,
  userWithdrawSchema,
  userTransferSchema,
  userRedEnvelopeSchema,
  userRechargeSchema,
  userUpdateRechargeSchema,
  userConfirmRechargeSchema,
  userSearchSchema,
  userCancelRechargeSchema,
  userInfoBankSchema,
  userTransferHistorySchema,
  userListRechargeSchema,
  userListWithdrawSchema,
  userPromotionSchema,
  userMyTeamSchema,
  userListMyTeamSchema,
  userRecharge2Schema,
  userAviatorSchema,
  userCallbackBankSchema,
  userConfirmUSDTRechargeSchema,
} from "../schemas/user.schemas";

// Controllers
import { verifyCodeController } from "../controllers/verifyCode.controller";
import { userInfoController } from "../controllers/userInfo.controller";
import { changeUserController } from "../controllers/changeUser.controller";
import { changePasswordController } from "../controllers/changePassword.controller";
import { checkInController } from "../controllers/checkIn.controller";
import { aviatorController } from "../controllers/aviator.controller";
import { promotionController } from "../controllers/promotion.controller";
import { myTeamController } from "../controllers/myTeam.controller";
import { listMyTeamController } from "../controllers/listMyTeam.controller";
import { rechargeController } from "../controllers/recharge.controller";
import { cancelRechargeController } from "../controllers/cancelRecharge.controller";
import { addBankController } from "../controllers/addBank.controller";
import { infoUserBankController } from "../controllers/infoUserBank.controller";
import { withdrawalController } from "../controllers/withdrawal.controller";
import { transferController } from "../controllers/transfer.controller";
import { transferHistoryController } from "../controllers/transferHistory.controller";
import { recharge2Controller } from "../controllers/recharge2.controller";
import { listRechargeController } from "../controllers/listRecharge.controller";
import { searchController } from "../controllers/search.controller";
import { listWithdrawController } from "../controllers/listWithdraw.controller";
import { useRedEnvelopeController } from "../controllers/useRedEnvelope.controller";
import { callbackBankController } from "../controllers/callbackBank.controller";
import { confirmRechargeController } from "../controllers/confirmRecharge.controller";
import { confirmUSDTRechargeController } from "../controllers/confirmUSDTRecharge.controller";
import { updateRechargeController } from "../controllers/updateRecharge.controller";

const router = Router();

// Auth & User Info
router.post(
  "/verify-code",
  middlewareAuth,
  middlewareValidate(userVerifyCodeSchema),
  verifyCodeController,
);
router.get("/user-info", middlewareAuth, userInfoController);
router.post(
  "/change-user",
  middlewareAuth,
  middlewareValidate(userChangeInfoSchema),
  changeUserController,
);
router.post(
  "/change-password",
  middlewareAuth,
  middlewareValidate(userChangePasswordSchema),
  changePasswordController,
);

// Check-in & Games
router.post("/check-in", middlewareAuth, middlewareValidate(userCheckInSchema), checkInController);
router.get("/aviator", middlewareAuth, middlewareValidate(userAviatorSchema), aviatorController);

// Team & Promotion
router.get(
  "/promotion",
  middlewareAuth,
  middlewareValidate(userPromotionSchema),
  promotionController,
);
router.get("/my-team", middlewareAuth, middlewareValidate(userMyTeamSchema), myTeamController);
router.get(
  "/list-my-team",
  middlewareAuth,
  middlewareValidate(userListMyTeamSchema),
  listMyTeamController,
);

// Banking
router.post("/add-bank", middlewareAuth, middlewareValidate(userBankSchema), addBankController);
router.get(
  "/info-user-bank",
  middlewareAuth,
  middlewareValidate(userInfoBankSchema),
  infoUserBankController,
);

// Recharge
router.post(
  "/recharge",
  middlewareAuth,
  middlewareValidate(userRechargeSchema),
  rechargeController,
);
router.post(
  "/cancel-recharge",
  middlewareAuth,
  middlewareValidate(userCancelRechargeSchema),
  cancelRechargeController,
);
router.get(
  "/recharge2",
  middlewareAuth,
  middlewareValidate(userRecharge2Schema),
  recharge2Controller,
);
router.get(
  "/list-recharge",
  middlewareAuth,
  middlewareValidate(userListRechargeSchema),
  listRechargeController,
);
router.post(
  "/confirm-recharge",
  middlewareAuth,
  middlewareValidate(userConfirmRechargeSchema),
  confirmRechargeController,
);
router.post(
  "/update-recharge",
  middlewareAuth,
  middlewareValidate(userUpdateRechargeSchema),
  updateRechargeController,
);

// Withdrawal
router.post(
  "/withdrawal",
  middlewareAuth,
  middlewareValidate(userWithdrawSchema),
  withdrawalController,
);
router.get(
  "/list-withdraw",
  middlewareAuth,
  middlewareValidate(userListWithdrawSchema),
  listWithdrawController,
);

// Transfer
router.post(
  "/transfer",
  middlewareAuth,
  middlewareValidate(userTransferSchema),
  transferController,
);
router.get(
  "/transfer-history",
  middlewareAuth,
  middlewareValidate(userTransferHistorySchema),
  transferHistoryController,
);

// Red Envelope
router.post(
  "/use-red-envelope",
  middlewareAuth,
  middlewareValidate(userRedEnvelopeSchema),
  useRedEnvelopeController,
);

// Search
router.post("/search", middlewareAuth, middlewareValidate(userSearchSchema), searchController);

// Callbacks
router.post("/callback-bank", middlewareValidate(userCallbackBankSchema), callbackBankController);
router.post(
  "/confirm-usdt-recharge",
  middlewareValidate(userConfirmUSDTRechargeSchema),
  confirmUSDTRechargeController,
);

export default router;
