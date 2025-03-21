import { Router } from 'express';
import { sendNotificationToUser, sendNotificationByRole, getUserNotifications, markNotificationAsRead, sendFeedbackToAdmins } from '~/controllers/notifications.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { checkUserRole } from '~/middlewares/role.middleware';
import { RolesType } from '~/constants/enum';

const notificationsRouter = Router();

notificationsRouter.post(
  '/send-to-user',
  authMiddleware,
  checkUserRole([RolesType.Admin]),
  sendNotificationToUser
);

notificationsRouter.post(
  '/send-by-role',
  authMiddleware,
  checkUserRole([RolesType.Admin]),
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
  sendFeedbackToAdmins
);

export default notificationsRouter;