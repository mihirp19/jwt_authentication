import { registerUserService } from "../services/authService";
import User from "../models/User";
import * as passwordUtil from "../utils/password";

// jest.mock("../models/Post");
// jest.mock("../models/User");
jest.mock("../utils/password");

describe("registerUser service", () => {
  const mockUser: {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
  } = {
    name: "mockUser",
    email: "mock@mail.com",
    password: "plainText",
    role: "admin",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if email already exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: "mock@mail.com" });

    await expect(registerUserService(mockUser)).rejects.toThrow(
      "email already exists"
    );
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: mockUser.email },
    });
  });
});
