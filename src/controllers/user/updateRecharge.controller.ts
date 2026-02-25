import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import {
  paymentQueryFindRechargeByUTR,
  paymentQueryUpdateRechargeUTR,
} from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse, UserUpdateRechargeInput } from "../types/user.types";

export const updateRechargeController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;
  const { money, id_order, inputData } = (req as any).validatedData as UserUpdateRechargeInput;

  try {
    const user = await userQueryFindByToken(auth);
    if (!user) {
      res.status(200).json({
        message: "user not found",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const existingUTR = await paymentQueryFindRechargeByUTR(inputData);

    if (existingUTR) {
      res.status(200).json({
        message: "UTR is already in use",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    await paymentQueryUpdateRechargeUTR(user.phone, id_order, inputData);

    res.status(200).json({
      message: "UTR updated",
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("updateRechargeController error:", error);
    res.status(500).json({
      message: "Failed to update recharge",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
