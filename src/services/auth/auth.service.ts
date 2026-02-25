// services/auth/auth.service.ts
import { Pool } from "mysql2/promise";
import { findUserByPhone, findUserByReferralCode } from "../../db/admin.queries";
import { UserRow } from "../../types/admin.types";
import {
  comparePassword,
  generateRandomNumber,
  generateReferralCode,
  hashPassword,
} from "../../utils/admin.helpers";

export const authenticateUser = async (
  db: Pool,
  phone: string,
  password: string,
): Promise<UserRow | null> => {
  const user = await findUserByPhone(db, phone);

  if (!user) {
    return null;
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return user;
};

export const registerUser = async (
  db: Pool,
  phone: string,
  password: string,
  inviteCode: string,
): Promise<{ success: boolean; message: string; userId?: number }> => {
  const existingUser = await findUserByPhone(db, phone);

  if (existingUser) {
    return { success: false, message: "Phone number already registered" };
  }

  const passwordHash = await hashPassword(password);
  const referralCode = generateReferralCode();
  const idUser = generateRandomNumber(10000, 99999);
  const userName = "Member" + generateRandomNumber(10000, 99999);

  let invitedBy: number | null = null;

  if (inviteCode) {
    const inviter = await findUserByReferralCode(db, inviteCode);
    if (inviter) {
      invitedBy = inviter.id;
    }
  }

  // Insert user - in real implementation, use a query function
  // This is a simplified version
  return { success: true, message: "Registration successful", userId: parseInt(idUser) };
};

export const generateAuthToken = (): string => {
  return generateRandomNumber(100000000, 999999999) + generateReferralCode();
};
