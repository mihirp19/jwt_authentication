import { loginUserService } from "../services/authService";
import * as passwordUtil from "../utils/password";
import * as tokenUtil from "../utils/token";
import { User, RefreshToken } from "./mocks/sequelizeModelMock";

jest.mock("../utils/password");
jest.mock("../utils/token");

describe("registerUser service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockData = {
    id: 1,
    email: "test@mail.com",
    password: "hashedPassword",
    role: "user",
  };
  it("should return error if invalid email or password", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    await expect(
      loginUserService(mockData.email, mockData.password)
    ).rejects.toThrow("invalid email or password!");
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: "test@mail.com" },
    });
  });
  it("should return error if wrong password", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockData);
    (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(false);
    await expect(
      loginUserService(mockData.email, "wrongPassword")
    ).rejects.toThrow("invalid email or password!");

    expect(passwordUtil.comparePassword).toHaveBeenCalledWith(
      "wrongPassword",
      mockData.password
    );
  });
  it("should login and generate accessToken and refreshToken if not exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockData);
    (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(true);
    (tokenUtil.generateToken as jest.Mock).mockReturnValue("accessToken");
    (tokenUtil.generateRefreshToken as jest.Mock).mockReturnValue(
      "refreshToken"
    );
    (RefreshToken.findOne as jest.Mock).mockResolvedValue(null);

    const result = await loginUserService(mockData.email, "correctPassword");

    expect(result).toEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });

    expect(RefreshToken.create).toHaveBeenCalledWith({
      token: "refreshToken",
      userId: mockData.id,
    });
  });
  it("should update the refreshToken", async () => {
    const existingToken = { token: "oldToken", userId: mockData.id };
    (User.findOne as jest.Mock).mockResolvedValue(mockData);
    (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(true);
    (tokenUtil.generateToken as jest.Mock).mockReturnValue("accessToken");
    (tokenUtil.generateRefreshToken as jest.Mock).mockReturnValue(
      "refreshToken"
    );
    (RefreshToken.findOne as jest.Mock).mockResolvedValue(existingToken);

    const result = await loginUserService(mockData.email, "password");

    expect(result).toEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });
    expect(RefreshToken.update).toHaveBeenCalledWith(
      { token: "refreshToken" },
      { where: { userId: mockData.id } }
    );
  });
});
