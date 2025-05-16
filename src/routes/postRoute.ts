import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPostById,
  updatePost,
} from "../controllers/postController";
import authMiddleware from "../middleware/authMiddleware";
import {
  validateAddPost,
  validateUpdatePost,
} from "../middleware/postValidation";
import { checkPostOwner } from "../middleware/checkPostOwner";

const postRoute = express.Router();

postRoute.get("/", getPost);
postRoute.get("/:id", getPostById);
postRoute.post("/", authMiddleware, checkPostOwner, validateAddPost, addPost);
postRoute.put(
  "/:id",
  authMiddleware,
  checkPostOwner,
  validateUpdatePost,
  updatePost
);
postRoute.delete("/:id", authMiddleware, checkPostOwner, deletePost);

export default postRoute;
