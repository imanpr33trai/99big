import { Request, Response } from "express";
import { helperFormatTime, helperGetCurrentTimestamp } from "../helpers/common.helpers";
import {
  paymentQueryFindRosesByInvite,
  paymentQueryFindTurnoverByPhone,
  paymentQueryFindUsersByInviteWithDetails,
} from "../queries/payment.queries";
import { userQueryFindByToken } from "../queries/user.queries";
import { UserApiResponse } from "../types/user.types";

export const listMyTeamController = async (req: Request, res: Response): Promise<void> => {
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

    const f1s = await paymentQueryFindUsersByInviteWithDetails(user.referralCode);
    const selectedData: any[] = [];

    async function fetchInvitesByCode(code: string, depth = 1) {
      if (depth > 6) return;

      const invites = await paymentQueryFindUsersByInviteWithDetails(code);
      for (const invite of invites) {
        const turnover = await paymentQueryFindTurnoverByPhone(invite.phone);
        const inviteCount = (await paymentQueryFindUsersByInviteWithDetails(invite.code)).length;

        selectedData.push({
          ...invite,
          user_level: depth,
          invite_count: inviteCount,
          daily_turn_over: turnover?.daily_turn_over || 0,
          total_turn_over: turnover?.total_turn_over || 0,
        });

        await fetchInvitesByCode(invite.code, depth + 1);
      }
    }

    for (const f1 of f1s) {
      const turnover = await paymentQueryFindTurnoverByPhone(f1.phone);
      const inviteCount = (await paymentQueryFindUsersByInviteWithDetails(f1.code)).length;

      selectedData.push({
        ...f1,
        user_level: 1,
        invite_count: inviteCount,
        daily_turn_over: turnover?.daily_turn_over || 0,
        total_turn_over: turnover?.total_turn_over || 0,
      });
      await fetchInvitesByCode(f1.code, 2);
    }

    const newMem = f1s.slice(0, 100).map((data) => ({
      id_user: data.id_user,
      phone: `91${data.phone.slice(0, 1)}****${data.phone.slice(-4)}`,
      time: helperFormatTime(data.time),
    }));

    const total_roses = await paymentQueryFindRosesByInvite(user.referralCode);

    res.status(200).json({
      message: "Receive success",
      f1: selectedData,
      f1_direct: f1s,
      mem: newMem,
      total_roses: total_roses,
      status: true,
      timeStamp: timeNow,
    } as UserApiResponse);
  } catch (error) {
    console.error("listMyTeamController error:", error);
    res.status(500).json({
      message: "Failed to get team list",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
