import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import { userQueryFindByToken, userQueryUpdateName } from "../queries/user.queries";
import { UserApiResponse, UserChangeInfoInput } from "../types/user.types";

export const changeUserController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;
  const { name, type } = (req as any).validatedData as UserChangeInfoInput;

  try {
    if (!auth || !type || !name) {
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

    if (type === "editname") {
      await userQueryUpdateName(name, auth);
      res.status(200).json({
        message: "Username modification successful",
        status: true,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("changeUserController error:", error);
    res.status(500).json({
      message: "Failed to update user",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
