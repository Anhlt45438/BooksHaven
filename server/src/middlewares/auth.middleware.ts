import { Request, Response, NextFunction } from "express";
import { UserPayload } from "~/types/user.type";
import { verifyToken } from "~/untils/jwt";

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
    const decoded = await verifyToken(token, process.env.PRIVATE_KEY_JWT) as UserPayload;
    req.decoded = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "invalid accessToken" });
  }
};


