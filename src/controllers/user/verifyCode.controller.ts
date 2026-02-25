import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import { userQueryFindByToken, userQueryUpdateOTP } from "../queries/user.queries";
import { smsServiceGenerateAndSendOTP } from "../services/sms.service";
import { UserApiResponse } from "../types/user.types";

export const verifyCodeController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;

  try {
    if (!auth) {
      const response: UserApiResponse = {
        message: "Authentication required",
        status: false,
        timeStamp: timeNow,
      };
      res.status(401).json(response);
      return;
    }

    const user = await userQueryFindByToken(auth);
    if (!user) {
      const response: UserApiResponse = {
        message: "Account does not exist",
        status: false,
        timeStamp: timeNow,
      };
      res.status(200).json(response);
      return;
    }

    const now = Date.now();
    const otpExpiresAt = Number(user.otpExpiresAt);

    if (otpExpiresAt - now > 0) {
      const response: UserApiResponse = {
        message: "Send SMS regularly.",
        status: false,
        timeStamp: timeNow,
      };
      res.status(200).json(response);
      return;
    }

    const { otp, timeEnd } = await smsServiceGenerateAndSendOTP(user.phone);
    await userQueryUpdateOTP(user.phone, otp, timeEnd);

    const response: UserApiResponse = {
      message: "Submitted successfully",
      status: true,
      timeStamp: timeNow,
      timeEnd: timeEnd,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("verifyCodeController error:", error);
    const response: UserApiResponse = {
      message: "Failed to send verification code",
      status: false,
      timeStamp: timeNow,
    };
    res.status(500).json(response);
  }
};
