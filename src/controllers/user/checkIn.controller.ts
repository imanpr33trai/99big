import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import {
  paymentQueryFindPointByPhone,
  paymentQueryUpdatePointTotal,
} from "../queries/payment.queries";
import { userQueryFindByToken, userQueryUpdateBalance } from "../queries/user.queries";
import { UserApiResponse, UserCheckInInput } from "../types/user.types";

const CHECK_IN_REWARDS: Record<number, { required: number; field: string }> = {
  1: { required: 300, field: "total1" },
  2: { required: 3000, field: "total2" },
  3: { required: 6000, field: "total3" },
  4: { required: 12000, field: "total4" },
  5: { required: 28000, field: "total5" },
  6: { required: 100000, field: "total6" },
  7: { required: 200000, field: "total7" },
};

export const checkInController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;
  const { data } = (req as any).validatedData as UserCheckInInput;

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

    const pointList = await paymentQueryFindPointByPhone(user.phone);

    if (!data) {
      res.status(200).json({
        message: "No More Data",
        datas: pointList,
        status: true,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const reward = CHECK_IN_REWARDS[data];
    if (!reward) {
      res.status(200).json({
        message: "Invalid check-in level",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    const currentBalance = user.balance;
    const pointField = reward.field as keyof typeof pointList;
    const rewardAmount = pointList ? (pointList[pointField] as number) : 0;

    if (rewardAmount === 0) {
      res.status(200).json({
        message: "You have already received this gift",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    if (currentBalance < reward.required) {
      res.status(200).json({
        message: `Please Recharge ₹ ${reward.required} to claim gift.`,
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    await userQueryUpdateBalance(user.phone, rewardAmount);
    await paymentQueryUpdatePointTotal(user.phone, reward.field, 0);

    res.status(200).json({
      message: `You just received ₹ ${rewardAmount}.00`,
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("checkInController error:", error);
    res.status(500).json({
      message: "Failed to process check-in",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
