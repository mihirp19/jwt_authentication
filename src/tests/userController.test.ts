import { getMockReq, getMockRes } from "@jest-mock/express";
import {
  getUser,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import * as userService from "../services/userService";
import * as passwordUtils from "../utils/password";

jest.mock("../services/userService");
jest.mock("../utils/password");

describe("user controller", () => {
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
  //   Get User Cases
  it("should return 200 on getting users", async () => {
    const mockUsers = [{ id: 1, name: "user1" }];
    (userService.getUserService as jest.Mock).mockResolvedValue(mockUsers);
    await getUser(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
  });

  it("should return 200 on getting user by id", async () => {
    const mockUser = getMockReq({
      params: { id: "1" },
    });
    (userService.getUserByIdService as jest.Mock).mockResolvedValue(mockUser);
    await getUserById(mockUser, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  });

  it("should return 404 if user is not found", async () => {
    const mockUser = getMockReq({
      params: { id: "1" },
    });
    (userService.getUserByIdService as jest.Mock).mockResolvedValue(null);
    await getUserById(mockUser, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User not found!",
    });
  });

  // Add User Cases
  it("should return 201 on successful user creation", async () => {
    const mockUser = {
      name: "mockUser",
      email: "mockuser@mail.com",
      role: "user",
    };
    (userService.addUserService as jest.Mock).mockResolvedValue(mockUser);
    await addUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User created",
      user: mockUser,
    });
  });

  it("should return 400 for missing fields", async () => {
    const requiredFields = getMockReq({
      body: {
        name: "mockUser",
      },
    });
    await addUser(requiredFields, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Missing required fields",
    });
  });

  it("should return 400 for invalid role", async () => {
    const mockRequest = getMockReq({
      body: {
        name: "mockUser",
        email: "mock@mail.com",
        password: "mock234",
        role: "abc1234",
      },
    });
    await addUser(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid role" });
  });

  it("should return 500 internal server error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (passwordUtils.hashPassword as jest.Mock).mockRejectedValue(
      new Error("Hashing failed")
    );

    await addUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Failed to add user",
      })
    );
    consoleSpy.mockRestore();
  });
  //   Update User Cases
  it("should return 200 after update", async () => {
    const mockReq = getMockReq({
      params: { id: "1" },
      body: {
        name: "updateMock",
        password: "mockUpdatePass",
      },
    });
    const hashedPassword = "hashedUpdatedPass";
    const mockUpdate = {
      name: "updateMock",
      password: hashedPassword,
    };
    (passwordUtils.hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
    (userService.updateUserService as jest.Mock).mockResolvedValue(mockUpdate);

    await updateUser(mockReq, mockResponse);

    expect(passwordUtils.hashPassword).toHaveBeenCalledWith("mockUpdatePass");
    expect(userService.updateUserService).toHaveBeenCalledWith(1, {
      name: "updateMock",
      password: hashedPassword,
    });
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdate);
  });

  it("should return 404 if user is not found", async () => {
    const mockUpdate = getMockReq({
      params: { id: "1" },
      body: {
        name: "nonExistent",
        password: "noUserPassword",
      },
    });
    (passwordUtils.hashPassword as jest.Mock).mockResolvedValue(
      "hashedNoUserPassword"
    );
    (userService.updateUserService as jest.Mock).mockResolvedValue(null);
    await updateUser(mockUpdate, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User not found!",
    });
  });
  //   Delete User Cases
  it("should return 200 on successful deletion", async () => {
    const deleteReq = getMockReq({
      params: {
        id: "1",
      },
    });
    (userService.deleteUserService as jest.Mock).mockResolvedValue(true);
    await deleteUser(deleteReq, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User deleted!",
    });
  });

  it("should return 404 on not getting user", async () => {
    const deleteReq = getMockReq({
      params: {
        id: "1",
      },
    });
    (userService.deleteUserService as jest.Mock).mockResolvedValue(null);
    await deleteUser(deleteReq, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User not found!",
    });
  });
});
