import axios from "axios";
import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import querystring from "querystring";
import {
  cancelRechargeById,
  createRecharge,
  getCurrentTimeForTodayField,
  getRechargeByOrderId,
  getRechargeOrderId,
  getRechargesByPhoneAndStatus,
} from "../../db/payment.queries";
import {
  addUserAccountBalance,
  getUserDataByAuthToken,
} from "../../services/paymentHelpers.service";
import {
  generateWowpaySign,
  getWowpayCurrentDate,
  validateWowpaySign,
} from "../../services/wowpay.service";
import { PaymentMethodsMap } from "../../types/payment.types";

export const initiateWowPayPaymentHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    const type = PaymentMethodsMap.WOW_PAY;
    const auth = req.cookies?.auth;
    const money = parseInt(req.query.money as string);
    const timeNow = new Date().toISOString();
    const minimumMoneyAllowed = parseInt(process.env.MINIMUM_MONEY || "100");

    if (!money || money < minimumMoneyAllowed) {
      res.status(400).json({
        message: `Money is Required and it should be ₹${minimumMoneyAllowed} or above!`,
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    try {
      const user = await getUserDataByAuthToken(db, auth);

      const pendingRecharges = await getRechargesByPhoneAndStatus(
        db,
        user.phone,
        0,
        PaymentMethodsMap.UPI_GATEWAY,
      );

      if (pendingRecharges.length !== 0) {
        await Promise.all(pendingRecharges.map((r) => cancelRechargeById(db, r.id!)));
      }

      const orderId = getRechargeOrderId();
      const date = getWowpayCurrentDate();

      const params: Record<string, any> = {
        version: "1.0",
        mch_id: process.env.WOWPAY_MERCHANT_ID,
        mch_order_no: orderId,
        pay_type: "151",
        trade_amount: money,
        order_date: date,
        goods_name: user.phone,
        notify_url: "https://999club.site/wallet/verify/wowpay",
        mch_return_msg: user.phone,
        page_url: "https://999club.site/wallet/verify/wowpay",
      };

      params.sign = generateWowpaySign(params, process.env.WOWPAY_MERCHANT_KEY || "");
      params.sign_type = "MD5";

      console.log(params);

      const response = await axios({
        method: "post",
        url: "https://pay6de1c7.wowpayglb.com/pay/web",
        data: querystring.stringify(params),
      });

      console.log(response.data);

      if (response.data.respCode === "SUCCESS" && response.data.payInfo) {
        res.status(200).json({
          message: "Payment requested Successfully",
          payment_url: response.data.payInfo,
          status: true,
          timeStamp: timeNow,
        });
        return;
      }

      res.status(400).json({
        message: "Payment request failed. Please try again Or Wrong Details.",
        status: false,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Something went wrong!",
        timestamp: timeNow,
      });
    }
  };

export const verifyWowPayPaymentHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    const timeNow = new Date().toISOString();

    try {
      const type = PaymentMethodsMap.WOW_PAY;
      const data = req.body || req.query;
      console.log(data);

      const merchantKey = process.env.WOWPAY_MERCHANT_KEY;

      const params = {
        mchId: process.env.WOWPAY_MERCHANT_ID || "",
        amount: data.amount || "",
        mchOrderNo: data.mchOrderNo || "",
        merRetMsg: data.merRetMsg || "",
        orderDate: data.orderDate || "",
        orderNo: data.orderNo || "",
        oriAmount: data.oriAmount || "",
        tradeResult: data.tradeResult || "",
        signType: data.signType || "",
        sign: data.sign || "",
      };

      let signStr = "";
      signStr += "amount=" + params.amount + "&";
      signStr += "mchId=" + params.mchId + "&";
      signStr += "mchOrderNo=" + params.mchOrderNo + "&";
      signStr += "merRetMsg=" + params.merRetMsg + "&";
      signStr += "orderDate=" + params.orderDate + "&";
      signStr += "orderNo=" + params.orderNo + "&";
      signStr += "oriAmount=" + params.oriAmount + "&";
      signStr += "tradeResult=" + params.tradeResult;

      const flag = validateWowpaySign(signStr, merchantKey || "", params.sign);

      if (!flag) {
        console.log({ status: false, message: "Something went wrong!", flag, timestamp: timeNow });
        res
          .status(400)
          .json({ status: false, message: "Something went wrong!", flag, timestamp: timeNow });
        return;
      }

      const newRechargeParams = {
        orderId: params.mchOrderNo,
        transactionId: "NULL",
        utr: null,
        phone: params.merRetMsg,
        money: parseFloat(params.amount),
        type,
        status: 1,
        today: getCurrentTimeForTodayField(),
        url: "NULL",
        time: timeNow,
      };

      const existingRecharge = await getRechargeByOrderId(db, newRechargeParams.orderId);

      if (existingRecharge) {
        console.log({ message: "Recharge already verified!", status: true, timeStamp: timeNow });
        res
          .status(400)
          .json({ message: "Recharge already verified!", status: true, timeStamp: timeNow });
        return;
      }

      const newRecharge = await createRecharge(db, newRechargeParams);

      await addUserAccountBalance(db, {
        phone: newRechargeParams.phone,
        money: newRecharge.money + (newRecharge.money / 100) * 5,
      });

      return res.redirect("/wallet/rechargerecord");
    } catch (error) {
      console.log({ status: false, message: "Something went wrong!", timestamp: timeNow });
      res.status(500).json({ status: false, message: "Something went wrong!", timestamp: timeNow });
    }
  };
