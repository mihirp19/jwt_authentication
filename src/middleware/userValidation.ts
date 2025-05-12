import { Request, Response, NextFunction } from "express";

export const validateAddUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, role } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    res.status(400).json({ error: "Name is required and must be a string." });
    return;
  }

  if (typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email is required." });
    return;
  }

  if (typeof password !== "string" || password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters." });
    return;
  }

  if (role && !["admin", "user"].includes(role)) {
    res.status(400).json({ error: "Role must be 'admin' or 'user'." });
    return;
  }

  next();
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, age } = req.body;

  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    res
      .status(400)
      .json({ error: "Name must be a non-empty string if provided." });
    return;
  }

  if (
    email !== undefined &&
    (typeof email !== "string" || !email.includes("@"))
  ) {
    res.status(400).json({ error: "Email must be valid if provided." });
    return;
  }

  if (age !== undefined && (typeof age !== "number" || age < 0)) {
    res
      .status(400)
      .json({ error: "Age must be a non-negative number if provided." });
    return;
  }

  next();
};
