import { getMockReq, getMockRes } from "@jest-mock/express";
import { register } from "../controllers/authController";
import * as authService from "../services/authService";

jest.mock("../../services/authService");

describe("register controller", () => {
  const mockRequest = getMockReq({
    body: {
      name: "mockUser",
      email: "mockuser@mail.com",
      password: "mockuser123",
      role: "user",
    },
  });

  const { res: mockResponse } = getMockRes();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 on successful registration", async () => {
    const mockUser = {
      name: "mockUser",
      email: "mockuser@mail.com",
      role: "user",
    };

    (authService.registerUserService as jest.Mock).mockResolvedValue(mockUser);

    await register(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User created!",
      user: mockUser,
    });
  });
  it("should return 400 for missing fields", async () => {
    const mockRequest = getMockReq({
      body: {
        email: "mockuser@mail.com",
      },
    });

    await register(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "missing required fields",
    });
  });
  it("should return 400 for invalid role", async () => {
    const mockRequest = getMockReq({
      body: {
        name: "mockUser",
        email: "mockuser@mail.com",
        password: "mockuser123",
        role: "abc123",
      },
    });
    await register(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Invalid role provided",
    });
  });
  it("should handle service errors", async () => {
    (authService.registerUserService as jest.Mock).mockRejectedValue(
      new Error("service failed")
    );
    await register(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "service failed" });
  });
});
