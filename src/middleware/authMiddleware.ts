import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized!" });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = verifyToken(token);
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token!" });
  }
}
