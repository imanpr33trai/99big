import { Request } from 'express';

/**
 * Get IP address from request
 */
export const getIpAddress = (req: Request): string => {
  return (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'unknown';
};
