import { Request, Response } from "express";
import { helperGenerateRandomNumber, helperGetCurrentTimestamp } from "../helpers/common.helpers";
import { cryptoHashMD5 } from "../helpers/crypto.helpers";
import { userQueryFindByToken, userQueryUpdatePassword } from "../queries/user.queries";
import { UserApiResponse, UserChangePasswordInput } from "../types/user.types";

export const changePasswordController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;
  const { password, newPassWord } = (req as any).validatedData as UserChangePasswordInput;

  try {
    if (!password || !newPassWord) {
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
        message: "Incorrect password",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const newPasswordHash = cryptoHashMD5(newPassWord);
    const randomOTP = helperGenerateRandomNumber(100000, 999999);

    await userQueryUpdatePassword(newPasswordHash, newPassWord, auth);

    res.status(200).json({
      message: "Password modification successful",
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("changePasswordController error:", error);
    res.status(500).json({
      message: "Failed to change password",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
