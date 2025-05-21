import User from "../models/User";
import { RefreshToken } from "../models/RefreshToken";
import { comparePassword, hashPassword } from "../utils/password";
import { generateRefreshToken, generateToken } from "../utils/token";

export async function registerUserService(data: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("Invalid email format");
  }
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
  const accessToken = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const existingToken = await RefreshToken.findOne({
    where: { userId: user.id },
  });

  if (!existingToken) {
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
    });
  } else {
    await RefreshToken.update(
      { token: refreshToken },
      { where: { userId: user.id } }
    );
  }

  return { accessToken, refreshToken };
}

export async function refreshTokenService(token: string) {
  const refToken = await RefreshToken.findOne({
    where: { token },
    include: [{ model: User }],
  });
  if (!refToken || !refToken.User) {
    return null;
  }
  const user = refToken.User;

  // Revoke old token
  await refToken.destroy();

  // Create new Refresh Token
  const newRefToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  await RefreshToken.create({
    token: newRefToken,
    userId: user.id,
  });

  return {
    user,
    newRefToken,
  };
}
