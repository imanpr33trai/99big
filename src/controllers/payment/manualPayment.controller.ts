import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import {
  cancelRechargeById,
  createRecharge,
  getCurrentTimeForTodayField,
  getRechargesByPhoneAndStatus,
} from "../../db/payment.queries";
import { getRechargeOrderId, getUserDataByAuthToken } from "../../services/paymentHelpers.service";
import { generateUPIQRCode } from "../../services/upiQr.service";
import { PaymentMethodsMap } from "../../types/payment.types";

export const initiateManualUPIPaymentHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    const [bankRows] = await db.execute("SELECT * FROM paymentMethods WHERE type = 'upi'");
    const bankData = (bankRows as any[])[0] || {};

    const momo = {
      bankName: bankData.bankName || "",
      username: bankData.accountName || "",
      upiId: bankData.upiId || "",
      walletAddress: bankData.qrCodeUrl || "",
    };

    const amount = req.query.am as string;
    const qrCodeUrl = await generateUPIQRCode(momo.upiId, parseFloat(amount));

    res.render("wallet/manual_payment.ejs", {
      Amount: amount,
      UpiId: momo.upiId,
      QRCodeUrl: qrCodeUrl,
    });
  };

export const initiateManualUSDTPaymentHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    const [bankRows] = await db.execute("SELECT * FROM paymentMethods WHERE type = 'crypto'");
    const bankData = (bankRows as any[])[0] || {};

    const momo = {
      bankName: bankData.bankName || "",
      username: bankData.accountName || "",
      upiId: bankData.upiId || "",
      walletAddress: bankData.cryptoAddress || "",
    };

    res.render("wallet/usdt_manual_payment.ejs", {
      Amount: req.query.am,
      UsdtWalletAddress: momo.walletAddress,
    });
  };

export const addManualUPIPaymentRequestHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const auth = req.cookies?.auth;
      const money = parseInt(data.money);
      const utr = parseInt(data.utr);
      const minimumMoneyAllowed = parseInt(process.env.MINIMUM_MONEY || "100");
      const timeNow = new Date().toISOString();

      if (!money || money < minimumMoneyAllowed) {
        res.status(400).json({
          message: `Money is Required and it should be ₹${minimumMoneyAllowed} or above!`,
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      if (!utr || String(utr).length !== 12) {
        res.status(400).json({
          message: "UPI Ref No. or UTR is Required And it should be 12 digit long",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

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

      const recharge = await createRecharge(db, {
        orderId,
        transactionId: "NULL",
        utr: String(utr),
        phone: user.phone,
        money,
        type: PaymentMethodsMap.UPI_MANUAL,
        status: 0,
        today: getCurrentTimeForTodayField(),
        url: "NULL",
        time: timeNow,
      });

      res.status(200).json({
        message: "Payment Requested successfully Your Balance will update shortly!",
        recharge,
        status: true,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Something went wrong!",
        timestamp: new Date().toISOString(),
      });
    }
  };

export const addManualUSDTPaymentRequestHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const auth = req.cookies?.auth;
      const moneyUsdt = parseInt(data.money);
      const money = moneyUsdt * 82;
      const utr = parseInt(data.utr);
      const minimumMoneyAllowed = parseInt(process.env.MINIMUM_MONEY || "100");
      const timeNow = new Date().toISOString();

      if (!money || money < minimumMoneyAllowed) {
        res.status(400).json({
          message: `Money is Required and it should be ₹${minimumMoneyAllowed} or ${(minimumMoneyAllowed / 82).toFixed(2)} or above!`,
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      if (!utr) {
        res.status(400).json({
          message: "Ref No. or UTR is Required",
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

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

      const recharge = await createRecharge(db, {
        orderId,
        transactionId: "NULL",
        utr: String(utr),
        phone: user.phone,
        money,
        type: PaymentMethodsMap.USDT_MANUAL,
        status: 0,
        today: getCurrentTimeForTodayField(),
        url: "NULL",
        time: timeNow,
      });

      res.status(200).json({
        message: "Payment Requested successfully Your Balance will update shortly!",
        recharge,
        status: true,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Something went wrong!",
        timestamp: new Date().toISOString(),
      });
    }
  };
