import { Request, Response } from "express";
import { helperFormatTime, helperGetCurrentTimestamp } from "../helpers/common.helpers";
import { paymentQueryFindLevel, paymentQueryFindUsersByInvite } from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse } from "../types/user.types";

export const promotionController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const auth = req.cookies.auth;

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

    const [levels, f1s] = await Promise.all([
      paymentQueryFindLevel(),
      paymentQueryFindUsersByInvite(user.referralCode),
    ]);

    // Calculate today's referrals
    let f1_today = 0;
    let f_all_today = 0;
    const today = helperFormatTime();

    for (const f1 of f1s) {
      if (helperFormatTime(f1.time) === today) {
        f1_today++;
        f_all_today++;
      }

      // F2
      const f2s = await paymentQueryFindUsersByInvite(f1.code);
      for (const f2 of f2s) {
        if (helperFormatTime(f2.time) === today) f_all_today++;

        // F3
        const f3s = await paymentQueryFindUsersByInvite(f2.code);
        for (const f3 of f3s) {
          if (helperFormatTime(f3.time) === today) f_all_today++;

          // F4
          const f4s = await paymentQueryFindUsersByInvite(f3.code);
          for (const f4 of f4s) {
            if (helperFormatTime(f4.time) === today) f_all_today++;
          }
        }
      }
    }

    // Calculate total F2, F3, F4
    let f2_total = 0,
      f3_total = 0,
      f4_total = 0;

    for (const f1 of f1s) {
      const f2s = await paymentQueryFindUsersByInvite(f1.code);
      f2_total += f2s.length;

      for (const f2 of f2s) {
        const f3s = await paymentQueryFindUsersByInvite(f2.code);
        f3_total += f3s.length;

        for (const f3 of f3s) {
          const f4s = await paymentQueryFindUsersByInvite(f3.code);
          f4_total += f4s.length;
        }
      }
    }

    const rosesF1 = user.commissionF1;
    const rosesAll = user.commissionF2 + user.commissionF3 + user.commissionF4;
    const rosesAdd = rosesF1 + rosesAll;

    res.status(200).json({
      message: "Receive success",
      level: levels,
      info: [{ phone: user.phone, code: user.referralCode, invite: user.invitedBy }],
      status: true,
      invite: {
        f1: f1s.length,
        total_f: f1s.length + f2_total + f3_total + f4_total,
        f1_today: f1_today,
        f_all_today: f_all_today,
        roses_f1: user.commissionF1,
        roses_f: user.commissionF2 + user.commissionF3 + user.commissionF4,
        roses_all: rosesAdd,
        roses_today: user.commissionToday,
      },
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("promotionController error:", error);
    res.status(500).json({
      message: "Failed to get promotion data",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
