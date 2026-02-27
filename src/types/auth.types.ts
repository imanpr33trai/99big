import { z } from "zod";

// ==========================================
// AUTHENTICATION SCHEMAS
// ==========================================

export const LoginSchema = z.object({
  phone: z.string().min(10).max(20),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  phone: z.string().min(10).max(20),
  password: z.string().min(6),
  userName: z.string().min(2).max(100),
  inviteCode: z.string().optional(),
  userLevel: z.enum(["0", "1", "2"]).default("0"),
});

export const VerifyCodeSchema = z.object({
  // Trigger OTP
});

// ==========================================
// AUTHENTICATION TYPES
// ==========================================

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface AuthPayload {
  userId: number;
  phone: string;
  userLevel: number;
  authToken?: string;
}
