
import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { betK3Handler } from '../controllers/k3/betK3.controller';
import { listOrderOldHandler } from '../controllers/k3/listOrderOld.controller';
import { getMyEmerdListHandler } from '../controllers/k3/getMyEmerdList.controller';
import { addK3Handler } from '../controllers/k3/addK3.controller';
import { editResultHandler } from '../controllers/k3/editResult.controller';
import { k3AuthMiddleware } from '../middleware/k3Auth.middleware';
import { Request, Response } from 'express';
import { K3ApiResponse } from '../types/k3.types';

export const createK3Routes = (db: Pool): Router => {
const router = Router();

// Public routes (admin only - should add admin middleware in production)
router.post('/admin/add-period', async (req: Request, res: Response<K3ApiResponse>) => {
try {
const { game } = req.body;
const gameNum = parseInt(game);

      if (![1, 3, 5, 10].includes(gameNum)) {
        res.status(400).json({
          message: 'Invalid game type',
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      await addK3Handler(db)(gameNum);
      res.json({
        message: 'Period added successfully',
        status: true,
        timeStamp: Date.now(),
      });
    } catch (error) {
      console.error('Add period error:', error);
      res.status(500).json({
        message: 'Failed to add period',
        status: false,
        timeStamp: Date.now(),
      });
    }

});

router.post('/admin/edit-result', editResultHandler(db));

// Protected routes (require user auth)
router.post('/bet', k3AuthMiddleware(db), betK3Handler(db));
router.post('/history', k3AuthMiddleware(db), listOrderOldHandler(db));
router.post('/my-bets', k3AuthMiddleware(db), getMyEmerdListHandler(db));

// Health check
router.get('/health', (\_req: Request, res: Response) => {
res.json({ status: 'ok', service: 'k3', timestamp: Date.now() });
});

return router;
};
