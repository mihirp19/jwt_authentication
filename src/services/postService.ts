import Post, { PostCreation } from "../models/Post";

export async function getPostService() {
  const posts = await Post.findAll();
  return posts;
}

export async function getPostByIdService(id: number) {
  const post = await Post.findOne({ where: { id: id } });
  if (!post) {
    return null;
  }
  return post;
}

export async function addPostService(data: PostCreation) {
  const post = await Post.create(data);
  return post;
}

export async function updatePostService(
  id: number,
  data: Partial<PostCreation>
) {
  const post = await Post.findByPk(id);
  if (!post) {
    return null;
  }
  post.update(data);
  return post;
}

export async function deletePostService(id: number) {
  const post = await Post.findByPk(id);
  if (!post) {
    return null;
  }
  await post.destroy();
  return true;
}
