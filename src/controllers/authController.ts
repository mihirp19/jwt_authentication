import { Request, Response } from "express";
import {
  loginUserService,
  refreshTokenService,
  registerUserService,
} from "../services/authService";
import { getUserByIdService } from "../services/userService";
import { generateToken } from "../utils/token";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Missing required fields" });
    }

    if (role && !["admin", "user"].includes(role)) {
      res.status(400).json({ error: "Invalid role provided" });
      return;
    }

    const user = await registerUserService({ name, email, password, role });
    res.status(201).json({ message: "User created!", user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await loginUserService(
      email,
      password
    );
    res.status(200).json({ accessToken, refreshToken });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export async function refreshTokenLogin(req: Request, res: Response) {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(404).json({ message: "Token not found!" });
    }
    const refreshToken = await refreshTokenService(token);
    if (!refreshToken) {
      res.status(400).json({ message: "Invalid token!" });
      return;
    }
    const payload = await getUserByIdService(refreshToken.userId);
    if (!payload) {
      res.status(404).json({ message: "User not found!" });
      return;
    }
    const newAccess = await generateToken(payload);
    res.status(200).json({ newAccess });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}
