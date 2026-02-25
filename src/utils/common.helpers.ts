export const helperGetRechargeOrderId = (): string => {
  const date = new Date();
  const id_time = date.getUTCFullYear() + "" + (date.getUTCMonth() + 1) + "" + date.getUTCDate();
  const id_order =
    Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  return id_time + id_order;
};

export const helperGetCurrentTimestamp = (): bigint => {
  return BigInt(Date.now());
};

export const helperGetCurrentTimestampString = (): string => {
  return new Date().toISOString();
};

export const helperFormatISTTime = (date: Date = new Date()): string => {
  const timeIST = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return timeIST.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const helperCalculateSalary = (amount: number): number => {
  if (amount >= 100 && amount <= 299) return 20;
  if (amount >= 300 && amount <= 999) return 60;
  if (amount >= 1000) return 150;
  return 0;
};

export const helperGetClientIp = (req: any): string => {
  return req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
};

export const helperFormatDateForEKQR = (timestamp: bigint): string => {
  return new Date(Number(timestamp))
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
};
export const helperGenerateRandomNumber = (min: number, max: number): string => {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const helperFormatTime = (params?: number | string, addHours: number = 0): string => {
  let date: Date;
  if (params) {
    date = new Date(Number(params));
  } else {
    date = new Date();
  }

  date.setHours(date.getHours() + addHours);

  const formateT = (num: number): string => {
    return num < 10 ? "0" + num : String(num);
  };

  let years = formateT(date.getFullYear());
  let months = formateT(date.getMonth() + 1);
  let days = formateT(date.getDate());

  let hours = date.getHours() % 12;
  hours = hours === 0 ? 12 : hours;
  let ampm = date.getHours() < 12 ? "AM" : "PM";

  let minutes = formateT(date.getMinutes());
  let seconds = formateT(date.getSeconds());

  return `${years}-${months}-${days} ${hours}:${minutes}:${seconds} ${ampm}`;
};

export const helperFormatDateForId = (): string => {
  const date = new Date();
  return date.getUTCFullYear() + "" + (date.getUTCMonth() + 1) + "" + date.getUTCDate();
};

export const helperGenerateOrderId = (): string => {
  const id_time = helperFormatDateForId();
  const id_order =
    Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  return id_time + id_order;
};
export const helperGenerateRandomNumber = (min: number, max: number): string => {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const helperGenerateRandomString = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const helperGenerateRandomStringNumber = (length: number): string => {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const helperGetCurrentTimestamp = (): number => {
  return Date.now();
};

export const helperGetCurrentTimestampBigInt = (): bigint => {
  return BigInt(Date.now());
};

export const helperFormatTime = (params?: number | string, addHours: number = 0): string => {
  let date: Date;
  if (params) {
    date = new Date(Number(params));
  } else {
    date = new Date();
  }

  date.setHours(date.getHours() + addHours);

  const formateT = (num: number): string => {
    return num < 10 ? "0" + num : String(num);
  };

  const years = formateT(date.getFullYear());
  const months = formateT(date.getMonth() + 1);
  const days = formateT(date.getDate());
  const hours = date.getHours() % 12 || 12;
  const ampm = date.getHours() < 12 ? "AM" : "PM";
  const minutes = formateT(date.getMinutes());
  const seconds = formateT(date.getSeconds());

  return `${years}-${months}-${days} ${hours}:${minutes}:${seconds} ${ampm}`;
};

export const helperFormatDateForId = (): string => {
  const date = new Date();
  return date.getUTCFullYear() + "" + (date.getUTCMonth() + 1) + "" + date.getUTCDate();
};

export const helperGenerateOrderId = (): string => {
  const id_time = helperFormatDateForId();
  const id_order =
    Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  return id_time + id_order;
};

export const helperGetIPAddress = (req: any): string => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

export const helperFormatISTTime = (): string => {
  const now = new Date();
  const timeIST = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return timeIST.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};
