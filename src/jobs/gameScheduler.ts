import cron from 'node-cron';
import { Pool } from 'mysql2/promise';
import { Server } from 'socket.io';
import { addWingoHandler } from '../services/wingo/wingoGame.service';
import { handlingWingoHandler } from '../services/wingo/wingoResult.service';
import { add5dHandler } from '../services/5d/5dGame.service';
import { handling5DHandler } from '../services/5d/5dResult.service';
import { addK3Handler } from '../services/k3/k3Game.service';
import { handlingK3Handler } from '../services/k3/k3Result.service';
import { RowDataPacket } from 'mysql2';

interface WingoResult extends RowDataPacket {
  id: number;
  game: string;
  result: number;
  status: number;
  createdAt: Date;
}

interface Game5DResult extends RowDataPacket {
  id: number;
  game: number;
  result_a: number;
  result_b: number;
  result_c: number;
  result_d: number;
  result_e: number;
  status: number;
  createdAt: Date;
}

interface K3Result extends RowDataPacket {
  id: number;
  game: number;
  result_1: number;
  result_2: number;
  result_3: number;
  status: number;
  createdAt: Date;
}

const getWingoGameName = (duration: number): string => {
  const names: Record<number, string> = {
    1: 'wingo',
    3: 'wingo3',
    5: 'wingo5',
    10: 'wingo10',
  };
  return names[duration] || 'wingo';
};

export const createGameScheduler = (db: Pool, io: Server) => {
  // Wingo 1 minute
  cron.schedule('*/1 * * * *', async () => {
    await processWingoGame(db, io, 1);
  });

  // Wingo 3 minutes
  cron.schedule('*/3 * * * *', async () => {
    await processWingoGame(db, io, 3);
  });

  // Wingo 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    await processWingoGame(db, io, 5);
  });

  // Wingo 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    await processWingoGame(db, io, 10);
  });

  // 5D games
  cron.schedule('*/1 * * * *', async () => {
    await process5DGame(db, io, 1);
  });

  cron.schedule('*/3 * * * *', async () => {
    await process5DGame(db, io, 3);
  });

  cron.schedule('*/5 * * * *', async () => {
    await process5DGame(db, io, 5);
  });

  cron.schedule('*/10 * * * *', async () => {
    await process5DGame(db, io, 10);
  });

  // K3 games
  cron.schedule('*/1 * * * *', async () => {
    await processK3Game(db, io, 1);
  });

  cron.schedule('*/3 * * * *', async () => {
    await processK3Game(db, io, 3);
  });

  cron.schedule('*/5 * * * *', async () => {
    await processK3Game(db, io, 5);
  });

  cron.schedule('*/10 * * * *', async () => {
    await processK3Game(db, io, 10);
  });

  // Daily reset at midnight
  cron.schedule('0 0 * * *', async () => {
    await resetDailyCounters(db);
  });

  console.log('✅ Game scheduler initialized');
};

const processWingoGame = async (db: Pool, io: Server, duration: number) => {
  const gameName = getWingoGameName(duration);

  try {
    // 1. Add new period
    await addWingoHandler(db)(duration);

    // 2. Process results and payouts
    await handlingWingoHandler(db)(duration);

    // 3. Get latest results
    const [results] = await db.execute<WingoResult[]>(
      `SELECT * FROM wingo WHERE game = ? ORDER BY id DESC LIMIT 2`,
      [gameName]
    );

    // 4. Emit to Socket.io
    io.emit('data-server', {
      data: results,
      game: gameName,
      timestamp: Date.now()
    });

    console.log(`[${new Date().toISOString()}] Processed Wingo ${duration}min`);

  } catch (error) {
    console.error(`Error processing Wingo ${duration}min:`, error);
  }
};

const process5DGame = async (db: Pool, io: Server, duration: number) => {
  try {
    await add5dHandler(db)(duration);
    await handling5DHandler(db)(duration);

    const [results] = await db.execute<Game5DResult[]>(
      `SELECT * FROM 5d WHERE game = ? ORDER BY id DESC LIMIT 2`,
      [duration]
    );

    io.emit('data-server-5d', {
      data: results,
      game: String(duration),
      timestamp: Date.now()
    });

    console.log(`[${new Date().toISOString()}] Processed 5D ${duration}min`);

  } catch (error) {
    console.error(`Error processing 5D ${duration}min:`, error);
  }
};

const processK3Game = async (db: Pool, io: Server, duration: number) => {
  try {
    await addK3Handler(db)(duration);
    await handlingK3Handler(db)(duration);

    const [results] = await db.execute<K3Result[]>(
      `SELECT * FROM k3 WHERE game = ? ORDER BY id DESC LIMIT 2`,
      [duration]
    );

    io.emit('data-server-k3', {
      data: results,
      game: String(duration),
      timestamp: Date.now()
    });

    console.log(`[${new Date().toISOString()}] Processed K3 ${duration}min`);

  } catch (error) {
    console.error(`Error processing K3 ${duration}min:`, error);
  }
};

const resetDailyCounters = async (db: Pool) => {
  try {
    await db.execute('UPDATE users SET roses_today = 0');
    await db.execute('UPDATE userPoints SET points = 0 WHERE currentLevel = 2');
    console.log(`[${new Date().toISOString()}] Daily counters reset successfully`);
  } catch (error) {
    console.error('Error resetting daily counters:', error);
  }
};
