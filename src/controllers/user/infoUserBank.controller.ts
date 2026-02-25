import { Request, Response } from "express";
import { helperFormatTime, helperGetCurrentTimestamp } from "../helpers/common.helpers";
import {
  paymentQueryFindMinutes1ByPhone,
  paymentQueryFindRechargeByPhoneAndStatus,
  paymentQueryFindUserBankByPhone,
} from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse } from "../types/user.types";

export const infoUserBankController = async (req: Request, res: Response): Promise<void> => {
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

    const date = Date.now();
    const checkTime = helperFormatTime(date);

    const [recharges, minutes1, userBank] = await Promise.all([
      paymentQueryFindRechargeByPhoneAndStatus(user.phone, 1),
      paymentQueryFindMinutes1ByPhone(user.phone),
      paymentQueryFindUserBankByPhone(user.phone),
    ]);

    let total = recharges.reduce((sum, r) => sum + parseFloat(String(r.money)), 0);
    let total2 = minutes1.reduce((sum, m) => sum + parseFloat(String(m.money)), 0);
    let fee = minutes1.reduce((sum, m) => sum + parseFloat(String(m.fee)), 0);

    let result = Math.max(total - total2 - fee, 0);

    res.status(200).json({
      message: "Received successfully",
      datas: userBank,
      userInfo: [
        { phone: user.phone, code: user.referralCode, invite: user.invitedBy, money: user.balance },
      ],
      result: result,
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("infoUserBankController error:", error);
    res.status(500).json({
      message: "Failed to get bank info",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
