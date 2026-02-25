// ============================================================================
// File: src/types/admin.types.ts
// ============================================================================

import { z } from 'zod';

// Admin Authentication Schemas
export const AdminLoginSchema = z.object({
phone: z.string().min(10).max(20),
password: z.string().min(6),
});

export const AdminRegisterSchema = z.object({
phone: z.string().min(10).max(20),
password: z.string().min(6),
userName: z.string().min(2).max(100),
inviteCode: z.string().optional(),
userLevel: z.enum(['0', '1', '2']).default('0'), // 0=user, 1=admin, 2=ctv
});

export const PaginationSchema = z.object({
page: z.number().int().min(0).default(0),
limit: z.number().int().min(1).max(100).default(10),
});

export const UserInfoSchema = z.object({
phone: z.string().min(10).max(20),
});

export const RechargeActionSchema = z.object({
id: z.number().int().positive(),
type: z.enum(['confirm', 'cancel']),
utrNumber: z.string().optional(),
});

export const WithdrawActionSchema = z.object({
id: z.number().int().positive(),
type: z.enum(['confirm', 'cancel']),
reason: z.string().optional(),
});

export const SettingBankSchema = z.object({
type: z.enum(['bank', 'upi', 'crypto']),
bankName: z.string().optional(),
accountName: z.string().optional(),
accountNumber: z.string().optional(),
ifscCode: z.string().optional(),
upiId: z.string().optional(),
cryptoAddress: z.string().optional(),
qrCodeUrl: z.string().optional(),
});

export const SettingCskhSchema = z.object({
telegram: z.string().optional(),
whatsapp: z.string().optional(),
supportEmail: z.string().optional(),
});

export const BannedSchema = z.object({
phone: z.string().min(10).max(20),
status: z.enum(['0', '1', '2']), // 0=active, 1=suspended, 2=banned
});

export const CreateBonusSchema = z.object({
amount: z.number().positive(),
count: z.number().int().positive(),
userId: z.number().int().positive(),
});

export const SettingBuffSchema = z.object({
phone: z.string().min(10).max(20),
amount: z.number(),
type: z.enum(['add', 'subtract']),
reason: z.string(),
});

export const ChangeAdminSchema = z.object({
game: z.enum(['wingo', '5d', 'k3']),
duration: z.enum(['1', '3', '5', '10']),
value: z.string(),
});

export const TotalJoinSchema = z.object({
gameJoin: z.enum(['1', '3', '5', '10']),
});

export const EditResultSchema = z.object({
game: z.number().int().min(1).max(10),
list: z.string(),
});

export const CreateSalarySchema = z.object({
phone: z.string().min(10).max(20),
amount: z.number().positive(),
type: z.enum(['daily', 'weekly', 'monthly']),
});

export const UpdateLevelSchema = z.object({
level: z.number().int().min(0).max(10),
rateF1: z.number().min(0).max(100),
rateF2: z.number().min(0).max(100),
rateF3: z.number().min(0).max(100),
rateF4: z.number().min(0).max(100),
minTurnover: z.number().positive(),
});

export const ListCTVSchema = z.object({
page: z.number().int().min(0).default(0),
limit: z.number().int().min(1).max(100).default(10),
});

// TypeScript Types
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
export type AdminRegisterInput = z.infer<typeof AdminRegisterSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type UserInfoInput = z.infer<typeof UserInfoSchema>;
export type RechargeActionInput = z.infer<typeof RechargeActionSchema>;
export type WithdrawActionInput = z.infer<typeof WithdrawActionSchema>;
export type SettingBankInput = z.infer<typeof SettingBankSchema>;
export type SettingCskhInput = z.infer<typeof SettingCskhSchema>;
export type BannedInput = z.infer<typeof BannedSchema>;
export type CreateBonusInput = z.infer<typeof CreateBonusInput>;
export type SettingBuffInput = z.infer<typeof SettingBuffSchema>;
export type ChangeAdminInput = z.infer<typeof ChangeAdminSchema>;
export type TotalJoinInput = z.infer<typeof TotalJoinSchema>;
export type EditResultInput = z.infer<typeof EditResultSchema>;
export type CreateSalaryInput = z.infer<typeof CreateSalarySchema>;
export type UpdateLevelInput = z.infer<typeof UpdateLevelSchema>;
export type ListCTVInput = z.infer<typeof ListCTVSchema>;

export interface AdminApiResponse<T = unknown> {
message: string;
status: boolean;
data?: T;
timeStamp?: number;
[key: string]: unknown;
}

export interface AdminAuthPayload {
userId: number;
phone: string;
userLevel: number;
authToken: string;
}

export interface UserFinancialData {
totalDeposit: number;
totalWithdraw: number;
totalBet: number;
totalWin: number;
balance: number;
}

export interface StatisticalData {
totalUsers: number;
todayUsers: number;
totalDeposits: number;
todayDeposits: number;
totalWithdrawals: number;
todayWithdrawals: number;
totalBets: number;
todayBets: number;
platformProfit: number;
}

export interface CTVInfoData {
ctvId: number;
ctvName: string;
f1Count: number;
f2Count: number;
f3Count: number;
f4Count: number;
todayF1: number;
todayF2: number;
todayF3: number;
todayF4: number;
totalCommission: number;
todayCommission: number;
}

export interface RechargeStats {
pending: number;
completed: number;
totalAmount: number;
}

export interface WithdrawStats {
pending: number;
completed: number;
rejected: number;
totalAmount: number;
}

export interface GameStatistics {
gameType: string;
totalBets: number;
totalBetAmount: number;
totalWinAmount: number;
profit: number;
}

export interface ReferralHierarchy {
f1: Array<{ id: number; phone: string; userName: string; createdAt: number }>;
f2: Array<{ id: number; phone: string; userName: string; createdAt: number }>;
f3: Array<{ id: number; phone: string; userName: string; createdAt: number }>;
f4: Array<{ id: number; phone: string; userName: string; createdAt: number }>;
}

export interface CommissionData {
level: number;
rateF1: number;
rateF2: number;
rateF3: number;
rateF4: number;
minTurnover: number;
}

export interface AdminUser {
id: number;
phone: string;
userName: string;
passwordHash: string;
authToken: string;
balance: number;
referralCode: string;
invitedBy: number | null;
isVerified: boolean;
status: number;
userLevel: number;
createdAt: number;
}

export interface DepositRecord {
id: number;
orderId: string;
userId: number;
amount: number;
status: number;
utrNumber: string | null;
createdAt: number;
userPhone?: string;
userName?: string;
}

export interface WithdrawalRecord {
id: number;
orderId: string;
userId: number;
amount: number;
fee: number;
netAmount: number;
status: number;
rejectionReason: string | null;
requestedAt: number;
userPhone?: string;
userName?: string;
}

// ============================================================================
// File: src/utils/admin.helpers.ts
// ============================================================================

import { Request } from 'express';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/\*\*

- Generate random referral code
  _/
  export const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
  code += chars.charAt(Math.floor(Math.random() _ chars.length));
  }
  return code;
  };

/\*\*

- Generate random number in range
  _/
  export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() _ (max - min + 1)) + min;
  };

/\*\*

- Get current timestamp
  \*/
  export const getCurrentTimestamp = (): number => {
  return Date.now();
  };

/\*\*

- Get IP address from request
  \*/
  export const getIpAddress = (req: Request): string => {
  return (req.headers['x-forwarded-for'] as string) ||
  req.socket.remoteAddress ||
  'unknown';
  };

/\*\*

- Hash password using bcrypt
  \*/
  export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
  };

/\*\*

- Verify password using bcrypt
  \*/
  export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
  };

/\*\*

- Format time in IST
  \*/
  export const formatTimeIST = (timestamp?: number): string => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  });
  };

/\*\*

- Get today's date string
  \*/
  export const getTodayString = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
  };

/\*\*

- Get today's start timestamp
  \*/
  export const getTodayStartTimestamp = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
  };

/\*\*

- Safe parse float
  \*/
  export const safeParseFloat = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
  };

/\*\*

- Calculate pagination
  \*/
  export const calculatePagination = (page: number, limit: number, total: number): {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  } => {
  const totalPages = Math.ceil(total / limit);
  return {
  currentPage: page,
  totalPages,
  hasNext: page < totalPages - 1,
  hasPrev: page > 0,
  };
  };

/\*\*

- Generate order ID
  \*/
  export const generateOrderId = (prefix: string): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
  };

// ============================================================================
// File: src/middleware/adminAuth.middleware.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { AdminUser } from '../types/admin.types';

// Extend Express Request
declare global {
namespace Express {
interface Request {
admin?: AdminUser;
}
}
}

/\*\*

- Admin authentication middleware
- Validates token and checks admin level (1 or 2)
  \*/
  export const adminAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
  const authToken = req.headers.authorization?.replace('Bearer ', '') ||
  req.body.token ||
  req.query.token;

        if (!authToken) {
          res.status(401).json({
            message: 'Authentication required',
            status: false,
            timeStamp: Date.now(),
          });
          return;
        }

        const [rows] = await db.execute(
          `SELECT id, phone, userName, passwordHash, authToken, balance, referralCode,
                  invitedBy, isVerified, status, userLevel, createdAt
           FROM users WHERE authToken = ? AND userLevel IN (1, 2) LIMIT 1`,
          [authToken]
        );

        const users = rows as AdminUser[];

        if (users.length === 0) {
          res.status(401).json({
            message: 'Invalid admin token or insufficient privileges',
            status: false,
            timeStamp: Date.now(),
          });
          return;
        }

        const admin = users[0];

        if (admin.status !== 0) {
          res.status(403).json({
            message: 'Admin account suspended or banned',
            status: false,
            timeStamp: Date.now(),
          });
          return;
        }

        req.admin = admin;
        next();
      } catch (error) {
        console.error('Admin auth middleware error:', error);
        res.status(500).json({
          message: 'Internal server error',
          status: false,
          timeStamp: Date.now(),
        });
      }

  };
  };

// ============================================================================
// File: src/db/admin.queries.ts
// ============================================================================

import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { AdminUser, DepositRecord, WithdrawalRecord, CommissionData } from '../types/admin.types';
import { getTodayStartTimestamp } from '../utils/admin.helpers';

// User Queries

/\*\*

- Find admin by token
  \*/
  export const findAdminByToken = async (db: Pool, token: string): Promise<AdminUser | null> => {
  const [rows] = await db.execute(
  `SELECT id, phone, userName, passwordHash, authToken, balance, referralCode, 
            invitedBy, isVerified, status, userLevel, createdAt 
     FROM users WHERE authToken = ? AND userLevel IN (1, 2) LIMIT 1`,
  [token]
  );
  return (rows as AdminUser[])[0] || null;
  };

/\*\*

- Find user by phone
  \*/
  export const findUserByPhone = async (db: Pool, phone: string): Promise<AdminUser | null> => {
  const [rows] = await db.execute(
  `SELECT id, phone, userName, passwordHash, authToken, balance, referralCode, 
            invitedBy, isVerified, status, userLevel, createdAt 
     FROM users WHERE phone = ? LIMIT 1`,
  [phone]
  );
  return (rows as AdminUser[])[0] || null;
  };

/\*\*

- Find user by ID
  \*/
  export const findUserById = async (db: Pool, id: number): Promise<AdminUser | null> => {
  const [rows] = await db.execute(
  `SELECT id, phone, userName, passwordHash, authToken, balance, referralCode, 
            invitedBy, isVerified, status, userLevel, createdAt 
     FROM users WHERE id = ? LIMIT 1`,
  [id]
  );
  return (rows as AdminUser[])[0] || null;
  };

/\*\*

- List members with pagination
  _/
  export const listMembers = async (db: Pool, page: number, limit: number): Promise<{ users: AdminUser[]; total: number }> => {
  const offset = page _ limit;

const [countRows] = await db.execute(
'SELECT COUNT(\*) as total FROM users WHERE userLevel = 0',
[]
);
const total = (countRows as any[])[0].total;

const [rows] = await db.execute(
`SELECT id, phone, userName, balance, referralCode, invitedBy, isVerified, 
            status, userLevel, createdAt 
     FROM users WHERE userLevel = 0 
     ORDER BY id DESC LIMIT ? OFFSET ?`,
[limit, offset]
);

return { users: rows as AdminUser[], total };
};

/\*\*

- List CTVs with pagination
  _/
  export const listCTV = async (db: Pool, page: number, limit: number): Promise<{ users: AdminUser[]; total: number }> => {
  const offset = page _ limit;

const [countRows] = await db.execute(
'SELECT COUNT(\*) as total FROM users WHERE userLevel = 2',
[]
);
const total = (countRows as any[])[0].total;

const [rows] = await db.execute(
`SELECT id, phone, userName, balance, referralCode, invitedBy, isVerified, 
            status, userLevel, createdAt 
     FROM users WHERE userLevel = 2 
     ORDER BY id DESC LIMIT ? OFFSET ?`,
[limit, offset]
);

return { users: rows as AdminUser[], total };
};

/\*\*

- Get direct subordinates (F1)
  \*/
  export const getDirectSubordinates = async (db: Pool, referralCode: string): Promise<AdminUser[]> => {
  const todayStart = getTodayStartTimestamp();

const [rows] = await db.execute(
`SELECT id, phone, userName, balance, referralCode, invitedBy, isVerified, 
            status, userLevel, createdAt 
     FROM users WHERE invitedBy = (SELECT id FROM users WHERE referralCode = ?) 
     ORDER BY createdAt DESC`,
[referralCode]
);

return rows as AdminUser[];
};

/\*\*

- Get subordinates by user IDs (for F2, F3, F4)
  \*/
  export const getSubordinatesByLevel = async (db: Pool, userIds: number[]): Promise<AdminUser[]> => {
  if (userIds.length === 0) return [];

const placeholders = userIds.map(() => '?').join(',');
const [rows] = await db.execute(
`SELECT id, phone, userName, balance, referralCode, invitedBy, isVerified, 
            status, userLevel, createdAt 
     FROM users WHERE invitedBy IN (${placeholders})`,
userIds
);

return rows as AdminUser[];
};

// Financial Queries

/\*\*

- Get pending deposits
  \*/
  export const getPendingDeposits = async (db: Pool): Promise<DepositRecord[]> => {
  const [rows] = await db.execute(
  `SELECT d.id, d.orderId, d.userId, d.amount, d.status, d.utrNumber, d.createdAt,
            u.phone as userPhone, u.userName
     FROM deposits d
     JOIN users u ON d.userId = u.id
     WHERE d.status = 0
     ORDER BY d.createdAt DESC`,
  []
  );
  return rows as DepositRecord[];
  };

/\*\*

- Get processed deposits (completed/failed)
  \*/
  export const getProcessedDeposits = async (db: Pool, limit: number = 100): Promise<DepositRecord[]> => {
  const [rows] = await db.execute(
  `SELECT d.id, d.orderId, d.userId, d.amount, d.status, d.utrNumber, d.createdAt,
            u.phone as userPhone, u.userName
     FROM deposits d
     JOIN users u ON d.userId = u.id
     WHERE d.status IN (2, 3)
     ORDER BY d.createdAt DESC
     LIMIT ?`,
  [limit]
  );
  return rows as DepositRecord[];
  };

/\*\*

- Get pending withdrawals
  \*/
  export const getPendingWithdrawals = async (db: Pool): Promise<WithdrawalRecord[]> => {
  const [rows] = await db.execute(
  `SELECT w.id, w.orderId, w.userId, w.amount, w.fee, w.netAmount, w.status, 
            w.rejectionReason, w.requestedAt, u.phone as userPhone, u.userName
     FROM withdrawals w
     JOIN users u ON w.userId = u.id
     WHERE w.status = 0
     ORDER BY w.requestedAt DESC`,
  []
  );
  return rows as WithdrawalRecord[];
  };

/\*\*

- Get processed withdrawals
  \*/
  export const getProcessedWithdrawals = async (db: Pool, limit: number = 100): Promise<WithdrawalRecord[]> => {
  const [rows] = await db.execute(
  `SELECT w.id, w.orderId, w.userId, w.amount, w.fee, w.netAmount, w.status, 
            w.rejectionReason, w.requestedAt, u.phone as userPhone, u.userName
     FROM withdrawals w
     JOIN users u ON w.userId = u.id
     WHERE w.status IN (1, 2, 3)
     ORDER BY w.requestedAt DESC
     LIMIT ?`,
  [limit]
  );
  return rows as WithdrawalRecord[];
  };

/\*\*

- Get deposit by ID
  \*/
  export const getDepositById = async (db: Pool, id: number): Promise<DepositRecord | null> => {
  const [rows] = await db.execute(
  `SELECT d.id, d.orderId, d.userId, d.amount, d.status, d.utrNumber, d.createdAt,
            u.phone as userPhone, u.userName
     FROM deposits d
     JOIN users u ON d.userId = u.id
     WHERE d.id = ?`,
  [id]
  );
  return (rows as DepositRecord[])[0] || null;
  };

/\*\*

- Get withdrawal by ID
  \*/
  export const getWithdrawalById = async (db: Pool, id: number): Promise<WithdrawalRecord | null> => {
  const [rows] = await db.execute(
  `SELECT w.id, w.orderId, w.userId, w.amount, w.fee, w.netAmount, w.status, 
            w.rejectionReason, w.requestedAt
     FROM withdrawals w
     WHERE w.id = ?`,
  [id]
  );
  return (rows as WithdrawalRecord[])[0] || null;
  };

/\*\*

- Update deposit status
  \*/
  export const updateDepositStatus = async (db: Pool, id: number, status: number, utrNumber?: string): Promise<void> => {
  if (utrNumber) {
  await db.execute(
  'UPDATE deposits SET status = ?, utrNumber = ? WHERE id = ?',
  [status, utrNumber, id]
  );
  } else {
  await db.execute(
  'UPDATE deposits SET status = ? WHERE id = ?',
  [status, id]
  );
  }
  };

/\*\*

- Update withdrawal status
  \*/
  export const updateWithdrawalStatus = async (db: Pool, id: number, status: number, reason?: string): Promise<void> => {
  if (reason) {
  await db.execute(
  'UPDATE withdrawals SET status = ?, rejectionReason = ? WHERE id = ?',
  [status, reason, id]
  );
  } else {
  await db.execute(
  'UPDATE withdrawals SET status = ? WHERE id = ?',
  [status, id]
  );
  }
  };

// Statistics Queries

/\*\*

- Get game statistics
  \*/
  export const getGameStatistics = async (db: Pool): Promise<any[]> => {
  const [rows] = await db.execute(
  `SELECT gt.id, gt.name, gt.duration,
            COUNT(b.id) as totalBets,
            SUM(b.betAmount) as totalBetAmount,
            SUM(b.actualWin) as totalWinAmount
     FROM gameTypes gt
     LEFT JOIN bets b ON gt.id = b.gameTypeId
     GROUP BY gt.id, gt.name, gt.duration`,
  []
  );
  return rows as any[];
  };

/\*\*

- Get today's deposits
  _/
  export const getTodayDeposits = async (db: Pool): Promise<{ count: number; amount: number }> => {
  const todayStart = getTodayStartTimestamp();
  const [rows] = await db.execute(
  `SELECT COUNT(_) as count, COALESCE(SUM(amount), 0) as amount
  FROM deposits
  WHERE createdAt >= ? AND status = 2`,
  [todayStart]
  );
  return (rows as any[])[0] || { count: 0, amount: 0 };
  };

/\*\*

- Get today's withdrawals
  _/
  export const getTodayWithdrawals = async (db: Pool): Promise<{ count: number; amount: number }> => {
  const todayStart = getTodayStartTimestamp();
  const [rows] = await db.execute(
  `SELECT COUNT(_) as count, COALESCE(SUM(amount), 0) as amount
  FROM withdrawals
  WHERE requestedAt >= ? AND status = 2`,
  [todayStart]
  );
  return (rows as any[])[0] || { count: 0, amount: 0 };
  };

/\*\*

- Get total join (bet statistics)
  \*/
  export const getTotalJoin = async (db: Pool, gameTypeId: number): Promise<any> => {
  const [rows] = await db.execute(
  `SELECT 
      SUM(CASE WHEN betType = 'big' THEN betAmount ELSE 0 END) as big,
      SUM(CASE WHEN betType = 'small' THEN betAmount ELSE 0 END) as small,
      SUM(CASE WHEN betType = 'odd' THEN betAmount ELSE 0 END) as odd,
      SUM(CASE WHEN betType = 'even' THEN betAmount ELSE 0 END) as even,
      SUM(CASE WHEN betType = 'red' THEN betAmount ELSE 0 END) as red,
      SUM(CASE WHEN betType = 'green' THEN betAmount ELSE 0 END) as green,
      SUM(CASE WHEN betType = 'violet' THEN betAmount ELSE 0 END) as violet
     FROM bets 
     WHERE gameTypeId = ? AND status = 0`,
  [gameTypeId]
  );
  return (rows as any[])[0] || {};
  };

// Settings Queries

/\*\*

- Get all admin configs
  \*/
  export const getAdminConfigs = async (db: Pool): Promise<Record<string, string>> => {
  const [rows] = await db.execute(
  'SELECT configKey, configValue FROM adminConfigs',
  []
  );

const configs: Record<string, string> = {};
(rows as any[]).forEach(row => {
configs[row.configKey] = row.configValue;
});

return configs;
};

/\*\*

- Update admin config
  \*/
  export const updateAdminConfig = async (db: Pool, key: string, value: string): Promise<void> => {
  const now = Date.now();
  await db.execute(
  `INSERT INTO adminConfigs (configKey, configValue, updatedAt) 
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE configValue = ?, updatedAt = ?`,
  [key, value, now, value, now]
  );
  };

/\*\*

- Get payment methods
  _/
  export const getPaymentMethods = async (db: Pool): Promise<any[]> => {
  const [rows] = await db.execute(
  'SELECT _ FROM paymentMethods ORDER BY id',
  []
  );
  return rows as any[];
  };

/\*\*

- Update payment method
  \*/
  export const updatePaymentMethod = async (db: Pool, type: string, data: Record<string, string>): Promise<void> => {
  const fields = Object.keys(data);
  const values = Object.values(data);

const setClause = fields.map(f => `${f} = ?`).join(', ');

await db.execute(
`INSERT INTO paymentMethods (type, ${fields.join(', ')}) 
     VALUES (?, ${fields.map(() => '?').join(', ')})
     ON DUPLICATE KEY UPDATE ${setClause}`,
[type, ...values, ...values]
);
};

// Commission Queries

/\*\*

- Get commission levels
  \*/
  export const getCommissionLevels = async (db: Pool): Promise<CommissionData[]> => {
  const [rows] = await db.execute(
  'SELECT id, level, rateF1, rateF2, rateF3, rateF4, minTurnover FROM commissionLevels ORDER BY level',
  []
  );
  return rows as CommissionData[];
  };

/\*\*

- Update commission level
  \*/
  export const updateCommissionLevel = async (db: Pool, id: number, data: Partial<CommissionData>): Promise<void> => {
  const fields: string[] = [];
  const values: any[] = [];

if (data.rateF1 !== undefined) { fields.push('rateF1 = ?'); values.push(data.rateF1); }
if (data.rateF2 !== undefined) { fields.push('rateF2 = ?'); values.push(data.rateF2); }
if (data.rateF3 !== undefined) { fields.push('rateF3 = ?'); values.push(data.rateF3); }
if (data.rateF4 !== undefined) { fields.push('rateF4 = ?'); values.push(data.rateF4); }
if (data.minTurnover !== undefined) { fields.push('minTurnover = ?'); values.push(data.minTurnover); }

if (fields.length === 0) return;

values.push(id);

await db.execute(
`UPDATE commissionLevels SET ${fields.join(', ')} WHERE id = ?`,
values
);
};

// Salary Queries

/\*\*

- Get salary records
  \*/
  export const getSalaryRecords = async (db: Pool, phone?: string): Promise<any[]> => {
  let query = `     SELECT s.id, s.userId, s.amount, s.type, s.periodStart, s.periodEnd, s.isPaid, s.createdAt,
           u.phone, u.userName
    FROM salaryRecords s
    JOIN users u ON s.userId = u.id
  `;
  const params: any[] = [];

if (phone) {
query += ' WHERE u.phone = ?';
params.push(phone);
}

query += ' ORDER BY s.createdAt DESC';

const [rows] = await db.execute(query, params);
return rows as any[];
};

/\*\*

- Create salary record
  \*/
  export const createSalaryRecord = async (db: Pool, data: {
  userId: number;
  amount: number;
  type: string;
  periodStart: string;
  periodEnd: string;
  }): Promise<number> => {
  const now = Date.now();
  const [result] = await db.execute<ResultSetHeader>(
  `INSERT INTO salaryRecords (userId, amount, type, periodStart, periodEnd, isPaid, createdAt) 
     VALUES (?, ?, ?, ?, ?, false, ?)`,
  [data.userId, data.amount, data.type, data.periodStart, data.periodEnd, now]
  );
  return result.insertId;
  };

// User Balance Queries

/\*\*

- Update user balance
  \*/
  export const updateUserBalance = async (db: Pool, userId: number, amount: number): Promise<void> => {
  await db.execute(
  'UPDATE users SET balance = balance + ?, updatedAt = ? WHERE id = ?',
  [amount, Date.now(), userId]
  );
  };

/\*\*

- Set first deposit bonus flag
  \*/
  export const setFirstDepositBonus = async (db: Pool, userId: number): Promise<void> => {
  // Add logic to track first deposit bonus in separate table if needed
  await db.execute(
  'UPDATE users SET isVerified = true WHERE id = ?',
  [userId]
  );
  };

/\*\*

- Update free bonus
  \*/
  export const updateFreeBonus = async (db: Pool, userId: number, amount: number): Promise<void> => {
  await db.execute(
  'UPDATE users SET balance = balance + ? WHERE id = ?',
  [amount, userId]
  );
  };

// Red Envelope Queries

/\*\*

- Get red envelopes
  \*/
  export const getRedEnvelopes = async (db: Pool, creatorId?: number): Promise<any[]> => {
  let query = `     SELECT r.id, r.envelopeId, r.creatorId, r.totalAmount, r.totalCount, 
           r.claimedCount, r.status, r.expiredAt, r.createdAt,
           u.phone as creatorPhone, u.userName as creatorName
    FROM redEnvelopes r
    JOIN users u ON r.creatorId = u.id
  `;
  const params: any[] = [];

if (creatorId) {
query += ' WHERE r.creatorId = ?';
params.push(creatorId);
}

query += ' ORDER BY r.createdAt DESC';

const [rows] = await db.execute(query, params);
return rows as any[];
};

/\*\*

- Create red envelope
  \*/
  export const createRedEnvelope = async (db: Pool, data: {
  envelopeId: string;
  creatorId: number;
  totalAmount: number;
  totalCount: number;
  expiredAt: number;
  }): Promise<number> => {
  const now = Date.now();
  const [result] = await db.execute<ResultSetHeader>(
  `INSERT INTO redEnvelopes (envelopeId, creatorId, totalAmount, totalCount, 
                               claimedCount, status, expiredAt, createdAt) 
     VALUES (?, ?, ?, ?, 0, 0, ?, ?)`,
  [data.envelopeId, data.creatorId, data.totalAmount, data.totalCount, data.expiredAt, now]
  );
  return result.insertId;
  };

// ============================================================================
// File: src/controllers/admin/adminAuth.controller.ts
// ============================================================================

import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import {
AdminLoginSchema,
AdminRegisterSchema,
ChangeAdminSchema,
SettingCskhSchema,
BannedSchema,
AdminApiResponse,
AdminUser
} from '../../types/admin.types';
import { findUserByPhone, findUserById, updateAdminConfig, updateUserBalance } from '../../db/admin.queries';
import { hashPassword, verifyPassword, generateReferralCode, getCurrentTimestamp, generateOrderId } from '../../utils/admin.helpers';

/\*\*

- Create admin authentication controller
  \*/
  export const createAdminAuthController = (db: Pool) => ({
  /\*\*
  - Admin login
    \*/
    login: async (req: Request, res: Response): Promise<void> => {
    try {
    const validation = AdminLoginSchema.safeParse(req.body);
    if (!validation.success) {
    res.status(400).json({
    message: 'Invalid input',
    status: false,
    errors: validation.error.errors,
    });
    return;
    }

        const { phone, password } = validation.data;

        const user = await findUserByPhone(db, phone);
        if (!user) {
          res.status(401).json({
            message: 'Invalid credentials',
            status: false,
          });
          return;
        }

        if (user.userLevel !== 1 && user.userLevel !== 2) {
          res.status(403).json({
            message: 'Insufficient privileges',
            status: false,
          });
          return;
        }

        const isValidPassword = await verifyPassword(password, user.passwordHash);
        if (!isValidPassword) {
          res.status(401).json({
            message: 'Invalid credentials',
            status: false,
          });
          return;
        }

        // Generate new auth token
        const authToken = generateOrderId('ADM');
        await db.execute(
          'UPDATE users SET authToken = ? WHERE id = ?',
          [authToken, user.id]
        );

        const response: AdminApiResponse = {
          message: 'Login successful',
          status: true,
          data: {
            token: authToken,
            user: {
              id: user.id,
              phone: user.phone,
              userName: user.userName,
              userLevel: user.userLevel,
            },
          },
          timeStamp: getCurrentTimestamp(),
        };

        res.json(response);

    } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
    message: 'Internal server error',
    status: false,
    });
    }
    },

/\*\*

- Register new admin/CTV/user
  \*/
  register: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = AdminRegisterSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({
  message: 'Invalid input',
  status: false,
  errors: validation.error.errors,
  });
  return;
  }

      const { phone, password, userName, inviteCode, userLevel } = validation.data;

      // Check if phone exists
      const existing = await findUserByPhone(db, phone);
      if (existing) {
        res.status(409).json({
          message: 'Phone number already registered',
          status: false,
        });
        return;
      }

      // Hash password with bcrypt
      const passwordHash = await hashPassword(password);
      const referralCode = generateReferralCode();
      const now = getCurrentTimestamp();

      // Find inviter if invite code provided
      let invitedBy: number | null = null;
      if (inviteCode) {
        const inviter = await db.execute(
          'SELECT id FROM users WHERE referralCode = ?',
          [inviteCode]
        );
        if ((inviter as any[]).length > 0) {
          invitedBy = (inviter as any[])[0].id;
        }
      }

      const [result] = await db.execute(
        `INSERT INTO users (phone, userName, passwordHash, authToken, balance, referralCode,
                           invitedBy, isVerified, status, userLevel, createdAt, updatedAt)
         VALUES (?, ?, ?, NULL, 0, ?, ?, false, 0, ?, ?, ?)`,
        [phone, userName, passwordHash, referralCode, invitedBy, parseInt(userLevel), now, now]
      );

      const response: AdminApiResponse = {
        message: 'Registration successful',
        status: true,
        data: {
          userId: (result as any).insertId,
          phone,
          userName,
        },
        timeStamp: getCurrentTimestamp(),
      };

      res.json(response);

  } catch (error) {
  console.error('Admin register error:', error);
  res.status(500).json({
  message: 'Internal server error',
  status: false,
  });
  }
  },

/\*\*

- Change game control settings
  \*/
  changeAdmin: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = ChangeAdminSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({
  message: 'Invalid input',
  status: false,
  });
  return;
  }

      const { game, duration, value } = validation.data;
      const configKey = `${game}${duration}_control`;

      await updateAdminConfig(db, configKey, value);

      res.json({
        message: 'Settings updated successfully',
        status: true,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Change admin error:', error);
  res.status(500).json({
  message: 'Failed to update settings',
  status: false,
  });
  }
  },

/\*\*

- Update customer service settings
  \*/
  settingCskh: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = SettingCskhSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({
  message: 'Invalid input',
  status: false,
  });
  return;
  }

      const { telegram, whatsapp, supportEmail } = validation.data;

      if (telegram) await updateAdminConfig(db, 'telegram', telegram);
      if (whatsapp) await updateAdminConfig(db, 'whatsapp', whatsapp);
      if (supportEmail) await updateAdminConfig(db, 'support_email', supportEmail);

      res.json({
        message: 'Customer service settings updated',
        status: true,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Setting CSKH error:', error);
  res.status(500).json({
  message: 'Failed to update settings',
  status: false,
  });
  }
  },

/\*\*

- Ban/unban user
  \*/
  banned: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = BannedSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({
  message: 'Invalid input',
  status: false,
  });
  return;
  }

        const { phone, status } = validation.data;

        const user = await findUserByPhone(db, phone);
        if (!user) {
          res.status(404).json({
            message: 'User not found',
            status: false,
          });
          return;
        }

        await db.execute(
          'UPDATE users SET status = ? WHERE phone = ?',
          [parseInt(status), phone]
        );

        res.json({
          message: `User ${status === '0' ? 'activated' : status === '1' ? 'suspended' : 'banned'} successfully`,
          status: true,
          timeStamp: getCurrentTimestamp(),
        });
      } catch (error) {
        console.error('Banned error:', error);
        res.status(500).json({
          message: 'Failed to update user status',
          status: false,
        });
      }

  },
  });

// ============================================================================
// File: src/controllers/admin/adminMember.controller.ts
// ============================================================================

import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import {
PaginationSchema,
UserInfoSchema,
RechargeActionSchema,
WithdrawActionSchema,
SettingBankSchema,
CreateBonusSchema,
SettingBuffSchema,
CreateSalarySchema,
UpdateLevelSchema,
ListCTVSchema,
AdminApiResponse,
CTVInfoData,
UserFinancialData,
} from '../../types/admin.types';
import {
listMembers,
listCTV,
findUserByPhone,
getPendingDeposits,
getProcessedDeposits,
getPendingWithdrawals,
getProcessedWithdrawals,
getDepositById,
getWithdrawalById,
updateDepositStatus,
updateWithdrawalStatus,
updateUserBalance,
getCommissionLevels,
updateCommissionLevel,
getSalaryRecords,
createSalaryRecord,
getDirectSubordinates,
getSubordinatesByLevel,
getRedEnvelopes,
createRedEnvelope,
getAdminConfigs,
getPaymentMethods,
updatePaymentMethod,
getTodayDeposits,
getTodayWithdrawals,
} from '../../db/admin.queries';
import { getGameStatistics } from '../../db/admin.queries';
import { calculatePagination, getCurrentTimestamp, generateOrderId, getTodayStartTimestamp } from '../../utils/admin.helpers';

/\*\*

- Create admin member management controller
  \*/
  export const createAdminMemberController = (db: Pool) => ({
  /\*\*
  - List all members
    \*/
    listMember: async (req: Request, res: Response): Promise<void> => {
    try {
    const validation = PaginationSchema.safeParse(req.body);
    if (!validation.success) {
    res.status(400).json({ message: 'Invalid pagination', status: false });
    return;
    }

        const { page, limit } = validation.data;
        const { users, total } = await listMembers(db, page, limit);

        const pagination = calculatePagination(page, limit, total);

        res.json({
          message: 'Success',
          status: true,
          data: users,
          pagination,
          timeStamp: getCurrentTimestamp(),
        });

    } catch (error) {
    console.error('List member error:', error);
    res.status(500).json({ message: 'Internal server error', status: false });
    }
    },

/\*\*

- List all CTVs
  \*/
  listCTV: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = ListCTVSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid pagination', status: false });
  return;
  }

      const { page, limit } = validation.data;
      const { users, total } = await listCTV(db, page, limit);

      const pagination = calculatePagination(page, limit, total);

      res.json({
        message: 'Success',
        status: true,
        data: users,
        pagination,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('List CTV error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get user info with referral hierarchy
  \*/
  userInfo: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = UserInfoSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid input', status: false });
  return;
  }

      const { phone } = validation.data;
      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: 'User not found', status: false });
        return;
      }

      // Get F1 (direct)
      const f1 = await getDirectSubordinates(db, user.referralCode);
      const f1Ids = f1.map(u => u.id);

      // Get F2
      const f2 = f1Ids.length > 0 ? await getSubordinatesByLevel(db, f1Ids) : [];
      const f2Ids = f2.map(u => u.id);

      // Get F3
      const f3 = f2Ids.length > 0 ? await getSubordinatesByLevel(db, f2Ids) : [];
      const f3Ids = f3.map(u => u.id);

      // Get F4
      const f4 = f3Ids.length > 0 ? await getSubordinatesByLevel(db, f3Ids) : [];

      const todayStart = getTodayStartTimestamp();

      res.json({
        message: 'Success',
        status: true,
        data: {
          user: {
            id: user.id,
            phone: user.phone,
            userName: user.userName,
            balance: user.balance,
            referralCode: user.referralCode,
            userLevel: user.userLevel,
            status: user.status,
            createdAt: user.createdAt,
          },
          referralHierarchy: {
            f1: f1.map(u => ({ id: u.id, phone: u.phone, userName: u.userName, createdAt: u.createdAt })),
            f2: f2.map(u => ({ id: u.id, phone: u.phone, userName: u.userName, createdAt: u.createdAt })),
            f3: f3.map(u => ({ id: u.id, phone: u.phone, userName: u.userName, createdAt: u.createdAt })),
            f4: f4.map(u => ({ id: u.id, phone: u.phone, userName: u.userName, createdAt: u.createdAt })),
          },
          stats: {
            f1Count: f1.length,
            f2Count: f2.length,
            f3Count: f3.length,
            f4Count: f4.length,
            todayF1: f1.filter(u => u.createdAt >= todayStart).length,
            todayF2: f2.filter(u => u.createdAt >= todayStart).length,
            todayF3: f3.filter(u => u.createdAt >= todayStart).length,
            todayF4: f4.filter(u => u.createdAt >= todayStart).length,
          },
        },
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('User info error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get platform statistics
  _/
  statistical2: async (req: Request, res: Response): Promise<void> => {
  try {
  // Get user stats
  const [userStats] = await db.execute(
  `SELECT
  COUNT(_) as totalUsers,
  SUM(CASE WHEN createdAt >= ? THEN 1 ELSE 0 END) as todayUsers
  FROM users`,
  [getTodayStartTimestamp()]
  );

      // Get deposit stats
      const todayDeposits = await getTodayDeposits();

      // Get withdrawal stats
      const todayWithdrawals = await getTodayWithdrawals();

      // Get game stats
      const gameStats = await getGameStatistics(db);

      res.json({
        message: 'Success',
        status: true,
        data: {
          users: (userStats as any[])[0],
          deposits: todayDeposits,
          withdrawals: todayWithdrawals,
          games: gameStats,
        },
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Statistical error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get all deposits (pending + processed)
  \*/
  recharge: async (req: Request, res: Response): Promise<void> => {
  try {
  const pending = await getPendingDeposits(db);
  const processed = await getProcessedDeposits(db);

      res.json({
        message: 'Success',
        status: true,
        data: {
          pending,
          processed,
        },
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Recharge list error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Approve or reject deposit
  \*/
  rechargeDuyet: async (req: Request, res: Response): Promise<void> => {
  const connection = await db.getConnection();


    try {
      await connection.beginTransaction();

      const validation = RechargeActionSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: 'Invalid input', status: false });
        return;
      }

      const { id, type, utrNumber } = validation.data;
      const deposit = await getDepositById(db, id);

      if (!deposit) {
        res.status(404).json({ message: 'Deposit not found', status: false });
        return;
      }

      if (deposit.status !== 0) {
        res.status(400).json({ message: 'Deposit already processed', status: false });
        return;
      }

      if (type === 'confirm') {
        // Update deposit status
        await updateDepositStatus(db, id, 2, utrNumber);

        // Calculate bonus (15% first deposit, 5% subsequent)
        const [firstDeposit] = await connection.execute(
          'SELECT COUNT(*) as count FROM deposits WHERE userId = ? AND status = 2 AND id != ?',
          [deposit.userId, id]
        );

        const isFirstDeposit = (firstDeposit as any[])[0].count === 0;
        const bonusRate = isFirstDeposit ? 0.15 : 0.05;
        const bonusAmount = deposit.amount * bonusRate;

        // Add deposit amount + bonus to user balance
        const totalCredit = deposit.amount + bonusAmount;
        await updateUserBalance(db, deposit.userId, totalCredit);

        // Calculate and distribute commission if applicable
        if (deposit.amount >= 10000) {
          await distributeDepositCommission(connection, deposit.userId, deposit.amount, id);
        }

        await connection.commit();

        res.json({
          message: 'Deposit approved successfully',
          status: true,
          data: { bonusAmount, isFirstDeposit },
          timeStamp: getCurrentTimestamp(),
        });
      } else {
        // Cancel deposit
        await updateDepositStatus(db, id, 3);
        await connection.commit();

        res.json({
          message: 'Deposit rejected',
          status: true,
          timeStamp: getCurrentTimestamp(),
        });
      }
    } catch (error) {
      await connection.rollback();
      console.error('Recharge duyet error:', error);
      res.status(500).json({ message: 'Internal server error', status: false });
    } finally {
      connection.release();
    }

},

/\*\*

- Handle withdrawal approval/rejection
  \*/
  handlWithdraw: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = WithdrawActionSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid input', status: false });
  return;
  }

      const { id, type, reason } = validation.data;
      const withdrawal = await getWithdrawalById(db, id);

      if (!withdrawal) {
        res.status(404).json({ message: 'Withdrawal not found', status: false });
        return;
      }

      if (withdrawal.status !== 0) {
        res.status(400).json({ message: 'Withdrawal already processed', status: false });
        return;
      }

      if (type === 'confirm') {
        await updateWithdrawalStatus(db, id, 2);
        res.json({
          message: 'Withdrawal approved',
          status: true,
          timeStamp: getCurrentTimestamp(),
        });
      } else {
        // Reject and refund
        await updateWithdrawalStatus(db, id, 3, reason);
        await updateUserBalance(db, withdrawal.userId, withdrawal.amount);

        res.json({
          message: 'Withdrawal rejected and refunded',
          status: true,
          timeStamp: getCurrentTimestamp(),
        });
      }

  } catch (error) {
  console.error('Handle withdraw error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get user profile with recent transactions
  \*/
  profileUser: async (req: Request, res: Response): Promise<void> => {
  try {
  const { phone } = req.params;
  const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: 'User not found', status: false });
        return;
      }

      // Get recent deposits
      const [deposits] = await db.execute(
        'SELECT * FROM deposits WHERE userId = ? ORDER BY createdAt DESC LIMIT 5',
        [user.id]
      );

      // Get recent withdrawals
      const [withdrawals] = await db.execute(
        'SELECT * FROM withdrawals WHERE userId = ? ORDER BY requestedAt DESC LIMIT 5',
        [user.id]
      );

      // Get recent bets
      const [bets] = await db.execute(
        `SELECT b.*, gs.period FROM bets b
         JOIN gameSessions gs ON b.sessionId = gs.id
         WHERE b.userId = ? ORDER BY b.createdAt DESC LIMIT 5`,
        [user.id]
      );

      res.json({
        message: 'Success',
        status: true,
        data: {
          user: {
            id: user.id,
            phone: user.phone,
            userName: user.userName,
            balance: user.balance,
            referralCode: user.referralCode,
            status: user.status,
          },
          recentActivity: {
            deposits,
            withdrawals,
            bets,
          },
        },
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Profile user error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get user's deposit history
  \*/
  listRechargeMem: async (req: Request, res: Response): Promise<void> => {
  try {
  const { phone } = req.params;
  const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: 'User not found', status: false });
        return;
      }

      const [deposits] = await db.execute(
        'SELECT * FROM deposits WHERE userId = ? ORDER BY createdAt DESC',
        [user.id]
      );

      res.json({
        message: 'Success',
        status: true,
        data: deposits,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('List recharge mem error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get user's withdrawal history
  \*/
  listWithdrawMem: async (req: Request, res: Response): Promise<void> => {
  try {
  const { phone } = req.params;
  const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: 'User not found', status: false });
        return;
      }

      const [withdrawals] = await db.execute(
        'SELECT * FROM withdrawals WHERE userId = ? ORDER BY requestedAt DESC',
        [user.id]
      );

      res.json({
        message: 'Success',
        status: true,
        data: withdrawals,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('List withdraw mem error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get user's bet history
  \*/
  listBet: async (req: Request, res: Response): Promise<void> => {
  try {
  const { phone } = req.params;
  const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: 'User not found', status: false });
        return;
      }

      const [bets] = await db.execute(
        `SELECT b.*, gt.name as gameName, gs.period
         FROM bets b
         JOIN gameTypes gt ON b.gameTypeId = gt.id
         JOIN gameSessions gs ON b.sessionId = gs.id
         WHERE b.userId = ? ORDER BY b.createdAt DESC`,
        [user.id]
      );

      res.json({
        message: 'Success',
        status: true,
        data: bets,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('List bet error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get CTV dashboard data
  \*/
  infoCtv: async (req: Request, res: Response): Promise<void> => {
  try {
  const { phone } = req.body;
  const user = await findUserByPhone(db, phone);

      if (!user || user.userLevel !== 2) {
        res.status(404).json({ message: 'CTV not found', status: false });
        return;
      }

      // Get referral stats
      const f1 = await getDirectSubordinates(db, user.referralCode);
      const f1Ids = f1.map(u => u.id);
      const f2 = f1Ids.length > 0 ? await getSubordinatesByLevel(db, f1Ids) : [];
      const f2Ids = f2.map(u => u.id);
      const f3 = f2Ids.length > 0 ? await getSubordinatesByLevel(db, f2Ids) : [];
      const f3Ids = f3.map(u => u.id);
      const f4 = f3Ids.length > 0 ? await getSubordinatesByLevel(db, f3Ids) : [];

      const todayStart = getTodayStartTimestamp();

      // Get commission data
      const [commissionData] = await db.execute(
        `SELECT
          COALESCE(SUM(CASE WHEN createdAt >= ? THEN amount ELSE 0 END), 0) as todayCommission,
          COALESCE(SUM(amount), 0) as totalCommission
         FROM commissionRecords WHERE userId = ?`,
        [todayStart, user.id]
      );

      const ctvData: CTVInfoData = {
        ctvId: user.id,
        ctvName: user.userName,
        f1Count: f1.length,
        f2Count: f2.length,
        f3Count: f3.length,
        f4Count: f4.length,
        todayF1: f1.filter(u => u.createdAt >= todayStart).length,
        todayF2: f2.filter(u => u.createdAt >= todayStart).length,
        todayF3: f3.filter(u => u.createdAt >= todayStart).length,
        todayF4: f4.filter(u => u.createdAt >= todayStart).length,
        totalCommission: (commissionData as any[])[0]?.totalCommission || 0,
        todayCommission: (commissionData as any[])[0]?.todayCommission || 0,
      };

      res.json({
        message: 'Success',
        status: true,
        data: ctvData,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Info CTV error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get commission levels
  \*/
  getLevelInfo: async (req: Request, res: Response): Promise<void> => {
  try {
  const levels = await getCommissionLevels(db);
      res.json({
        message: 'Success',
        status: true,
        data: levels,
        timeStamp: getCurrentTimestamp(),
      });
  } catch (error) {
  console.error('Get level info error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Update commission level
  \*/
  updateLevel: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = UpdateLevelSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid input', status: false });
  return;
  }

      const { level, rateF1, rateF2, rateF3, rateF4, minTurnover } = validation.data;

      await updateCommissionLevel(db, level, {
        rateF1: rateF1 / 100, // Convert percentage to decimal
        rateF2: rateF2 / 100,
        rateF3: rateF3 / 100,
        rateF4: rateF4 / 100,
        minTurnover,
      });

      res.json({
        message: 'Commission level updated',
        status: true,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Update level error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Create salary record
  \*/
  CreatedSalary: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = CreateSalarySchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid input', status: false });
  return;
  }

      const { phone, amount, type } = validation.data;
      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: 'User not found', status: false });
        return;
      }

      // Calculate period dates
      const now = new Date();
      let periodStart: Date, periodEnd: Date;

      if (type === 'daily') {
        periodStart = new Date(now.setHours(0, 0, 0, 0));
        periodEnd = new Date(now.setHours(23, 59, 59, 999));
      } else if (type === 'weekly') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        periodStart = new Date(now.setDate(diff));
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 6);
      } else {
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }

      const salaryId = await createSalaryRecord(db, {
        userId: user.id,
        amount,
        type,
        periodStart: periodStart.toISOString().split('T')[0],
        periodEnd: periodEnd.toISOString().split('T')[0],
      });

      res.json({
        message: 'Salary record created',
        status: true,
        data: { salaryId },
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Created salary error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get salary records
  \*/
  getSalary: async (req: Request, res: Response): Promise<void> => {
  try {
  const { phone } = req.query;
  const records = await getSalaryRecords(db, phone as string | undefined);

      res.json({
        message: 'Success',
        status: true,
        data: records,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Get salary error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Adjust user balance (buff)
  \*/
  settingBuff: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = SettingBuffSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid input', status: false });
  return;
  }

      const { phone, amount, type, reason } = validation.data;
      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: 'User not found', status: false });
        return;
      }

      const adjustment = type === 'add' ? amount : -amount;
      await updateUserBalance(db, user.id, adjustment);

      // Log the adjustment
      await db.execute(
        `INSERT INTO balanceAdjustments (userId, amount, type, reason, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [user.id, amount, type, reason, getCurrentTimestamp()]
      );

      res.json({
        message: `Balance ${type === 'add' ? 'added' : 'subtracted'} successfully`,
        status: true,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Setting buff error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Create bonus/red envelope
  \*/
  createBonus: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = CreateBonusSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid input', status: false });
  return;
  }

      const { amount, count, userId } = validation.data;
      const envelopeId = generateOrderId('ENV');
      const expiredAt = getCurrentTimestamp() + (24 * 60 * 60 * 1000); // 24 hours

      const envelopeDbId = await createRedEnvelope(db, {
        envelopeId,
        creatorId: userId,
        totalAmount: amount,
        totalCount: count,
        expiredAt,
      });

      res.json({
        message: 'Red envelope created',
        status: true,
        data: { envelopeId, id: envelopeDbId },
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Create bonus error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- List red envelopes
  \*/
  listRedenvelops: async (req: Request, res: Response): Promise<void> => {
  try {
  const { creatorId } = req.query;
  const envelopes = await getRedEnvelopes(
  db,
  creatorId ? parseInt(creatorId as string) : undefined
  );

      res.json({
        message: 'Success',
        status: true,
        data: envelopes,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('List red envelopes error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get all settings
  \*/
  settingGet: async (req: Request, res: Response): Promise<void> => {
  try {
  const configs = await getAdminConfigs(db);
  const paymentMethods = await getPaymentMethods(db);

      res.json({
        message: 'Success',
        status: true,
        data: {
          configs,
          paymentMethods,
        },
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Setting get error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Update bank/UPI settings
  \*/
  settingBank: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = SettingBankSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid input', status: false });
  return;
  }

        const { type, ...data } = validation.data;
        await updatePaymentMethod(db, type, data);

        res.json({
          message: 'Payment method updated',
          status: true,
          timeStamp: getCurrentTimestamp(),
        });
      } catch (error) {
        console.error('Setting bank error:', error);
        res.status(500).json({ message: 'Internal server error', status: false });
      }

  },
  });

// Helper function for commission distribution
async function distributeDepositCommission(connection: any, userId: number, amount: number, depositId: number): Promise<void> {
// Get referrer chain
let currentId = userId;
const referrers: Array<{ id: number; level: number }> = [];

for (let i = 0; i < 4; i++) {
const [rows] = await connection.execute(
'SELECT invitedBy FROM users WHERE id = ?',
[currentId]
);

    if ((rows as any[]).length === 0 || !(rows as any[])[0].invitedBy) break;
    currentId = (rows as any[])[0].invitedBy;
    referrers.push({ id: currentId, level: i + 1 });

}

if (referrers.length === 0) return;

// Get commission rates
const [levelRows] = await connection.execute(
'SELECT rateF1, rateF2, rateF3, rateF4 FROM commissionLevels WHERE level = 0 LIMIT 1'
);

if ((levelRows as any[]).length === 0) return;

const rates = (levelRows as any[])[0];

for (const ref of referrers) {
const rateKey = `rateF${ref.level}` as keyof typeof rates;
const rate = rates[rateKey] as number;

    if (!rate || rate <= 0) continue;

    const commission = (amount / 100) * rate;

    if (commission <= 0) continue;

    await connection.execute(
      `INSERT INTO commissionRecords (userId, fromUserId, level, amount, sourceType, sourceId, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ref.id, userId, ref.level, commission, 'deposit', depositId, Date.now()]
    );

    await connection.execute(
      'UPDATE users SET balance = balance + ? WHERE id = ?',
      [commission, ref.id]
    );

}
}

// ============================================================================
// File: src/controllers/admin/adminGame.controller.ts
// ============================================================================

import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import {
TotalJoinSchema,
EditResultSchema,
AdminApiResponse,
} from '../../types/admin.types';
import { getTotalJoin, updateAdminConfig, findUserByPhone } from '../../db/admin.queries';
import { getCurrentTimestamp, getTodayString } from '../../utils/admin.helpers';

/\*\*

- Create admin game controller
  \*/
  export const createAdminGameController = (db: Pool) => ({
  /\*\*
  - Get total join statistics by game type
    \*/
    totalJoin: async (req: Request, res: Response): Promise<void> => {
    try {
    const validation = TotalJoinSchema.safeParse(req.body);
    if (!validation.success) {
    res.status(400).json({ message: 'Invalid input', status: false });
    return;
    }

        const { gameJoin } = validation.data;
        const gameTypeMap: Record<string, number> = {
          '1': 1, // wingo 1min
          '3': 2, // wingo 3min
          '5': 3, // wingo 5min
          '10': 4, // wingo 10min
        };

        const gameTypeId = gameTypeMap[gameJoin];
        const stats = await getTotalJoin(db, gameTypeId);

        res.json({
          message: 'Success',
          status: true,
          data: stats,
          timeStamp: getCurrentTimestamp(),
        });

    } catch (error) {
    console.error('Total join error:', error);
    res.status(500).json({ message: 'Internal server error', status: false });
    }
    },

/\*\*

- Get historical game results (5D)
  _/
  listOrderOld: async (req: Request, res: Response): Promise<void> => {
  try {
  const { gameJoin, pageno, pageto } = req.body;
  const offset = pageno _ pageto;

      const [rows] = await db.execute(
        `SELECT gs.*, gt.name as gameName
         FROM gameSessions gs
         JOIN gameTypes gt ON gs.gameTypeId = gt.id
         WHERE gt.name LIKE '%5D%' AND gt.duration = ?
         ORDER BY gs.id DESC LIMIT ? OFFSET ?`,
        [parseInt(gameJoin), pageto, offset]
      );

      const [current] = await db.execute(
        `SELECT period FROM gameSessions
         WHERE gameTypeId = (SELECT id FROM gameTypes WHERE name = '5D' AND duration = ? LIMIT 1)
         ORDER BY id DESC LIMIT 1`,
        [parseInt(gameJoin)]
      );

      res.json({
        code: 0,
        msg: 'Get success',
        data: {
          gameslist: rows,
        },
        period: (current as any[])[0]?.period || '',
        page: pageno,
        status: true,
      });

  } catch (error) {
  console.error('List order old error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get K3 historical results
  _/
  listOrderOldK3: async (req: Request, res: Response): Promise<void> => {
  try {
  const { gameJoin, pageno, pageto } = req.body;
  const offset = pageno _ pageto;

      const [rows] = await db.execute(
        `SELECT gs.*, gt.name as gameName
         FROM gameSessions gs
         JOIN gameTypes gt ON gs.gameTypeId = gt.id
         WHERE gt.name LIKE '%K3%' AND gt.duration = ?
         ORDER BY gs.id DESC LIMIT ? OFFSET ?`,
        [parseInt(gameJoin), pageto, offset]
      );

      const [current] = await db.execute(
        `SELECT period FROM gameSessions
         WHERE gameTypeId = (SELECT id FROM gameTypes WHERE name = 'K3' AND duration = ? LIMIT 1)
         ORDER BY id DESC LIMIT 1`,
        [parseInt(gameJoin)]
      );

      res.json({
        code: 0,
        msg: 'Get success',
        data: {
          gameslist: rows,
        },
        period: (current as any[])[0]?.period || '',
        page: pageno,
        status: true,
      });

  } catch (error) {
  console.error('List order old K3 error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Edit 5D result settings
  \*/
  editResult: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = EditResultSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid input', status: false });
  return;
  }

      const { game, list } = validation.data;
      const configKey = `5d${game}_control`;

      await updateAdminConfig(db, configKey, list);

      res.json({
        message: '5D result settings updated',
        status: true,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Edit result error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Edit K3 result settings
  \*/
  editResult2: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = EditResultSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid input', status: false });
  return;
  }

      const { game, list } = validation.data;
      const configKey = `k3${game}_control`;

      await updateAdminConfig(db, configKey, list);

      res.json({
        message: 'K3 result settings updated',
        status: true,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Edit result2 error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get phone by invite code
  \*/
  getPhoneByInvite: async (req: Request, res: Response): Promise<void> => {
  try {
  const { invite } = req.params;

      const [rows] = await db.execute(
        'SELECT phone FROM users WHERE referralCode = ?',
        [invite]
      );

      if ((rows as any[]).length === 0) {
        res.status(404).json({ message: 'Invite code not found', status: false });
        return;
      }

      res.json({
        message: 'Success',
        status: true,
        data: { phone: (rows as any[])[0].phone },
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Get phone by invite error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get user count by invite code
  \*/
  getUserByCode: async (req: Request, res: Response): Promise<void> => {
  try {
  const { code } = req.params;

      const [rows] = await db.execute(
        `SELECT COUNT(*) as count FROM users
         WHERE invitedBy = (SELECT id FROM users WHERE referralCode = ?)`,
        [code]
      );

      res.json({
        message: 'Success',
        status: true,
        data: { count: (rows as any[])[0].count },
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Get user by code error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get all referred users by code
  \*/
  getReferredUsers: async (req: Request, res: Response): Promise<void> => {
  try {
  const { code } = req.params;

        const [rows] = await db.execute(
          `SELECT u.id, u.phone, u.userName, u.createdAt, u.balance
           FROM users u
           JOIN users inviter ON u.invitedBy = inviter.id
           WHERE inviter.referralCode = ?
           ORDER BY u.createdAt DESC`,
          [code]
        );

        res.json({
          message: 'Success',
          status: true,
          data: rows,
          timeStamp: getCurrentTimestamp(),
        });
      } catch (error) {
        console.error('Get referred users error:', error);
        res.status(500).json({ message: 'Internal server error', status: false });
      }

  },
  });

// ============================================================================
// File: src/routes/admin.routes.ts
// ============================================================================

import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { adminAuthMiddleware } from '../middleware/adminAuth.middleware';
import { createAdminAuthController } from '../controllers/admin/adminAuth.controller';
import { createAdminMemberController } from '../controllers/admin/adminMember.controller';
import { createAdminGameController } from '../controllers/admin/adminGame.controller';

export const createAdminRoutes = (db: Pool): Router => {
const router = Router();

const authController = createAdminAuthController(db);
const memberController = createAdminMemberController(db);
const gameController = createAdminGameController(db);

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.use(adminAuthMiddleware(db));

// Member management
router.post('/listMember', memberController.listMember);
router.post('/listCTV', memberController.listCTV);
router.post('/userInfo', memberController.userInfo);
router.get('/profileUser/:phone', memberController.profileUser);
router.post('/infoCtv', memberController.infoCtv);

// Statistics
router.get('/statistical2', memberController.statistical2);
