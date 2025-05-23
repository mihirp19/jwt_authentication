import { getMockReq, getMockRes } from "@jest-mock/express";
import {
  getPost,
  getPostById,
  addPost,
  updatePost,
  deletePost,
} from "../controllers/postController";
import * as postService from "../services/postService";
import { json } from "sequelize";

jest.mock("../services/postService");

describe("post controller test", () => {
  const mockRequest = getMockReq({
    body: {
      title: "mockTitle",
      description: "mockDescription",
      userId: 1,
    },
  });
  const { res: mockResponse } = getMockRes();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockPosts = {
    id: 1,
    title: "mocktitle",
    description: "globalDeclaredDescription",
    userId: 1,
  };
  // Get Post Cases
  it("should return 200 on getting posts", async () => {
    const mockPosts = [
      {
        id: 1,
        title: "mockTitle",
        description: "mockDescription",
        userId: 1,
      },
    ];
    (postService.getPostService as jest.Mock).mockResolvedValue(mockPosts);
    await getPost(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPosts);
  });
  it("should return 200 on getting post by id", async () => {
    const mockReq = getMockReq({
      params: { id: "1" },
    });
    (postService.getPostByIdService as jest.Mock).mockResolvedValue(mockPosts);
    await getPostById(mockReq, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPosts);
  });
  it("should return 404 if the post is not found", async () => {
    const mockReq = getMockReq({
      params: { id: "1" },
    });
    (postService.getPostByIdService as jest.Mock).mockResolvedValue(null);
    await getPostById(mockReq, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Post not found!",
    });
  });
  // Add Post Cases
  it("should return 201 on successful post creation", async () => {
    const mockPost = getMockReq({
      body: {
        title: "mockPost",
        description: "mockDescription",
        userId: 1,
      },
    });
    const createdPost = {
      id: 1,
      title: "mockPost",
      description: "mockDescription",
      userId: 1,
    };
    (postService.addPostService as jest.Mock).mockResolvedValue(createdPost);
    await addPost(mockPost, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(createdPost);
  });
  it("should return 400 on missing fields", async () => {
    const requiredFields = getMockReq({
      body: {
        title: "emptyDescription",
        userId: 1,
      },
    });
    await addPost(requiredFields, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Missing required fields",
    });
  });
  it("should return 500 on service error", async () => {
    const mockReq = getMockReq({
      body: {
        title: "mockPost",
        description: "mockDescription",
        userId: 1,
      },
    });

    const mockError = new Error("Service failure");
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (postService.addPostService as jest.Mock).mockRejectedValue(mockError);

    await addPost(mockReq, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Failed to add post",
      details: mockError,
    });
    consoleSpy.mockRestore();
  });
  // Update Post Cases
  it("should return 200 on post update", async () => {
    const mockReq = getMockReq({
      params: { id: "1" },
      body: {
        title: "updatePost",
        description: "updateDescription",
      },
    });
    const mockUpdatePost = {
      title: "updatePost",
      description: "updateDescription",
    };
    (postService.updatePostService as jest.Mock).mockResolvedValue(
      mockUpdatePost
    );
    await updatePost(mockReq, mockResponse);
    expect(postService.updatePostService).toHaveBeenCalledWith(
      Number(mockReq.params.id),
      {
        title: "updatePost",
        description: "updateDescription",
      }
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatePost);
  });
  it("should return 404 if user is not found", async () => {
    const mockUpdate = getMockReq({
      params: { id: "1" },
      body: {
        name: "nonExistent",
        password: "noUserPassword",
      },
    });

    (postService.updatePostService as jest.Mock).mockResolvedValue(null);
    await updatePost(mockUpdate, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Post not found!",
    });
  });

  // Delete Post Cases
  it("should return 200 on successful post deletion", async () => {
    const deleteReq = getMockReq({
      params: {
        id: "1",
      },
    });
    (postService.deletePostService as jest.Mock).mockResolvedValue(true);
    await deletePost(deleteReq, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Post deleted!",
    });
  });

  it("should return 404 on not getting post", async () => {
    const deleteReq = getMockReq({
      params: {
        id: "1",
      },
    });
    (postService.deletePostService as jest.Mock).mockResolvedValue(null);
    await deletePost(deleteReq, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Post not found!",
    });
  });
});
