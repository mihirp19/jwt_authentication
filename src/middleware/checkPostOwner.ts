import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";

export async function checkPostOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const postId = parseInt(req.params.id);
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({ error: "Unauthorized, no user found" });
    return;
  }
  const post = await Post.findByPk(postId);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  if (user.role === "admin" || user.id === post.userId) {
    next();
  } else {
    res.status(403).json({ error: "Forbidden, you do not have permission!" });
  }
}
