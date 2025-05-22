import { User, RefreshToken } from "./mocks/sequelizeModelMock";
import * as tokenUtil from "../utils/token";
import { refreshTokenService } from "../services/authService";

jest.mock("../utils/token");

describe("refreshTokenService test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockUser = {
    id: 1,
    name: "Jane",
    email: "jane@example.com",
    password: "hashed",
    role: "user",
  };
  const mockToken = {
    token: "validToken",
    User: mockUser,
    destroy: jest.fn(),
  };
  it("should check the refreshToken exists", async () => {
    (RefreshToken.findOne as jest.Mock).mockResolvedValue(mockToken);
    (tokenUtil.generateRefreshToken as jest.Mock).mockReturnValue("newToken");

    const result = await refreshTokenService("validToken");

    expect(RefreshToken.findOne).toHaveBeenCalledWith({
      where: { token: "validToken" },
      include: [{ model: User || expect.anything() }],
    });
    expect(mockToken.destroy).toHaveBeenCalledWith();
    expect(tokenUtil.generateRefreshToken as jest.Mock).toHaveBeenCalledWith({
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
    });
    expect(RefreshToken.create).toHaveBeenCalledWith({
      token: "newToken",
      userId: mockUser.id,
    });
    expect(result).toEqual({
      user: mockUser,
      newRefToken: "newToken",
    });
  });
  it("should return error if refreshToken or User does not exists", async () => {
    (RefreshToken.findOne as jest.Mock).mockResolvedValue(null);
    const result = await refreshTokenService("invalid token");
    expect(result).toBeNull();
    expect(RefreshToken.findOne).toHaveBeenCalledWith({
      where: { token: "invalid token" },
      include: [{ model: User || expect.anything() }],
    });
  });
  it("should return null if refreshToken exists but User is missing", async () => {
    (RefreshToken.findOne as jest.Mock).mockResolvedValue({
      token: "validToken",
      User: null,
    });

    const result = await refreshTokenService("validToken");
    expect(result).toBeNull();
  });
});
