import axios from 'axios';
import querystring from 'querystring';
import crypto from 'crypto';
import { WowPayResponse, WowPayCallbackParams } from '../../../types/payment.types';
import { generateWowPaySign, validateWowPaySign, getCurrentDate } from '../../../utils';

const WOWPAY_API_URL = 'https://pay6de1c7.wowpayglb.com/pay/web';

/**
 * Generate WowPay signature
 */
export { generateWowPaySign };

/**
 * Validate WowPay callback signature
 */
export { validateWowPaySign };

/**
 * Initiate WowPay payment
 */
export const initiateWowPayPayment = async (params: {
  version: string;
  mch_id: string;
  mch_order_no: string;
  pay_type: string;
  trade_amount: number;
  order_date: string;
  goods_name: string;
  notify_url: string;
  mch_return_msg: string;
  page_url: string;
  sign: string;
  sign_type: string;
}): Promise<WowPayResponse> => {
  try {
    const response = await axios.post(WOWPAY_API_URL, querystring.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 30000,
    });

    return parseWowPayResponse(response.data);

  } catch (error) {
    console.error('WowPay initiation error:', error);
    throw new Error('Failed to initiate WowPay payment');
  }
};

/**
 * Verify WowPay callback
 */
export const verifyWowPayCallback = async (params: WowPayCallbackParams): Promise<boolean> => {
  const signStr = buildWowPaySignString(params);
  return validateWowPaySign(signStr, process.env.WOWPAY_MERCHANT_KEY || '', params.sign);
};

/**
 * Build sign string for WowPay
 */
const buildWowPaySignString = (params: WowPayCallbackParams): string => {
  let signStr = '';
  signStr += 'amount=' + params.amount + '&';
  signStr += 'mchId=' + params.mchId + '&';
  signStr += 'mchOrderNo=' + params.mchOrderNo + '&';
  signStr += 'merRetMsg=' + params.merRetMsg + '&';
  signStr += 'orderDate=' + params.orderDate + '&';
  signStr += 'orderNo=' + params.orderNo + '&';
  signStr += 'oriAmount=' + params.oriAmount + '&';
  signStr += 'tradeResult=' + params.tradeResult;
  return signStr;
};

/**
 * Parse WowPay response
 */
const parseWowPayResponse = (data: any): WowPayResponse => {
  return {
    respCode: data.respCode || data.resp_code,
    respMsg: data.respMsg || data.resp_msg,
    payInfo: data.payInfo || data.pay_info,
    mchOrderNo: data.mchOrderNo || data.mch_order_no,
    sign: data.sign,
  };
};

/**
 * Parse WowPay callback data
 */
export const parseWowPayCallback = (data: any): WowPayCallbackParams => {
  return {
    mchId: data.mchId || data.mch_id || '',
    amount: data.amount || '',
    mchOrderNo: data.mchOrderNo || data.mch_order_no || '',
    merRetMsg: data.merRetMsg || data.mer_ret_msg || '',
    orderDate: data.orderDate || data.order_date || '',
    orderNo: data.orderNo || data.order_no || '',
    oriAmount: data.oriAmount || data.ori_amount || '',
    tradeResult: data.tradeResult || data.trade_result || '',
    signType: data.signType || data.sign_type || '',
    sign: data.sign || '',
  };
};

/**
 * Get current date for WowPay
 */
export { getCurrentDate };

/**
 * Check if WowPay payment was successful
 */
export const isWowPaySuccess = (tradeResult: string): boolean => {
  return tradeResult === '1' || tradeResult === 'SUCCESS';
};
