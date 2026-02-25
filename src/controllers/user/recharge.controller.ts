import axios from "axios";
import { Request, Response } from "express";
import {
  helperFormatTime,
  helperGenerateOrderId,
  helperGetCurrentTimestamp,
} from "../helpers/common.helpers";
import {
  paymentQueryCreateRecharge,
  paymentQueryFindRechargeByPhoneAndStatus,
  paymentQueryUpdateRechargeStatus,
} from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse, UserRechargeInput } from "../types/user.types";

const MINIMUM_MONEY = parseInt(process.env.MINIMUM_MONEY || "300");

export const rechargeController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;
  const { money, type, typeid } = (req as any).validatedData as UserRechargeInput;

  try {
    if (type !== "cancel") {
      if (!auth || !money || money < MINIMUM_MONEY - 1) {
        res.status(200).json({
          message: "Failed",
          status: false,
          timeStamp: timeNow,
        } as UserApiResponse);
        return;
      }
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

    if (type === "cancel") {
      await paymentQueryUpdateRechargeStatus(typeid || "", 2);
      res.status(200).json({
        message: "Cancelled order successfully",
        status: true,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const pendingRecharge = await paymentQueryFindRechargeByPhoneAndStatus(user.phone, 0);

    if (pendingRecharge.length === 0) {
      const time = Date.now();
      const checkTime = helperFormatTime(time);
      const client_transaction_id = helperGenerateOrderId();

      if (type === "momo") {
        await paymentQueryCreateRecharge({
          id_order: client_transaction_id,
          transaction_id: "NULL",
          phone: user.phone,
          money: money,
          type: type,
          status: 0,
          today: checkTime,
          url: "NULL",
          time: time,
        });

        const [newRecharge] = await paymentQueryFindRechargeByPhoneAndStatus(user.phone, 0);

        res.status(200).json({
          message: "Received successfully",
          datas: newRecharge,
          status: true,
          timeStamp: timeNow,
        } as UserApiResponse);
        return;
      }

      const apiData = {
        key: process.env.PAYMENT_KEY,
        client_txn_id: client_transaction_id,
        amount: String(money),
        p_info: process.env.PAYMENT_INFO,
        customer_name: user.userName,
        customer_email: process.env.PAYMENT_EMAIL,
        customer_mobile: user.phone,
        redirect_url: `${process.env.APP_BASE_URL}/wallet/rechargerecord`,
        udf1: process.env.APP_NAME,
      };

      try {
        const apiResponse = await axios.post("https://api.ekqr.in/api/create_order", apiData);

        if (apiResponse.data.status === true) {
          await paymentQueryCreateRecharge({
            id_order: client_transaction_id,
            transaction_id: "0",
            phone: user.phone,
            money: money,
            type: type,
            status: 0,
            today: checkTime,
            url: "0",
            time: timeNow,
          });

          const [newRecharge] = await paymentQueryFindRechargeByPhoneAndStatus(user.phone, 0);

          res.status(200).json({
            message: "Received successfully",
            datas: newRecharge,
            payment_url: apiResponse.data.data.payment_url,
            status: true,
            timeStamp: timeNow,
          } as UserApiResponse);
          return;
        } else {
          res.status(500).json({
            message: "Failed to create order",
            status: false,
          });
          return;
        }
      } catch (error) {
        res.status(500).json({
          message: "API request failed",
          status: false,
        });
        return;
      }
    } else {
      res.status(200).json({
        message: "Received successfully",
        datas: pendingRecharge[0],
        status: true,
        timeStamp: timeNow,
      } as UserApiResponse);
    }
  } catch (error) {
    console.error("rechargeController error:", error);
    res.status(500).json({
      message: "Failed to process recharge",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
