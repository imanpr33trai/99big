import axios from "axios";
import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import {
  paymentQueryFindRechargeByPhoneAndStatus,
  paymentQueryUpdateRechargeStatus,
} from "../queries/payment.queries";
import { userQueryFindByToken, userQueryUpdateBalance } from "../queries/user.queries";
import { UserApiResponse, UserConfirmRechargeInput } from "../types/user.types";

export const confirmRechargeController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;
  const { client_txn_id } = (req as any).validatedData as UserConfirmRechargeInput;

  try {
    if (!client_txn_id) {
      res.status(200).json({
        message: "client_txn_id is required",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

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

    const recharge = await paymentQueryFindRechargeByPhoneAndStatus(user.phone, 0);

    if (recharge.length === 0) {
      res.status(200).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const rechargeData = recharge[0];
    const date = new Date(rechargeData.today);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

    const apiData = {
      key: process.env.PAYMENT_KEY,
      client_txn_id: client_txn_id,
      txn_date: formattedDate,
    };

    const apiResponse = await axios.post("https://api.ekqr.in/api/check_order_status", apiData);
    const apiRecord = apiResponse.data.data;

    if (apiRecord.status === "scanning") {
      res.status(200).json({
        message: "Waiting for confirmation",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    if (apiRecord.status === "success") {
      await paymentQueryUpdateRechargeStatus(rechargeData.id_order, 1);
      await userQueryUpdateBalance(apiRecord.customer_mobile, apiRecord.amount);

      res.status(200).json({
        message: "Successful application confirmation",
        status: true,
        datas: recharge,
      } as UserApiResponse);
      return;
    } else if (apiRecord.status === "failure" || apiRecord.status === "close") {
      await paymentQueryUpdateRechargeStatus(rechargeData.id_order, 2);

      res.status(200).json({
        message: "Payment failure",
        status: true,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    res.status(200).json({
      message: "Mismatch data",
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("confirmRechargeController error:", error);
    res.status(500).json({
      message: "Failed to confirm recharge",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
