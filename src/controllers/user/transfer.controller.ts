import { Request, Response } from "express";
import {
  helperFormatTime,
  helperGenerateOrderId,
  helperGetCurrentTimestamp,
} from "../helpers/common.helpers";
import {
  paymentQueryCreateBalanceTransfer,
  paymentQueryCreateRecharge,
} from "../queries/payment.queries";
import { userQueryFindByPhone, userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse, UserTransferInput } from "../types/user.types";

export const transferController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;
  const { amount, phone: receiver_phone } = (req as any).validatedData as UserTransferInput;

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

    const sender_phone = user.phone;
    const sender_money = user.balance;

    if (sender_money < amount) {
      res.status(200).json({
        message: "Your balance is not enough",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const receiver = await userQueryFindByPhone(receiver_phone);
    if (!receiver || sender_phone === receiver_phone) {
      res.status(200).json({
        message: `${receiver_phone} is not a valid user mobile number`,
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const dates = Date.now();
    const checkTime = helperFormatTime(dates);
    const client_transaction_id = helperGenerateOrderId();

    await paymentQueryCreateBalanceTransfer({
      sender_phone,
      receiver_phone,
      amount,
      time: dates,
    });

    await paymentQueryCreateRecharge({
      id_order: client_transaction_id,
      transaction_id: "0",
      phone: receiver_phone,
      money: amount,
      type: "wallet",
      status: 0,
      today: checkTime,
      url: "0",
      time: dates,
    });

    res.status(200).json({
      message: `Requested ${amount} sent successfully`,
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("transferController error:", error);
    res.status(500).json({
      message: "Failed to process transfer",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
