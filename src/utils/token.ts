import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretKey";
const JWT_REFRESH = process.env.JWT_REFRESH || "refreshTokenKey";

export function generateToken(payload: {
  id: number;
  email: string;
  role: string;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "3h" });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

export function generateRefreshToken(payload: {
  id: number;
  email: string;
  role: string;
}): string {
  return jwt.sign(payload, JWT_REFRESH, { expiresIn: "1d" });
}

export function verifyRefreshToken(token: string): any {
  return jwt.verify(token, JWT_REFRESH);
}
