import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import { paymentQueryDeletePendingRecharge } from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse } from "../types/user.types";

export const cancelRechargeController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;

  try {
    if (!auth) {
      res.status(200).json({
        message: "Authorization is required to access this API!",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const user = await userQueryFindByToken(auth);
    if (!user) {
      res.status(200).json({
        message: "Authorization is required to access this API!",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    await paymentQueryDeletePendingRecharge(user.phone);

    res.status(200).json({
      message: "All the pending recharges has been deleted successfully!",
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("cancelRechargeController error:", error);
    res.status(500).json({
      message: "API Request failed!",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
