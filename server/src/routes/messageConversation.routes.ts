import { Router } from 'express';
import { 
  createConversation, 
  getUserConversations, 
  sendMessage, 
  getConversationMessages,
  markMessageAsRead, 
} from '~/controllers/messageConversation.controllers';
import { authMiddleware } from '~/middlewares/auth.middleware';

const messageRouter = Router();

messageRouter.post(
  '/',
  authMiddleware,
  createConversation
);

messageRouter.get(
  '/',
  authMiddleware,
  getUserConversations
);

messageRouter.post(
  '/messages',
  authMiddleware,
  sendMessage
);

messageRouter.get(
  '/:conversationId/messages',
  authMiddleware,
  getConversationMessages
);

messageRouter.patch(
  '/messages/:messageId/read',
  authMiddleware,
  markMessageAsRead
);

export default messageRouter;