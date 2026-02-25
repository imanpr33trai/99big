import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import { paymentQueryFindWithdrawByPhoneAndStatus } from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse } from "../types/user.types";

export const listWithdrawController = async (req: Request, res: Response): Promise<void> => {
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

    const withdraw = await paymentQueryFindWithdrawByPhoneAndStatus(user.phone, 1);

    res.status(200).json({
      message: "Receive success",
      datas: withdraw,
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("listWithdrawController error:", error);
    res.status(500).json({
      message: "Failed to get withdraw list",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
