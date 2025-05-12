import { Request, Response } from "express";
import { loginUserService, registerUserService } from "../services/authService";

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
    const token = await loginUserService(email, password);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}
