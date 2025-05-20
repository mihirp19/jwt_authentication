import { refreshTokenLogin } from "../controllers/authController";
import { getMockReq, getMockRes } from "@jest-mock/express";
import * as authService from "../services/authService";
import * as tokenUtils from "../utils/token";

jest.mock("../services/authService");
jest.mock("../utils/token");

describe("refresh token login controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockResponse = getMockRes().res;

  it("should return 404 when token not found", async () => {
    const mockRequest = getMockReq({
      body: {},
    });
    await refreshTokenLogin(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Token not found!",
    });
  });

  it("should return 403 when token is invalid", async () => {
    const mockRequest = getMockReq({
      body: {
        token: "bad_token",
      },
    });
    (authService.refreshTokenService as jest.Mock).mockResolvedValue(null);
    await refreshTokenLogin(mockRequest, mockResponse);
    expect(authService.refreshTokenService).toHaveBeenCalledWith("bad_token");
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid token!",
    });
  });
  it("should return 401 if fields are missing", async () => {
    const mockRequest = getMockReq({
      body: {
        token: "valid_token",
      },
    });
    (authService.refreshTokenService as jest.Mock).mockResolvedValue({
      user: {
        email: "mock@mail.com",
        role: "admin",
      },
      newRefToken: "newToken",
    });
    await refreshTokenLogin(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Missing required user data for token generation",
    });
  });
  it("should return 200 on successful token generation", async () => {
    const mockUser = {
      id: 1,
      email: "mock@mail.com",
      role: "user",
    };
    const mockRequest = getMockReq({
      body: {
        token: "validToken",
      },
    });
    (authService.refreshTokenService as jest.Mock).mockResolvedValue({
      user: mockUser,
      newRefToken: "newRefreshToken",
    });
    (tokenUtils.generateToken as jest.Mock).mockReturnValue("newAccessToken");
    await refreshTokenLogin(mockRequest, mockResponse);

    expect(tokenUtils.generateToken).toHaveBeenCalledWith({
      id: 1,
      email: "mock@mail.com",
      role: "user",
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      newAccess: "newAccessToken",
      newRefToken: "newRefreshToken",
    });
  });
});
