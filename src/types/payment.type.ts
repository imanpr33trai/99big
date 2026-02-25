export enum PaymentStatusEnum {
  PENDING = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  FAILED = 3,
}

export enum PaymentTypeEnum {
  MOMO = "momo",
  UPI = "upi",
  USDT = "usdt",
  WALLET = "wallet",
  WOWPAY = "wowpay",
}

export interface PaymentRechargeRecord {
  id: number;
  id_order: string;
  transaction_id: string;
  phone: string;
  money: number;
  type: string;
  status: number;
  today: string;
  url: string;
  time: number;
  utr: string | null;
}

export interface PaymentWithdrawRecord {
  id: number;
  id_order: string;
  phone: string;
  money: number;
  stk: string;
  name_bank: string;
  ifsc: string;
  name_user: string;
  status: number;
  today: string;
  time: number;
}

export interface PaymentBankRecord {
  id: number;
  name_bank: string;
  name_user: string;
  stk: string;
  type: string;
  qr_code_image: string;
  time: number;
}

export interface PaymentUserBankRecord {
  id: number;
  phone: string;
  name_bank: string;
  name_user: string;
  stk: string;
  email: string;
  tinh: string;
  time: number;
}

export interface PaymentBalanceTransferRecord {
  id: number;
  sender_phone: string;
  receiver_phone: string;
  amount: number;
  time: number;
}

export interface PaymentCommissionRecord {
  id: number;
  phone: string;
  code: string;
  invite: string;
  f1: number;
  f2: number;
  f3: number;
  f4: number;
  time: number;
}

export interface PaymentTurnoverRecord {
  id: number;
  phone: string;
  code: string;
  invite: string;
  daily_turn_over: number;
  total_turn_over: number;
}

export interface PaymentPointRecord {
  id: number;
  phone: string;
  money: number;
  money_us: number;
  telegram: string;
  total1: number;
  total2: number;
  total3: number;
  total4: number;
  total5: number;
  total6: number;
  total7: number;
  level: number;
}

export interface PaymentRedEnvelopeRecord {
  id: number;
  id_redenvelope: string;
  phone: string;
  money: number;
  used: number;
  amount: number;
  status: number;
  time: number;
}

export interface PaymentRedEnvelopeUsedRecord {
  id: number;
  phone: string;
  phone_used: string;
  id_redenvelops: string;
  money: number;
  time: number;
}

export interface PaymentLevelRecord {
  id: number;
  level: number;
  f1: number;
  f2: number;
  f3: number;
  f4: number;
}
export interface PaymentMethodRecord {
  id: number;
  type: "bank" | "upi" | "crypto" | "wallet";
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  upiId: string | null;
  cryptoAddress: string | null;
  qrCodeUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: bigint;
}

export interface BankRechargeRecord {
  id: number;
  nameBank: string;
  nameUser: string;
  stk: string;
  type: string;
  qrCodeImage: string;
  time: number;
}

export interface TransactionLogRecord {
  id: bigint;
  userId: number;
  relatedUserId: number | null;
  typeId: number;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId: number | null;
  referenceType: string | null;
  description: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: bigint;
}
