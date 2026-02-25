import axios from "axios";
import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import {
  cancelRechargeById,
  createRecharge,
  getCurrentTimeForTodayField,
  getDMYDateOfTodayField,
  getRechargeByOrderId,
  getRechargeOrderId,
  getRechargesByPhoneAndStatus,
  setRechargeStatusSuccess,
} from "../../db/payment.queries";
import {
  addUserAccountBalance,
  getUserDataByAuthToken,
} from "../../services/paymentHelpers.service";
import { PaymentMethodsMap } from "../../types/payment.types";

export const initiateUPIPaymentHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    const type = PaymentMethodsMap.UPI_GATEWAY;
    const auth = req.cookies?.auth;
    const money = parseInt(req.body.money);
    const timeNow = new Date().toISOString();
    const minimumMoneyAllowed = parseInt(process.env.MINIMUM_MONEY || "100");

    if (!money || money < minimumMoneyAllowed) {
      res.status(400).json({
        message: `Money is required and it should be ₹${minimumMoneyAllowed} or above!`,
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
        0, // PENDING
        PaymentMethodsMap.UPI_GATEWAY,
      );

      if (pendingRecharges.length !== 0) {
        await Promise.all(pendingRecharges.map((r) => cancelRechargeById(db, r.id!)));
      }

      const orderId = getRechargeOrderId();

      const ekqrResponse = await axios.post("https://api.ekqr.in/api/create_order", {
        key: process.env.UPI_GATEWAY_PAYMENT_KEY,
        client_txn_id: orderId,
        amount: String(money),
        p_info: process.env.PAYMENT_INFO,
        customer_name: user.username,
        customer_email: process.env.PAYMENT_EMAIL,
        customer_mobile: user.phone,
        redirect_url: `${process.env.APP_BASE_URL}/wallet/verify/upi`,
      });

      const ekqrData = ekqrResponse?.data;

      if (!ekqrData?.status) {
        console.error("Gateway error from ekqr!", ekqrResponse?.data);
        if (ekqrData?.msg === "Plan Expired. Please Renew Plan") {
          res.status(400).json({
            message: "Payment gateway plan has expired. Please contact support to renew the plan.",
            status: false,
            timeStamp: timeNow,
          });
          return;
        }
        throw new Error("Gateway error from ekqr!");
      }

      const newRecharge = await createRecharge(db, {
        orderId,
        transactionId: null,
        utr: null,
        phone: user.phone,
        money,
        type,
        status: 0,
        today: getCurrentTimeForTodayField(),
        url: ekqrData.data.payment_url,
        time: timeNow,
      });

      res.status(200).json({
        message: "Payment initiated successfully",
        recharge: newRecharge,
        urls: {
          web_url: ekqrData.data.payment_url,
          bhim_link: ekqrData.data?.upi_intent?.bhim_link || "",
          phonepe_link: ekqrData.data?.upi_intent?.phonepe_link || "",
          paytm_link: ekqrData.data?.upi_intent?.paytm_link || "",
          gpay_link: ekqrData.data?.upi_intent?.gpay_link || "",
        },
        status: true,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.error("Error executing payment initiation:", error);
      res.status(500).json({
        status: false,
        message: "Something went wrong!",
        timestamp: timeNow,
        error,
      });
    }
  };

export const verifyUPIPaymentHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    const auth = req.cookies?.auth;
    const orderId = req.query.client_txn_id as string;
    const timeNow = new Date().toISOString();

    if (!auth || !orderId) {
      res.status(400).json({
        message: "orderId is Required!",
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    try {
      const user = await getUserDataByAuthToken(db, auth);
      const recharge = await getRechargeByOrderId(db, orderId);

      if (!recharge) {
        res.status(400).json({
          message: "Unable to find recharge with this order id!",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const ekqrResponse = await axios.post("https://api.ekqr.in/api/check_order_status", {
        key: process.env.UPI_GATEWAY_PAYMENT_KEY,
        client_txn_id: orderId,
        txn_date: getDMYDateOfTodayField(recharge.today),
      });

      const ekqrData = ekqrResponse?.data;
      console.log("ekqrData: ", ekqrData);

      if (!ekqrData?.status) {
        throw new Error("Gateway error from ekqr!");
      }

      if (ekqrData.data.status === "created") {
        res.status(200).json({
          message: "Your payment request is just created",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      if (ekqrData.data.status === "scanning") {
        res.status(200).json({
          message: "Waiting for confirmation",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      if (ekqrData.data.status === "success") {
        if (recharge.status === 0 || recharge.status === 2) {
          await setRechargeStatusSuccess(db, recharge.id!, orderId);
          await addUserAccountBalance(db, { phone: user.phone, money: recharge.money });
        }
        return res.redirect("/wallet/rechargerecord");
      }

      res.status(400).json({
        message: "Unknown payment status",
        status: false,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Something went wrong!",
        timestamp: timeNow,
        error,
      });
    }
  };
