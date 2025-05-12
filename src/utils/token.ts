import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

export function generateToken(payload: {
  id: number;
  email: string;
  role: string;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
