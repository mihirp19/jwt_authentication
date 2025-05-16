import { Response, Request, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Unhandled error:", err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const errMessage = err.message || "Internal server error";

  res.status(statusCode).json({ error: errMessage });
}
