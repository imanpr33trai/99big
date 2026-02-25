import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import {
  paymentQueryCreateUserBank,
  paymentQueryFindUserBankByPhone,
  paymentQueryFindUserBankBySTK,
  paymentQueryUpdateUserBank,
  paymentQueryUpdateUserBankSTK,
} from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse, UserBankInput } from "../types/user.types";

export const addBankController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const time = Date.now();
  const auth = req.cookies.auth;
  const { name_bank, name_user, stk, email, tinh } = (req as any).validatedData as UserBankInput;

  try {
    if (!auth || !name_bank || !name_user || !stk || !email || !tinh) {
      res.status(200).json({
        message: "Failed",
        status: false,
        timeStamp: time,
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

    const [existingBySTK, existingByPhone] = await Promise.all([
      paymentQueryFindUserBankBySTK(stk),
      paymentQueryFindUserBankByPhone(user.phone),
    ]);

    if (existingBySTK.length === 0 && existingByPhone.length === 0) {
      await paymentQueryCreateUserBank({
        phone: user.phone,
        name_bank,
        name_user,
        stk,
        email,
        tinh,
        time,
      });

      res.status(200).json({
        message: "Successfully added bank",
        status: true,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    } else if (existingBySTK.length > 0) {
      await paymentQueryUpdateUserBankSTK(stk, user.phone);

      res.status(200).json({
        message: "Account number updated in the system",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    } else if (existingByPhone.length > 0) {
      await paymentQueryUpdateUserBank({
        phone: user.phone,
        name_bank,
        name_user,
        stk,
        email,
        tinh,
        time,
      });

      res.status(200).json({
        message: "your account is updated",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }
  } catch (error) {
    console.error("addBankController error:", error);
    res.status(500).json({
      message: "Failed to add bank",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
