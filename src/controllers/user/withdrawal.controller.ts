import { Request, Response } from "express";
import {
  helperFormatTime,
  helperGenerateOrderId,
  helperGetCurrentTimestamp,
} from "../helpers/common.helpers";
import { cryptoHashMD5 } from "../helpers/crypto.helpers";
import {
  paymentQueryCreateWithdraw,
  paymentQueryFindMinutes1ByPhone,
  paymentQueryFindRechargeByPhoneAndStatus,
  paymentQueryFindUserBankByPhone,
  paymentQueryFindWithdrawByPhoneAndStatus,
  paymentQueryFindWithdrawByPhoneAndToday,
} from "../queries/payment.queries";
import { userQueryDeductBalance, userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse, UserWithdrawInput } from "../types/user.types";

export const withdrawalController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;
  const { money, password } = (req as any).validatedData as UserWithdrawInput;

  try {
    if (!auth || !money || !password || money < 299) {
      res.status(200).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const user = await userQueryFindByToken(auth);
    if (!user || user.passwordHash !== cryptoHashMD5(password)) {
      res.status(200).json({
        message: "incorrect password",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const dates = Date.now();
    const checkTime = helperFormatTime(dates);
    const id_order = helperGenerateOrderId();

    const [withdraw_set, recharge, minutes_1, user_bank, withdraw] = await Promise.all([
      paymentQueryFindWithdrawByPhoneAndStatus(user.phone, 1),
      paymentQueryFindRechargeByPhoneAndStatus(user.phone, 1),
      paymentQueryFindMinutes1ByPhone(user.phone),
      paymentQueryFindUserBankByPhone(user.phone),
      paymentQueryFindWithdrawByPhoneAndToday(user.phone, checkTime),
    ]);

    let total = withdraw_set.reduce((sum, w) => sum + parseFloat(String(w.money)), 0);
    let total2 = minutes_1.reduce((sum, m) => sum + parseFloat(String(m.get)), 0);
    let result = total2 - total - money;

    if (user_bank.length === 0) {
      res.status(200).json({
        message: "Please link your bank first",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    if (withdraw.length >= 3) {
      res.status(200).json({
        message: "You can only make 3 withdrawals per day",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    if (user.balance < money) {
      res.status(200).json({
        message: "The balance is not enough to fulfill the request",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    if (result < 0) {
      res.status(200).json({
        message: "The total bet is not enough to fulfill the request",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const infoBank = user_bank[0];

    await paymentQueryCreateWithdraw({
      id_order: id_order,
      phone: user.phone,
      money: money,
      stk: infoBank.stk,
      name_bank: infoBank.name_bank,
      ifsc: infoBank.email,
      name_user: infoBank.name_user,
      status: 0,
      today: checkTime,
      time: dates,
    });

    await userQueryDeductBalance(user.phone, money);

    res.status(200).json({
      message: "Withdrawal successful",
      status: true,
      money: user.balance - money,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("withdrawalController error:", error);
    res.status(500).json({
      message: "Failed to process withdrawal",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
