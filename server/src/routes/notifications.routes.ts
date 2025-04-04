import { Router } from 'express';
import { sendNotificationToUser, sendNotificationByRole, getUserNotifications, markNotificationAsRead, sendFeedbackToAdmins, getNotificationsList } from '~/controllers/notifications.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { checkUserRole } from '~/middlewares/role.middleware';
import { RolesType } from '~/constants/enum';
import { 
  validateNotificationToUser, 
  validateNotificationByRole, 
  validateFeedback,
  handleValidationErrors 
} from '~/middlewares/notifications.middleware';

const notificationsRouter = Router();

notificationsRouter.post(
  '/send-to-user',
  authMiddleware,
  checkUserRole([RolesType.Admin, RolesType.Shop]),
  validateNotificationToUser,
  handleValidationErrors,
  sendNotificationToUser
);

notificationsRouter.post(
  '/send-by-role',
  authMiddleware,
  checkUserRole([RolesType.Admin]),
  validateNotificationByRole,
  handleValidationErrors,
  sendNotificationByRole
);

notificationsRouter.get(
  '/user-notifications',
  authMiddleware,
  getUserNotifications
);

notificationsRouter.patch(
  '/mark-as-read/:notification_id',
  authMiddleware,
  markNotificationAsRead
);

notificationsRouter.post(
  '/send-feedback',
  authMiddleware,
  validateFeedback,
  handleValidationErrors,
  sendFeedbackToAdmins
);

// Add this route
notificationsRouter.get(
  '/list-notifications-system',
  authMiddleware,
  checkUserRole([RolesType.Admin]),
  getNotificationsList
);

export default notificationsRouter;