
import axios from 'axios';

interface SMSSendResult {
success: boolean;
messageId?: string;
error?: string;
}

/\*\*

- Send OTP via SMS gateway
- Uses environment variables for credentials - NEVER hardcode
  \*/
  export const sendOTP = async (phone: string, otp: string): Promise<boolean> => {
  try {
  const apiKey = process.env.SMS_API_KEY;
  const apiSecret = process.env.SMS_API_SECRET;
  const baseUrl = process.env.SMS_BASE_URL;
  const senderId = process.env.SMS_SENDER_ID || 'BIGDADDY';

      if (!apiKey || !apiSecret || !baseUrl) {
        console.error('SMS credentials not configured');
        // In development, log OTP to console
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DEV] OTP for ${phone}: ${otp}`);
          return true;
        }
        return false;
      }

      // Format phone number (remove country code if present, then add 91)
      const cleanPhone = phone.replace(/\D/g, '').replace(/^91/, '');
      const formattedPhone = `91${cleanPhone}`;

      const message = `Your 99BigDaddy verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;

      const response = await axios.get(baseUrl, {
        params: {
          appkey: apiKey,
          appsecret: apiSecret,
          phone: formattedPhone,
          content: message,
        },
        timeout: 10000,
      });

      return validateSMSResponse(response.data);

  } catch (error) {
  console.error('SMS send error:', error);

      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] OTP for ${phone}: ${otp}`);
        return true;
      }

      return false;

  }
  };

/\*\*

- Validate SMS gateway response
  \*/
  export const validateSMSResponse = (response: any): boolean => {
  // Adjust based on your SMS provider's response format
  if (typeof response === 'string') {
  return response.includes('success') || response.includes('0');
  }

if (response && typeof response === 'object') {
return response.status === 'success' ||
response.code === '0' ||
response.success === true;
}

return false;
};

/\*\*

- Format phone number for international SMS
  \*/
  export const formatPhoneForSMS = (phone: string): string => {
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('91') && clean.length === 12) {
  return clean;
  }
  if (clean.length === 10) {
  return `91${clean}`;
  }
  return clean;
  };
