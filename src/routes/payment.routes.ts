import { Router } from "express";
import { Pool } from "mysql2/promise";
import {
  initiateUPIPaymentHandler,
  verifyUPIPaymentHandler,
} from "../controllers/payment/gateways/upi.controller";
import {
  initiateManualUPIPaymentHandler,
  addManualUPIPaymentRequestHandler,
  initiateManualUSDTPaymentHandler,
  addManualUSDTPaymentRequestHandler,
} from "../controllers/payment/gateways/manual.controller";
import {
  initiateWowPayPaymentHandler,
  verifyWowPayPaymentHandler,
} from "../controllers/payment/gateways/wowpay.controller";
import { callbackBankHandler } from "../controllers/payment/callback.controller";
import {
  paymentAuthMiddleware,
  paymentRateLimitMiddleware,
} from "../middleware/paymentAuth.middleware";

export const createPaymentRoutes = (db: Pool): Router => {
  const router = Router();

  // Apply rate limiting to all payment routes
  router.use(paymentRateLimitMiddleware(10, 60000));

  // UPI Gateway (EKQR)
  router.post("/upi/initiate", paymentAuthMiddleware(db), initiateUPIPaymentHandler(db));
  router.get("/upi/verify", paymentAuthMiddleware(db), verifyUPIPaymentHandler(db));

  // WowPay
  router.get("/wowpay/initiate", paymentAuthMiddleware(db), initiateWowPayPaymentHandler(db));
  router.post("/wowpay/verify", verifyWowPayPaymentHandler(db));
  router.get("/wowpay/verify", verifyWowPayPaymentHandler(db)); // Support both GET and POST for flexibility

  // Manual UPI
  router.get("/manual/upi", initiateManualUPIPaymentHandler(db));
  router.post("/manual/upi", paymentAuthMiddleware(db), addManualUPIPaymentRequestHandler(db));

  // Manual USDT
  router.get("/manual/usdt", initiateManualUSDTPaymentHandler(db));
  router.post("/manual/usdt", paymentAuthMiddleware(db), addManualUSDTPaymentRequestHandler(db));

  // Bank Transfer Callback (Generic webhook endpoint)
  router.post("/callback/bank", callbackBankHandler(db));
  router.get("/callback/bank", callbackBankHandler(db)); // Some gateways use GET

  // Health check for payment routes
  router.get("/health", (req, res) => {
    res.json({ status: "Payment routes operational", timestamp: Date.now() });
  });

  return router;
};

export default createPaymentRoutes;
