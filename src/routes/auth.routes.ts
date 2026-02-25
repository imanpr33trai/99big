import { Router } from "express";
import rateLimit from "express-rate-limit";
import { Pool } from "mysql2/promise";
import { customerServiceMenuHandler } from "src/controllers/auth/customerService.controller";
import { forgotPasswordHandler } from "src/controllers/auth/forgotPass.controller";
import { verifyCodeHandler } from "src/controllers/auth/verifyCode.controller";
import { verifyCodePassHandler } from "src/controllers/auth/verifyCodePass.controller";
import { optionalAuth } from "src/middleware/auth.middleware";
import { loginHandler } from "../controllers/auth/login.controller";
import { registerHandler } from "../controllers/auth/register.controller";
import { validate } from "../middleware/validation.middleware";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  verifyCodePassSchema,
  verifyCodeSchema,
} from "../types/auth.types";

export const createAuthRoutes = (db: Pool): Router => {
  const router = Router();

  // Rate limiters
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: {
      success: false,
      message: "Too many login attempts. Please try again later.",
      code: "RATE_LIMITED",
    },
  });

  const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: {
      success: false,
      message: "Too many registration attempts. Please try again later.",
      code: "RATE_LIMITED",
    },
  });

  // Routes
  router.post("/login", loginLimiter, validate(loginSchema), loginHandler(db));
  router.post("/register", registerLimiter, validate(registerSchema), registerHandler(db));
  router.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswordHandler(db));
  router.post("/verify-code", validate(verifyCodeSchema), verifyCodeHandler(db));
  router.post("/verify-code-pass", validate(verifyCodePassSchema), verifyCodePassHandler(db));

  // Protected routes
  router.get("/customer-service", optionalAuth(db), customerServiceMenuHandler(db));

  return router;
};
