import { Server, Socket } from 'socket.io';
import { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: {
      id: number;
      phone: string;
      level: number;
    };
  };
}

interface UserAuthRow extends RowDataPacket {
  id: number;
  phone: string;
  level: number;
  status: number;
}

export const createGameSocketService = (io: Server, db: Pool) => {
  // Authentication middleware for socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const [rows] = await db.execute<UserAuthRow[]>(
        `SELECT id, phone, level, status FROM users
         WHERE token = ? AND isVerified = TRUE`,
        [token]
      );

      if (rows.length === 0) {
        return next(new Error('Invalid token'));
      }

      const user = rows[0];

      if (user.status !== 1) {
        return next(new Error('Account suspended'));
      }

      // Attach user to socket
      socket.data.user = {
        id: user.id,
        phone: user.phone,
        level: user.level,
      };

      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`Client connected: ${socket.id}, User: ${socket.data.user?.phone}`);

    // Join game-specific rooms
    socket.on('join-game', (game: string) => {
      if (!game || typeof game !== 'string') {
        socket.emit('error', { message: 'Invalid game parameter' });
        return;
      }

      // Leave previous game rooms
      socket.rooms.forEach(room => {
        if (room.startsWith('game-')) {
          socket.leave(room);
        }
      });

      // Join new game room
      const roomName = `game-${game}`;
      socket.join(roomName);
      console.log(`User ${socket.data.user?.phone} joined ${roomName}`);

      socket.emit('joined-game', { game, status: 'success' });
    });

    // Wingo results broadcast (from cron jobs)
    socket.on('data-server', (msg) => {
      // Only allow server/cron to broadcast, not clients
      if (socket.data.user?.level !== 1) {
        socket.emit('error', { message: 'Unauthorized broadcast attempt' });
        return;
      }
      io.emit('data-server', msg);
    });

    // 5D results broadcast
    socket.on('data-server-5', (msg) => {
      if (socket.data.user?.level !== 1) {
        socket.emit('error', { message: 'Unauthorized broadcast attempt' });
        return;
      }
      io.emit('data-server-5', msg);
    });

    // K3 results broadcast
    socket.on('data-server-k3', (msg) => {
      if (socket.data.user?.level !== 1) {
        socket.emit('error', { message: 'Unauthorized broadcast attempt' });
        return;
      }
      io.emit('data-server-k3', msg);
    });

    // Handle client ping for connection keepalive
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  // Helper methods for emitting from cron jobs and services
  return {
    emitWingoResults: (data: unknown, gameName: string) => {
      io.emit('data-server', {
        data,
        game: gameName,
        timestamp: Date.now()
      });
      // Also emit to specific game room
      io.to(`game-${gameName}`).emit('game-update', { data, type: 'wingo' });
    },

    emit5DResults: (data: unknown, game: string) => {
      io.emit('data-server-5d', {
        data,
        game,
        timestamp: Date.now()
      });
      io.to(`game-5d-${game}`).emit('game-update', { data, type: '5d' });
    },

    emitK3Results: (data: unknown, game: string) => {
      io.emit('data-server-k3', {
        data,
        game,
        timestamp: Date.now()
      });
      io.to(`game-k3-${game}`).emit('game-update', { data, type: 'k3' });
    },

    emitToUser: (userId: number, event: string, data: unknown) => {
      // Find socket by user ID and emit
      io.sockets.sockets.forEach((socket: AuthenticatedSocket) => {
        if (socket.data.user?.id === userId) {
          socket.emit(event, data);
        }
      });
    },

    emitToRoom: (room: string, event: string, data: unknown) => {
      io.to(room).emit(event, data);
    },
  };
};
