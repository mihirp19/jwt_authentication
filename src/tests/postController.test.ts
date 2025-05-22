import { getMockReq, getMockRes } from "@jest-mock/express";
import {
  getPost,
  getPostById,
  addPost,
  updatePost,
  deletePost,
} from "../controllers/postController";
import * as postService from "../services/postService";

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
});
