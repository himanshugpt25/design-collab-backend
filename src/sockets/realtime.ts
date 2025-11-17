import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

interface JoinDesignPayload {
  designId: string;
  userInfo: {
    userId: string;
    name: string;
    color?: string;
  };
}

interface LeaveDesignPayload {
  designId: string;
}

interface DesignEventPayload {
  designId: string;
  [key: string]: unknown;
}

const NAMESPACE = '/realtime';
let ioInstance: Server | null = null;

const ensureDesignId = (socket: Socket, designId: unknown): designId is string => {
  if (!designId || typeof designId !== 'string') {
    logger.warn('Realtime.invalidDesignId', { socketId: socket.id, designId });
    return false;
  }
  return true;
};

const broadcastToRoom = (socket: Socket, event: string, payload: DesignEventPayload) => {
  if (!ensureDesignId(socket, payload.designId)) {
    return;
  }
  socket.to(payload.designId).emit(event, payload);
};

const handleJoinDesign = (socket: Socket, payload: JoinDesignPayload) => {
  if (!payload || !ensureDesignId(socket, payload.designId)) {
    return;
  }

  const { designId, userInfo } = payload;
  socket.join(designId);
  socket.data.designId = designId;
  socket.data.userInfo = userInfo;

  logger.info('Realtime.design.join', {
    socketId: socket.id,
    designId,
    userId: userInfo?.userId,
  });

  socket.to(designId).emit('user-joined', {
    designId,
    user: userInfo,
  });
};

const handleLeaveDesign = (socket: Socket, payload: LeaveDesignPayload) => {
  const designId = payload?.designId || socket.data.designId;
  if (!ensureDesignId(socket, designId)) {
    return;
  }

  socket.leave(designId);
  logger.info('Realtime.design.leave', { socketId: socket.id, designId });
  socket.to(designId).emit('user-left', {
    designId,
    userId: socket.data?.userInfo?.userId,
  });
  if (socket.data.designId === designId) {
    delete socket.data.designId;
  }
};

const registerSocketHandlers = (socket: Socket) => {
  socket.on('join-design', (payload: JoinDesignPayload) => handleJoinDesign(socket, payload));
  socket.on('leave-design', (payload: LeaveDesignPayload) => handleLeaveDesign(socket, payload));

  const relayEvents = [
    'element-create',
    'element-update',
    'element-delete',
    'layer-reorder',
    'cursor-move',
    'comment-added',
  ];

  relayEvents.forEach((event) => {
    socket.on(event, (payload: DesignEventPayload) => broadcastToRoom(socket, event, payload));
  });

  socket.on('disconnect', () => {
    const designId = socket.data?.designId;
    if (designId) {
      logger.info('Realtime.design.disconnect', { socketId: socket.id, designId });
      socket.to(designId).emit('user-left', {
        designId,
        userId: socket.data?.userInfo?.userId,
      });
    }
  });
};

export const registerRealtime = (server: HttpServer): void => {
  if (ioInstance) {
    return;
  }

  ioInstance = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
  });

  const nsp = ioInstance.of(NAMESPACE);

  nsp.on('connection', (socket) => {
    logger.info('Realtime.connection', { socketId: socket.id });
    registerSocketHandlers(socket);
  });

  logger.info('Realtime.server.ready', { namespace: NAMESPACE });
};
