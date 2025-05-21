import { registerUserService } from "../services/authService";
import { User, userMock } from "./mocks/sequelizeModelMock";
import * as passwordUtil from "../utils/password";

// jest.mock("../models/User");
// jest.mock("../models/RefreshToken");
jest.mock("../utils/password");

describe("registerUser service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if email already exists", async () => {
    await expect(registerUserService(userMock)).rejects.toThrow(
      "email already exists"
    );
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: userMock.email },
    });
  });
  it("should register a user successfully", async () => {
    const mockInput = {
      name: "new User",
      email: "newuser@mail.com",
      password: "plaintext",
      role: "admin" as "admin",
    };
    const hashedPass = "hashedPass";
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (passwordUtil.hashPassword as jest.Mock).mockResolvedValue(hashedPass);
    (User.create as jest.Mock).mockResolvedValue({
      ...mockInput,
      password: hashedPass,
    });

    const result = await registerUserService(mockInput);
    // finding email if it exists
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: mockInput.email },
    });
    // hashing the password if not hashed
    expect(passwordUtil.hashPassword).toHaveBeenCalledWith(mockInput.password);
    // creating the user with correct data and hashed password and specified role
    expect(User.create).toHaveBeenCalledWith({
      ...mockInput,
      password: hashedPass,
      role: "admin",
    });
    // ensuring function's return value matched db after creation
    expect(result).toEqual({
      ...mockInput,
      password: hashedPass,
    });
  });
  it("should return default role user", async () => {
    const mockInput = {
      name: "defaultUser",
      email: "default@user.com",
      password: "plainPass",
    };
    const hashedPass = "hashedPass";

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (passwordUtil.hashPassword as jest.Mock).mockResolvedValue(hashedPass);
    (User.create as jest.Mock).mockResolvedValue({
      ...mockInput,
      password: hashedPass,
    });
    const result = await registerUserService(mockInput);
    // finding email if it exists
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: mockInput.email },
    });
    // hashing the password if not hashed
    expect(passwordUtil.hashPassword).toHaveBeenCalledWith(mockInput.password);
    // creating the user with correct data and hashed password and specified role
    expect(User.create).toHaveBeenCalledWith({
      ...mockInput,
      password: hashedPass,
      role: "user",
    });
    // ensuring function's return value matched db after creation
    expect(result).toEqual({
      ...mockInput,
      password: hashedPass,
    });
  });
  it("should throw an error if input email is invalid", async () => {
    const mockInput = {
      name: "invalidUser",
      email: "notEmail.com",
      password: "plainPass",
      role: "user" as "user",
    };

    await expect(registerUserService(mockInput)).rejects.toThrow(
      "Invalid email format"
    );

    expect(User.findOne).not.toHaveBeenCalled();
    expect(passwordUtil.hashPassword).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });
});
