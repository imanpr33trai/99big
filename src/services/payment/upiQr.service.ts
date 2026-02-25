import QRCode from 'qrcode';
import { generateUPIString } from '../../utils/payment.helpers';

/**
 * Generate UPI QR Code as data URL
 */
export const generateUPIQRCode = async (upiId: string, amount: number, name?: string): Promise<string> => {
  try {
    const upiString = generateUPIString(upiId, amount, name);
    const qrDataUrl = await QRCode.toDataURL(upiString, {
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 300,
    });
    return qrDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate UPI QR code');
  }
};

/**
 * Parse UPI string into components
 */
export const parseUPIString = (upiString: string): {
  pa: string; // Payee address (UPI ID)
  pn: string; // Payee name
  am: number; // Amount
  cu: string; // Currency
  tn?: string; // Transaction note
} => {
  const params = new URLSearchParams(upiString.replace('upi://pay?', ''));

  return {
    pa: params.get('pa') || '',
    pn: params.get('pn') || '',
    am: parseFloat(params.get('am') || '0'),
    cu: params.get('cu') || 'INR',
    tn: params.get('tn') || undefined,
  };
};

/**
 * Validate UPI ID format
 */
export const validateUPIId = (upiId: string): boolean => {
  // Basic UPI validation: user@bank or user@upi
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  return upiRegex.test(upiId);
};

/**
 * Generate UPI payment URL for intent
 */
export const generateUPIIntentUrl = (upiId: string, amount: number, name?: string): string => {
  return generateUPIString(upiId, amount, name);
};
