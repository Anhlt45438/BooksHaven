import { Router } from 'express';
import { getAllUsers, updateUserStatus, getUserDetails } from '~/controllers/admin.controllers';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { checkUserRole } from '~/middlewares/role.middleware';
import { RolesType } from '~/constants/enum';
import { validateUserId, validateUserStatus } from '~/middlewares/admin.middleware';
import { handleValidationErrors } from '~/middlewares/books.middleware';

const adminRouter = Router();

adminRouter.get(
  '/users',
  authMiddleware,
  checkUserRole([RolesType.Admin]),
  getAllUsers
);

adminRouter.put(
  '/users/:userId/status',
  authMiddleware,
  checkUserRole([RolesType.Admin]),
  validateUserId,
  validateUserStatus,
  handleValidationErrors,
  updateUserStatus
);

adminRouter.get(
  '/users/:userId',
  authMiddleware,
  checkUserRole([RolesType.Admin]),
  validateUserId,
  handleValidationErrors,
  getUserDetails
);

export default adminRouter;