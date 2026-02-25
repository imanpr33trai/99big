import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import {
  paymentQueryFindBankRecharge,
  paymentQueryFindRechargeByPhoneAndStatus,
} from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse } from "../types/user.types";

export const recharge2Controller = async (req: Request, res: Response): Promise<void> => {
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

    const [recharge, bank_recharge] = await Promise.all([
      paymentQueryFindRechargeByPhoneAndStatus(user.phone, 0),
      paymentQueryFindBankRecharge(),
    ]);

    if (recharge.length !== 0) {
      res.status(200).json({
        message: "Received successfully",
        datas: recharge[0],
        infoBank: bank_recharge,
        status: true,
        timeStamp: timeNow,
      } as UserApiResponse);
    } else {
      res.status(200).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
    }
  } catch (error) {
    console.error("recharge2Controller error:", error);
    res.status(500).json({
      message: "Failed to get recharge info",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
