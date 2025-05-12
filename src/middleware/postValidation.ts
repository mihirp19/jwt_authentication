import { Request, Response, NextFunction } from "express";

export const validateAddPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, userId } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    res
      .status(400)
      .json({ error: "Title is required and must be a non-empty string." });
    return;
  }

  if (typeof description !== "string" || description.trim() === "") {
    res
      .status(400)
      .json({ error: "Content is required and must be a non-empty string." });
    return;
  }

  if (typeof userId !== "number" || userId <= 0) {
    res.status(400).json({ error: "userId must be a positive number." });
    return;
  }

  next();
};

export const validateUpdatePost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  if (typeof data !== "object" || data === null) {
    res.status(400).json({ error: "Invalid data format. Expected an object." });
    return;
  }

  const { title, content } = data;

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    res
      .status(400)
      .json({ error: "Title must be a non-empty string if provided." });
    return;
  }

  if (
    content !== undefined &&
    (typeof content !== "string" || content.trim() === "")
  ) {
    res
      .status(400)
      .json({ error: "Content must be a non-empty string if provided." });
    return;
  }

  next();
};
