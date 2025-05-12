import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/password";
import { generateToken } from "../utils/token";

export async function registerUserService(data: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}) {
  const existingUser = await User.findOne({ where: { email: data.email } });
  if (existingUser) {
    throw new Error("email already exists");
  }

  const hashedPassword = await hashPassword(data.password);
  const user = await User.create({
    ...data,
    password: hashedPassword,
    role: data.role || "user",
  });
  return user;
}

export async function loginUserService(email: string, password: string) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("invalid email or password!");
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("invalid email or password!");
  }
  return generateToken({ id: user.id, email: user.email, role: user.role });
}
