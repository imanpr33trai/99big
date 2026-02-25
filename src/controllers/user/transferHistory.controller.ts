import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import {
  paymentQueryFindBalanceTransferByReceiver,
  paymentQueryFindBalanceTransferBySender,
} from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse } from "../types/user.types";

export const transferHistoryController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;

  try {
    const user = await userQueryFindByToken(auth);
    if (!user) {
      res.status(200).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const [history, receive] = await Promise.all([
      paymentQueryFindBalanceTransferBySender(user.phone),
      paymentQueryFindBalanceTransferByReceiver(user.phone),
    ]);

    res.status(200).json({
      message: "Success",
      receive: receive,
      datas: history,
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("transferHistoryController error:", error);
    res.status(500).json({
      message: "Failed to get transfer history",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
