import axios from 'axios';
import { EKQRResponse, EKQRConfig } from '../../types/payment.types';

const EKQR_API_BASE = 'https://api.ekqr.in/api';

/**
 * Initiate EKQR UPI payment
 */
export const initiateEKQRPayment = async (data: {
  key: string;
  client_txn_id: string;
  amount: string;
  p_info: string;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  redirect_url: string;
}): Promise<EKQRResponse> => {
  try {
    const response = await axios.post(`${EKQR_API_BASE}/create_order`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    return parseEKQRResponse(response.data);

  } catch (error) {
    throw handleEKQRError(error);
  }
};

/**
 * Verify EKQR payment status
 */
export const verifyEKQRPayment = async (
  orderId: string,
  txnDate: string
): Promise<EKQRResponse> => {
  try {
    const response = await axios.post(`${EKQR_API_BASE}/check_order_status`, {
      key: process.env.UPI_GATEWAY_PAYMENT_KEY,
      client_txn_id: orderId,
      txn_date: txnDate,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    return parseEKQRResponse(response.data);

  } catch (error) {
    throw handleEKQRError(error);
  }
};

/**
 * Parse EKQR API response
 */
export const parseEKQRResponse = (response: any): EKQRResponse => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response from EKQR API');
  }

  return {
    status: response.status === true || response.status === 'true',
    msg: response.msg || response.message,
    data: {
      payment_url: response.data?.payment_url || response.payment_url,
      upi_intent: response.data?.upi_intent || {
        bhim_link: response.data?.bhim_link,
        phonepe_link: response.data?.phonepe_link,
        paytm_link: response.data?.paytm_link,
        gpay_link: response.data?.gpay_link,
      },
      status: response.data?.status || response.status,
    },
  };
};

/**
 * Get UPI intent links from EKQR response
 */
export const getUPIIntentLinks = (data: EKQRResponse): {
  web_url: string;
  bhim_link: string;
  phonepe_link: string;
  paytm_link: string;
  gpay_link: string;
} => {
  return {
    web_url: data.data.payment_url,
    bhim_link: data.data.upi_intent?.bhim_link || '',
    phonepe_link: data.data.upi_intent?.phonepe_link || '',
    paytm_link: data.data.upi_intent?.paytm_link || '',
    gpay_link: data.data.upi_intent?.gpay_link || '',
  };
};

/**
 * Handle EKQR errors
 */
export const handleEKQRError = (error: any): Error => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.msg === 'Plan Expired. Please Renew Plan') {
      const err = new Error('Payment gateway plan has expired. Please contact support to renew the plan.');
      err.name = 'PlanExpiredError';
      return err;
    }
    if (error.code === 'ECONNABORTED') {
      return new Error('Payment gateway timeout. Please try again.');
    }

    return new Error(error.response?.data?.msg || 'Payment gateway error');
  }

  return error instanceof Error ? error : new Error('Unknown payment gateway error');
};

/**
 * Get EKQR configuration
 */
export const getEKQRConfig = (): EKQRConfig => {
  return {
    key: process.env.UPI_GATEWAY_PAYMENT_KEY || '',
    p_info: process.env.PAYMENT_INFO || '99BigDaddy Payment',
    email: process.env.PAYMENT_EMAIL || 'support@99bigdaddy.com',
    redirect_url: `${process.env.APP_BASE_URL}/wallet/verify/upi`,
  };
};
