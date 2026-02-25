import QRCode from "qrcode";

export const generateUPIQRCode = async (upiId: string, amount: number): Promise<string> => {
  const upiString = `upi://pay?pa=${upiId}&pn=UPI+Payment&am=${amount}&cu=INR`;
  return await QRCode.toDataURL(upiString);
};
