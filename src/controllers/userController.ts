import { Request, Response } from "express";
import {
  addUserService,
  deleteUserService,
  getUserByIdService,
  getUserService,
  updateUserService,
} from "../services/userService";
import { hashPassword } from "../utils/password";

export async function getUser(req: Request, res: Response) {
  const users = await getUserService();
  res.status(200).json(users);
}

export async function getUserById(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const user = await getUserByIdService(id);
  if (!user) {
    res.status(404).json({ message: "User not found!" });
  } else {
    res.status(200).json(user);
  }
}

export async function addUser(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const validRoles = ["user", "admin"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const hashedPass = await hashPassword(password);
    const addUser = await addUserService({
      name,
      email,
      password: hashedPass,
      role,
    });
    res.status(201).json({
      message: "User created",
      user: addUser,
    });
  } catch (error) {
    console.error("user adding error", error);
    res.status(500).json({ error: "Failed to add user", details: error });
  }
}

export async function updateUser(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const { name, password } = req.body;
  const hashedPass = await hashPassword(password);
  const updatedUser = await updateUserService(id, {
    name,
    password: hashedPass,
  });
  if (updatedUser) {
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found!" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const deleteUser = await deleteUserService(id);
  if (deleteUser) {
    res.status(200).json({ message: "User deleted!" });
  } else {
    res.status(404).json({ message: "User not found!" });
  }
}
