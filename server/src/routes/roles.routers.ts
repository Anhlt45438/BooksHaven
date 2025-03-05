import { Router } from "express";
import { 
  createRole, 
  deleteRole, 
  getUserRoles, 
  assignRolesToUser, 
  removeRolesFromUser 
} from "~/controllers/roles.controller";
import { authMiddleware } from "~/middlewares/auth.middleware";
import { checkUserRole } from "~/middlewares/role.middleware";
import { RolesType } from "~/constants/enum";

const rolesRouter = Router();

// Role management (Admin only)
rolesRouter.post(
  "/create", 
  // authMiddleware, 
  // checkUserRole([RolesType.Admin]), 
  createRole
);

rolesRouter.delete(
  "/:id", 
  authMiddleware, 
  checkUserRole([RolesType.Admin]), 
  deleteRole
);

// User role management (Admin only)
rolesRouter.post(
  "/assign", 
  authMiddleware, 
  checkUserRole([RolesType.User]), 
  assignRolesToUser
);

rolesRouter.delete(
  "/user/:user_id", 
  authMiddleware, 
  checkUserRole([RolesType.Admin]), 
  removeRolesFromUser
);

// Get user roles (Admin or self)
rolesRouter.get(
  "/user/:user_id", 
  authMiddleware, 
  getUserRoles
);

export default rolesRouter;