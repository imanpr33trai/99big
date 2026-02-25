import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import {
  paymentQueryFindRechargeByPhoneAndStatus,
  paymentQueryFindWithdrawByPhoneAndStatus,
} from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse } from "../types/user.types";

export const userInfoController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;

  try {
    if (!auth) {
      res.status(200).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const user = await userQueryFindByToken(auth);
    if (!user) {
      res.status(200).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const [recharges] = await Promise.all([
      paymentQueryFindRechargeByPhoneAndStatus(user.phone, 1),
    ]);

    const [withdraws] = await Promise.all([
      paymentQueryFindWithdrawByPhoneAndStatus(user.phone, 1),
    ]);

    let totalRecharge = recharges.reduce((sum, r) => sum + Number(r.money), 0);
    let totalWithdraw = withdraws.reduce((sum, w) => sum + Number(w.money), 0);

    const { passwordHash, plainPassword, lastLoginIp, otpCode, otpExpiresAt, ...safeUser } = user;

    res.status(200).json({
      message: "Success",
      status: true,
      data: {
        code: safeUser.referralCode,
        id_user: safeUser.id,
        name_user: safeUser.userName,
        phone_user: safeUser.phone,
        money_user: safeUser.balance,
      },
      totalRecharge: totalRecharge,
      totalWithdraw: totalWithdraw,
      freeBonus: safeUser.freeBonus,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("userInfoController error:", error);
    res.status(500).json({
      message: "Failed to get user info",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
