import QRCode from "qrcode";

export const paymentHelperGenerateUPIQRCode = async (
  upiId: string,
  amount: number,
): Promise<string> => {
  const upiString = `upi://pay?pa=${upiId}&pn=UPI+Payment&am=${amount}&cu=INR`;
  return QRCode.toDataURL(upiString);
};
