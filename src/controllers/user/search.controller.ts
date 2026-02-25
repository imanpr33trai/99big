import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import { userQueryFindByPhone, userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse, UserSearchInput } from "../types/user.types";

export const searchController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;
  const { phone } = (req as any).validatedData as UserSearchInput;

  try {
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

    // Note: userLevel 1 = admin, 2 = ctv in old system
    if (user.userLevel === 1) {
      const users = await userQueryFindByPhone(phone);
      res.status(200).json({
        message: "Receive success",
        datas: users ? [users] : [],
        status: true,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    } else if (user.userLevel === 2) {
      const targetUser = await userQueryFindByPhone(phone);
      if (!targetUser) {
        res.status(200).json({
          message: "Receive success",
          datas: [],
          status: true,
          timeStamp: timeNow,
        } as UserApiResponse);
        return;
      }

      // Check if target user is under this CTV
      // This logic might need adjustment based on actual CTV tracking
      res.status(200).json({
        message: "Receive success",
        datas: [targetUser],
        status: true,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    } else {
      res.status(200).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
    }
  } catch (error) {
    console.error("searchController error:", error);
    res.status(500).json({
      message: "Failed to search user",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
