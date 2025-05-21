import User from "../../models/User";
import { RefreshToken } from "../../models/RefreshToken";

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

(RefreshToken.findOne as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(RefreshToken.create as jest.Mock) = jest.fn().mockResolvedValue(userMock);
(RefreshToken.update as jest.Mock) = jest.fn().mockResolvedValue(userMock);

export { User, RefreshToken, userMock };
