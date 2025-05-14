import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

export function generateToken(payload: {
  id: number;
  email: string;
  role: string;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "10m" });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

// import { SignJWT, jwtVerify } from "jose";

// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// export async function generateToken(payload: {
//   id: number;
//   email: string;
//   role: string;
// }): Promise<string> {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("10m")
//     .sign(JWT_SECRET);
// }

// export async function verifyToken(token: string): Promise<any> {
//   const { payload } = await jwtVerify(token, JWT_SECRET);
//   return payload;
// }
