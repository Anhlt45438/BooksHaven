import { Request, Response, NextFunction } from "express";
import { verifyToken } from "~/untils/jwt";
import { UserRole } from "~/types/user.type";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.header("Authorization");
  if (!authorizationHeader || !authorizationHeader.split(" ")[1]) {
    return res.status(400).json({
      message: "Authorization header is missing",
    });
  }
  try {
    const token = authorizationHeader.split(" ")[1];
    const decode = await verifyToken(token, process.env.PRIVATE_KEY_JWT);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "invalid accessToken" });
  }
};
export const checkRole = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorizationHeader = req.header("Authorization");
      if (!authorizationHeader || !authorizationHeader.split(" ")[1]) {
        return res.status(400).json({
          message: "Authorization header is missing",
        });
      }

      const token = authorizationHeader.split(" ")[1];
      const decoded = await verifyToken(token, process.env.PRIVATE_KEY_JWT);
      
      // Check if user role is allowed
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({
          message: "You don't have permission to access this resource",
        });
      }

      // Add user info to request for later use
      (req as any).user = {
        user_id: decoded.user_id,
        email: decoded.email,
        role: decoded.role
      };
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Invalid access token" });
    }
  };
};

// Usage examples:
// For admin only routes: checkRole([UserRole.ADMIN])
// For shop only routes: checkRole([UserRole.SHOP])
// For user only routes: checkRole([UserRole.USER])
// For multiple roles: checkRole([UserRole.ADMIN, UserRole.SHOP])
