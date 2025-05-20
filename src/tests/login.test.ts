import { login } from "../controllers/authController";
import * as authService from "../services/authService";
import { getMockReq, getMockRes } from "@jest-mock/express";

jest.mock("../services/authService");

describe("login controller", () => {
  const mockRequest = getMockReq({
    body: {
      email: "mihir@mail.com",
      password: "mihir123",
    },
  });

  const { res: mockResponse } = getMockRes();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and tokens on successful login", async () => {
    const mockTokens = {
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    };

    jest.mocked(authService.loginUserService).mockResolvedValue(mockTokens);

    await login(mockRequest, mockResponse);

    expect(authService.loginUserService).toHaveBeenCalledWith(
      "mihir@mail.com",
      "mihir123"
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockTokens);
  });
  it("should return 401 and error message on failed login", async () => {
    const mockError = new Error("invalid email or password!");
    (authService.loginUserService as jest.Mock).mockRejectedValue(mockError);

    await login(mockRequest as any, mockResponse as any);

    expect(authService.loginUserService).toHaveBeenCalledWith(
      "mihir@mail.com",
      "mihir123"
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "invalid email or password!",
    });
  });
  it("should return 400 if email is missing", async () => {
    const request = getMockReq({
      body: {
        password: "mihir123",
      },
    });
    await login(request, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "email and password are required",
    });
  });
  it("should return 400 if password is missing", async () => {
    const request = getMockReq({
      body: {
        email: "mihir@mail.com",
      },
    });

    await login(request, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "email and password are required",
    });
  });
  it("should return 400 if user not found", async () => {
    const request = getMockReq({
      body: {
        email: "notuser@mail.com",
        password: "notpassword123",
      },
    });
    await login(request, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "invalid email or password!",
    });
  });
});
