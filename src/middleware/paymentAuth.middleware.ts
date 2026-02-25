import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { findUserByAuthToken } from '../db/payment.queries';

/**
 * Middleware to validate user authentication for payment operations
 */
export const paymentAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authToken = req.cookies?.auth || req.headers?.authorization;

      if (!authToken) {
        res.status(401).json({
          message: 'Authentication required',
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      const user = await findUserByAuthToken(db, authToken);

      if (!user) {
        res.status(401).json({
          message: 'Invalid or expired authentication',
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      // Attach user to request for downstream use
      (req as any).user = user;
      next();
    } catch (error) {
      console.error('Payment auth middleware error:', error);
      res.status(500).json({
        message: 'Authentication verification failed',
        status: false,
        timeStamp: Date.now(),
      });
    }
  };
};

/**
 * Middleware for webhook authentication (signature validation)
 */
export const webhookAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // For webhooks, we typically validate signatures rather than cookies
      // Specific validation is handled in individual controllers
      next();
    } catch (error) {
      console.error('Webhook auth middleware error:', error);
      res.status(400).json({
        message: 'Invalid webhook request',
        status: false,
        timeStamp: Date.now(),
      });
    }
  };
};

/**
 * Rate limiting middleware for payment endpoints
 * Simple in-memory implementation - consider using Redis for production
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const paymentRateLimitMiddleware = (maxRequests: number = 10, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const identifier = req.ip || 'unknown';
    const now = Date.now();

    const record = rateLimitMap.get(identifier);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    if (record.count >= maxRequests) {
      res.status(429).json({
        message: 'Too many payment requests. Please try again later.',
        status: false,
        timeStamp: now,
      });
      return;
    }

    record.count++;
    next();
  };
};
