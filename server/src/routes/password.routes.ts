import { Router } from 'express';
import { handleValidationErrors } from '~/middlewares/notifications.middleware';
import { validateForgotPassword } from '~/middlewares/users.middlewares';
import { forgotPassword, resetPassword } from '~/controllers/users.controllers';

const passwordRouter = Router();

passwordRouter.post(
  '/forgot-password',
  validateForgotPassword,
  handleValidationErrors,
  forgotPassword
);

passwordRouter.post(
  '/reset-password',
  handleValidationErrors,
  resetPassword
);

export default passwordRouter;