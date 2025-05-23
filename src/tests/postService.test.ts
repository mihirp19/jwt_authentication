import { title } from "process";
import {
  getPostService,
  getPostByIdService,
  addPostService,
  updatePostService,
  deletePostService,
} from "../services/postService";
import { Post } from "../tests/mocks/sequelizeModelMock";

describe("postService test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Get Posts Cases
  it("should return 200 on getting all posts", async () => {
    const mockPosts = [
      { id: 1, title: "mockTitle", description: "mockDescription", userId: 1 },
    ];
    (Post.findAll as jest.Mock).mockResolvedValue(mockPosts);
    const posts = await getPostService();
    expect(Post.findAll).toHaveBeenCalledTimes(1);
    expect(posts).toEqual(mockPosts);
  });
  it("should return 200 on getting post by id", async () => {
    const mockPost = { id: 1 };
    (Post.findOne as jest.Mock).mockResolvedValue(mockPost);
    const post = await getPostByIdService(mockPost.id);
    expect(Post.findOne).toHaveBeenCalledWith({
      where: { id: mockPost.id },
    });
    expect(post).toEqual(mockPost);
  });
  it("should return null when post is not found", async () => {
    (Post.findOne as jest.Mock).mockResolvedValue(null);
    const result = await getPostByIdService(10);
    expect(Post.findOne).toHaveBeenCalledWith({ where: { id: 10 } });
    expect(result).toBeNull();
  });

  // Add Post Cases
  it("should return 201 on successful creation of post", async () => {
    const mockPost = {
      title: "mockPost",
      description: "mockPostDescription",
      userId: 1,
    };
    (Post.create as jest.Mock).mockResolvedValue(mockPost);
    const result = await addPostService(mockPost);
    expect(Post.create).toHaveBeenCalledWith(mockPost);
    expect(result).toEqual(mockPost);
  });

  // Update Post Cases
  it("should return 200 on updating the post", async () => {
    const postMock = {
      id: 1,
      update: jest.fn().mockResolvedValue(true),
    };
    const updatedPost = {
      title: "updatePost",
      description: "updateDescription",
    };
    (Post.findByPk as jest.Mock).mockResolvedValue(postMock);
    const result = await updatePostService(postMock.id, updatedPost);
    expect(Post.findByPk).toHaveBeenCalledWith(postMock.id);
    expect(postMock.update).toHaveBeenCalledWith(updatedPost);
    expect(result).toEqual(postMock);
  });
  it("should return null when the post is not found", async () => {
    const postMock = {
      id: 10,
    };
    const updatePost = {
      title: "nullPost",
      description: "nullDescription",
    };
    (Post.findByPk as jest.Mock).mockResolvedValue(null);
    const result = await updatePostService(postMock.id, updatePost);
    expect(Post.findByPk).toHaveBeenCalledWith(postMock.id);
    expect(result).toBeNull();
  });

  // Delete Post Cases
  it("should return 200 on post deletion", async () => {
    const deletePost = { id: 1, destroy: jest.fn().mockResolvedValue(true) };
    (Post.findByPk as jest.Mock).mockResolvedValue(deletePost);
    const result = await deletePostService(deletePost.id);
    expect(Post.findByPk).toHaveBeenCalledWith(deletePost.id);
    expect(deletePost.destroy).toHaveBeenCalled();
    expect(result).toBe(true);
  });
  it("should return null when the post is not found", async () => {
    const deletePost = {
      id: 10,
    };
    (Post.findByPk as jest.Mock).mockResolvedValue(null);
    const result = await deletePostService(deletePost.id);
    expect(Post.findByPk).toHaveBeenCalledWith(deletePost.id);
    expect(result).toBeNull();
  });
});
