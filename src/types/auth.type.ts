import { z } from "zod";

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  username: z
    .string()
    .min(9, "Phone number must be 9-10 digits")
    .max(10, "Phone number must be 9-10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  pwd: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================================================
// DATABASE INTERFACES (camelCase)
// ============================================================================

export interface User {
  id: number;
  phone: string;
  userName: string;
  passwordHash: string;
  authToken: string | null;
  balance: number;
  referralCode: string;
  invitedBy: number | null;
  isCollaborator: boolean;
  isVerified: boolean;
  otpCode: string | null;
  otpExpiresAt: number;
  otpAttempts: number;
  lastLoginIp: string | null;
  status: number;
  createdAt: number;
  updatedAt: number;
  userLevel: number;
  commissionLevel: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalBet: number;
  totalWon: number;
  commissionF1: number;
  commissionF2: number;
  commissionF3: number;
  commissionF4: number;
  commissionToday: number;
  rank: number;
  freeBonus: number;
  firstDepositBonus: boolean;
}

// ============================================================================
// JWT PAYLOAD
// ============================================================================

export interface UserJWTPayload {
  id: number;
  phone: string;
  userName: string;
  userLevel: number;
  commissionLevel: number;
}

export interface JWTPayload {
  user: UserJWTPayload;
  iat: number;
  exp: number;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface LoginSuccessResponse {
  success: true;
  message: string;
  data: {
    accessToken: string;
    expiresAt: string;
    user: {
      id: number;
      phone: string;
      userName: string;
      balance: number;
    };
  };
}

export interface LoginErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  code?: string;
}

// ============================================================================
// ============================================================================
// Register User
// ============================================================================
// ============================================================================

export const registerSchema = z.object({
  username: z
    .string()
    .min(9, "Phone number must be 9-10 digits")
    .max(10, "Phone number must be 9-10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  pwd: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number",
    ),
  inviteCode: z.string().min(5, "Invalid invite code").max(20, "Invalid invite code"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ============================================================================
// DATABASE INTERFACES
// ============================================================================

export interface User {
  id: number;
  phone: string;
  userName: string;
  passwordHash: string;
  authToken: string | null;
  balance: number;
  referralCode: string;
  invitedBy: number | null;
  isCollaborator: boolean;
  isVerified: boolean;
  otpCode: string | null;
  otpExpiresAt: number;
  otpAttempts: number;
  lastLoginIp: string | null;
  status: number;
  createdAt: number;
  updatedAt: number;
  userLevel: number;
  commissionLevel: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalBet: number;
  totalWon: number;
  commissionF1: number;
  commissionF2: number;
  commissionF3: number;
  commissionF4: number;
  commissionToday: number;
  rank: number;
  freeBonus: number;
  firstDepositBonus: boolean;
}

export interface CreateUserInput {
  phone: string;
  userName: string;
  passwordHash: string;
  referralCode: string;
  invitedBy: number;
  ctv: string;
  otpCode: string;
  ipAddress: string;
  freeBonus: number;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface RegisterSuccessResponse {
  success: true;
  message: string;
  data: {
    userId: number;
    phone: string;
    userName: string;
    referralCode: string;
  };
}

export interface RegisterErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  code?: string;
}

export const verifyCodeSchema = z.object({
  phone: z
    .string()
    .min(9, "Phone number must be 9-10 digits")
    .max(10, "Phone number must be 9-10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;

export const verifyCodePassSchema = z.object({
  phone: z
    .string()
    .min(9, "Phone number must be 9-10 digits")
    .max(10, "Phone number must be 9-10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export type VerifyCodePassInput = z.infer<typeof verifyCodePassSchema>;

export const forgotPasswordSchema = z.object({
  username: z
    .string()
    .min(9, "Phone number must be 9-10 digits")
    .max(10, "Phone number must be 9-10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must be numeric"),
  pwd: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character",
    ),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const authCookieSchema = z.string().min(1, "Auth token required");
