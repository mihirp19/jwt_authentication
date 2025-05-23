import { Request, Response } from "express";
import {
  addPostService,
  deletePostService,
  getPostByIdService,
  getPostService,
  updatePostService,
} from "../services/postService";

export async function getPost(req: Request, res: Response) {
  const posts = await getPostService();
  res.status(200).json(posts);
}

export async function getPostById(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const post = await getPostByIdService(id);
  if (!post) {
    res.status(404).json({ message: "Post not found!" });
  } else {
    res.status(200).json(post);
  }
}

export async function addPost(req: Request, res: Response) {
  try {
    const { title, description, userId } = req.body;
    if (!title || !description || !userId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const addPost = await addPostService({ title, description, userId });
    res.status(201).json(addPost);
  } catch (error) {
    console.error("post adding error", error);
    res.status(500).json({ error: "Failed to add post", details: error });
  }
}

export async function updatePost(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const { title, description } = req.body;
  const updatedPost = await updatePostService(id, { title, description });
  if (updatedPost) {
    res.status(200).json(updatedPost);
  } else {
    res.status(404).json({ message: "Post not found!" });
  }
}

export async function deletePost(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const deletePost = await deletePostService(id);
  if (deletePost) {
    res.json({ message: "Post deleted!" });
  } else {
    res.status(404).json({ message: "Post not found!" });
  }
}
