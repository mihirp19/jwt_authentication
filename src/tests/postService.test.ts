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
  it("should return 200 on getting all posts", async () => {
    const mockPosts = [
      { id: 1, title: "mockTitle", description: "mockDescription", userId: 1 },
    ];
    (Post.findAll as jest.Mock).mockResolvedValue(mockPosts);
    const posts = await getPostService();
    expect(Post.findAll).toHaveBeenCalledTimes(1);
    expect(posts).toEqual(mockPosts);
  });
});
