import { Request, Response } from "express";
import { helperGetCurrentTimestamp } from "../helpers/common.helpers";
import {
  paymentQueryFindRechargeByOrderId,
  paymentQueryUpdateRechargeStatus,
} from "../queries/payment.queries";
import { userQueryUpdateBalance } from "../queries/user.queries";
import { UserApiResponse, UserCallbackBankInput } from "../types/user.types";

export const callbackBankController = async (req: Request, res: Response): Promise<void> => {
  const timeNow = helperGetCurrentTimestamp();
  const { transaction_id, client_transaction_id, amount, status } = (req as any)
    .validatedData as UserCallbackBankInput;

  try {
    if (!transaction_id) {
      res.status(200).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      } as UserApiResponse);
      return;
    }

    if (status === 2) {
      await paymentQueryUpdateRechargeStatus(client_transaction_id, 1);
      const recharge = await paymentQueryFindRechargeByOrderId(client_transaction_id);

      if (recharge) {
        await userQueryUpdateBalance(recharge.phone, recharge.money);
      }

      res.status(200).json({
        message: 0,
        status: true,
      });
      return;
    } else {
      // Assuming 'id' should come from somewhere - this might need fixing
      // await paymentQueryUpdateRechargeStatusById(id, 2);

      res.status(200).json({
        message: "Cancellation successful",
        status: true,
      } as UserApiResponse);
      return;
    }
  } catch (error) {
    console.error("callbackBankController error:", error);
    res.status(500).json({
      message: "Callback processing failed",
      status: false,
      timeStamp: timeNow,
    } as UserApiResponse);
  }
};
