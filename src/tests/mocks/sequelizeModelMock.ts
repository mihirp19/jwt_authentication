import User from "../../models/User";
import { RefreshToken } from "../../models/RefreshToken";
import Post from "../../models/Post";

const userMock = {
  name: "MockUser",
  email: "mock@mail.com",
  password: "hashedPassword",
  role: "admin" as "admin" | "user",
  update: jest.fn(),
  destroy: jest.fn(),
};

(User.findOne as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(User.create as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(User.findAll as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(User.findByPk as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(User.update as jest.Mock) = jest.fn().mockResolvedValue(userMock);

(Post.findAll as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(Post.findOne as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(Post.create as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(Post.update as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(Post.findByPk as jest.Mock) = jest.fn().mockResolvedValue(userMock);

(RefreshToken.findOne as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(RefreshToken.create as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(RefreshToken.update as jest.Mock) = jest.fn().mockResolvedValue(userMock);

export { User, RefreshToken, Post, userMock };
