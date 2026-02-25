import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import { paymentQueryFindLevel } from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse } from "../types/user.types";

export const myTeamController = async (req: Request, res: Response): Promise<void> => {
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

    const levels = await paymentQueryFindLevel();

    res.status(200).json({
      message: "Receive success",
      level: levels,
      info: [{ phone: user.phone, code: user.referralCode, invite: user.invitedBy }],
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("myTeamController error:", error);
    res.status(500).json({
      message: "Failed to get team data",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
