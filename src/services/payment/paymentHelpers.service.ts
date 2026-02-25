import moment from "moment";
import { Pool } from "mysql2/promise";

export const getRechargeOrderId = (): string => {
  const date = new Date();
  const idTime = date.getUTCFullYear() + "" + (date.getUTCMonth() + 1) + "" + date.getUTCDate();
  const idOrder =
    Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  return idTime + idOrder;
};

export const getUserDataByAuthToken = async (db: Pool, authToken: string) => {
  const [rows] = await db.execute(
    "SELECT phone, referralCode, userName, invitedBy FROM users WHERE authToken = ? LIMIT 1",
    [authToken],
  );

  const user = (rows as any[])[0];
  if (!user) throw new Error("Unable to get user data!");

  return {
    phone: user.phone,
    code: user.referralCode,
    username: user.userName,
    invite: user.invitedBy,
  };
};

export const addUserAccountBalance = async (
  db: Pool,
  { money, phone }: { money: number; phone: string },
) => {
  const timeNow = new Date();
  const timeIST = new Date(timeNow.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const formattedTime = moment(timeIST).format("YYYY-MM-DD HH:mm:ss");

  const tenPercent = 0.1 * money;
  let salary = 0;

  if (money >= 100 && money <= 299) salary = 20;
  else if (money >= 300 && money <= 999) salary = 60;
  else if (money >= 1000) salary = 150;

  const [userRows] = await db.execute("SELECT * FROM users WHERE phone = ?", [phone]);
  const userData = (userRows as any[])[0];

  const isFirstDeposit = userData.firstDepositBonus;
  const freeBonus = userData.freeBonus;
  const invite = userData.invitedBy;

  const [agentRows] = await db.execute("SELECT * FROM users WHERE referralCode = ?", [invite]);
  const agent = (agentRows as any[])[0];

  const incrementPercentage = isFirstDeposit ? 0.05 : 0.15;
  await db.execute("UPDATE users SET firstDepositBonus = ? WHERE phone = ?", [true, phone]);

  let adjustedMoney = money + money * incrementPercentage;

  if (freeBonus >= tenPercent) {
    adjustedMoney += tenPercent;
    await db.execute("UPDATE users SET freeBonus = freeBonus - ? WHERE phone = ?", [
      tenPercent,
      phone,
    ]);
  } else {
    adjustedMoney += freeBonus;
    await db.execute("UPDATE users SET freeBonus = ? WHERE phone = ?", [0, phone]);
  }

  await db.execute(
    "INSERT INTO salaryRecords (userId, amount, type, createdAt) VALUES ((SELECT id FROM users WHERE phone = ?), ?, ?, ?)",
    [agent?.phone || phone, salary, "Referral Bonus", Date.now()],
  );

  await db.execute(
    "UPDATE users SET balance = balance + ?, totalDeposited = totalDeposited + ? WHERE phone = ?",
    [salary, salary, agent?.phone || phone],
  );

  await db.execute(
    "UPDATE users SET balance = balance + ?, totalDeposited = totalDeposited + ? WHERE phone = ?",
    [adjustedMoney, adjustedMoney, phone],
  );
};
