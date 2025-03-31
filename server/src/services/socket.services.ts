import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { MessageService } from './message.services';

let io: SocketIOServer;

export const initializeSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    socket.on('send_message', async (data) => {
      try {
        const message = await MessageService.sendMessage(data, socket);
        
        io.to(data.conversation_id).emit('new_message', {
          conversation_id: data.conversation_id,
          message: {
            ...message,
            sender: data.user_id
          }
        });
      } catch (error) {
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    socket.on('mark_read', async (data) => {
      try {
        await MessageService.markAsRead(data);
        
        io.to(data.conversation_id).emit('messages_read', {
          conversation_id: data.conversation_id,
          reader: data.user_id
        });
      } catch (error) {
        socket.emit('read_status_error', { error: 'Failed to mark messages as read' });
      }
    });

    socket.on('typing', (data) => {
      const { conversation_id, user_id, is_typing } = data;
      socket.to(conversation_id).emit('typing_status', {
        conversation_id,
        user_id,
        is_typing
      });
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User left conversation: ${conversationId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};