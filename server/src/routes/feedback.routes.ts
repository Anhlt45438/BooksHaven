import { Router } from 'express';
import { authMiddleware } from '~/middlewares/auth.middleware'; 

import {
  createFeedback,
  getUserFeedbacks,
  getAllFeedbacks,
  replyToFeedback,
  updateFeedbackStatus,
  searchFeedbacks // Add this import
} from '~/controllers/feedback.controller';
import { checkUserRole } from '~/middlewares/role.middleware';
import { RolesType } from '~/constants/enum';

const feedbackRouter = Router();

feedbackRouter.post('/', authMiddleware, (createFeedback));
feedbackRouter.get('/user', authMiddleware, (getUserFeedbacks));
feedbackRouter.get('/all', (getAllFeedbacks));

// Add new search endpoint
feedbackRouter.get('/search', authMiddleware, (searchFeedbacks));

feedbackRouter.patch('/status/:feedbackId', authMiddleware, checkUserRole([RolesType.Admin, RolesType.Shop, RolesType.User]), (updateFeedbackStatus));
feedbackRouter.post('/:feedbackId/reply', authMiddleware,checkUserRole([RolesType.Admin, RolesType.Shop, RolesType.User]), (replyToFeedback));

export default feedbackRouter;