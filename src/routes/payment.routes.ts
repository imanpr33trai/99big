import { Router } from "express";
import { Pool } from "mysql2/promise";
import {
  addManualUPIPaymentRequestHandler,
  addManualUSDTPaymentRequestHandler,
  initiateManualUPIPaymentHandler,
  initiateManualUSDTPaymentHandler,
} from "../controllers/payment/manualPayment.controller";
import {
  initiateUPIPaymentHandler,
  verifyUPIPaymentHandler,
} from "../controllers/payment/upiGateway.controller";
import {
  initiateWowPayPaymentHandler,
  verifyWowPayPaymentHandler,
} from "../controllers/payment/wowpay.controller";
import { authenticate } from "../middleware/auth.middleware";

export const createPaymentRoutes = (db: Pool): Router => {
  const router = Router();

  // UPI Gateway
  router.post("/upi/initiate", authenticate(db), initiateUPIPaymentHandler(db));
  router.get("/upi/verify", authenticate(db), verifyUPIPaymentHandler(db));

  // WowPay
  router.get("/wowpay/initiate", authenticate(db), initiateWowPayPaymentHandler(db));
  router.post("/wowpay/verify", verifyWowPayPaymentHandler(db));

  // Manual UPI
  router.get("/manual/upi", initiateManualUPIPaymentHandler(db));
  router.post("/manual/upi", authenticate(db), addManualUPIPaymentRequestHandler(db));

  // Manual USDT
  router.get("/manual/usdt", initiateManualUSDTPaymentHandler(db));
  router.post("/manual/usdt", authenticate(db), addManualUSDTPaymentRequestHandler(db));

  return router;
};
