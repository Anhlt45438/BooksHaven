import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { RolesType } from "~/constants/enum";
import databaseServices from "~/services/database.services";

export const checkUserRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.user_id;
      // Get user's roles from ChiTietVaiTro
      const userRoles = await databaseServices.chiTietVaiTro
        .aggregate([
          {
            $match: {
              id_user: new ObjectId(userId)
            }
          },
          {
            $lookup: {
              from: process.env.DB_ROLES_VAI_TRO_COLLECTION || '',
              localField: "id_role",
              foreignField: "id_role",
              as: "role_info"
            }
          },
          {
            $unwind: "$role_info"
          },
          {
            $project: {
              ten_role: "$role_info.ten_role"
            }
          }
        ]).toArray();

      // Extract role names
      const userRoleNames = userRoles.map(role => role.ten_role);

      // Check if user has any of the allowed roles
      const hasAllowedRole = userRoleNames.some(role => allowedRoles.includes(role));

      if (!hasAllowedRole) {
        return res.status(403).json({
          message: "You don't have permission to access this resource"
        });
      }

      // Add roles to request for later use if needed
      (req as any).userRoles = userRoleNames;
      next();
    } catch (error) {
      console.error("Role check error:", error);
      return res.status(401).json({
        message: "Invalid token or role verification failed"
      });
    }
  };
};