import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import {
  paymentQueryCreateRedEnvelopeUsed,
  paymentQueryFindRedEnvelopeById,
  paymentQueryUpdateRedEnvelopeStatus,
} from "../queries/payment.queries";
import { userQueryFindByToken, userQueryUpdateBalance } from "../queries/user.queries";
import { UserApiResponse, UserRedEnvelopeInput } from "../types/user.types";

export const useRedEnvelopeController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;
  const { code } = (req as any).validatedData as UserRedEnvelopeInput;

  try {
    if (!auth || !code) {
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

    const redEnvelope = await paymentQueryFindRedEnvelopeById(code);

    if (!redEnvelope) {
      res.status(200).json({
        message: "Redemption code error",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    if (redEnvelope.status !== 0) {
      res.status(200).json({
        message: "Gift code already used",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    await paymentQueryUpdateRedEnvelopeStatus(code);
    await userQueryUpdateBalance(user.phone, redEnvelope.money);
    await paymentQueryCreateRedEnvelopeUsed({
      phone: redEnvelope.phone,
      phone_used: user.phone,
      id_redenvelops: code,
      money: redEnvelope.money,
      time: timeNow,
    });

    res.status(200).json({
      message: `Received successfully +${redEnvelope.money}`,
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("useRedEnvelopeController error:", error);
    res.status(500).json({
      message: "Failed to use red envelope",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
