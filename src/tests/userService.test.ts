import {
  getUserService,
  getUserByIdService,
  addUserService,
  updateUserService,
  deleteUserService,
} from "../services/userService";
import { User, userMock } from "../tests/mocks/sequelizeModelMock";

describe("userService test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  //   Get User Cases
  it("should return 200 on getting users", async () => {
    const mockUsers = [
      { id: 1, email: "mock@mail.com", password: "userPass123", role: "admin" },
    ];
    (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
    const users = await getUserService();

    expect(User.findAll).toHaveBeenCalledTimes(1);
    expect(users).toEqual(mockUsers);
  });
  //   Get User By Id Cases
  it("should return 200 on getting user by id", async () => {
    const mockUser = { id: 1 };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    const user = await getUserByIdService(mockUser.id);
    expect(User.findOne).toHaveBeenCalledWith({
      where: { id: mockUser.id },
    });
    expect(user).toEqual(mockUser);
  });
  it("should return null when user is not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const result = await getUserByIdService(100);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { id: 100 },
    });
    expect(result).toBeNull();
  });
  //   Add User Cases
  it("should return 201 on adding user", async () => {
    const mockUser = {
      name: "mockUser",
      email: "mock@mail.com",
      password: "password123",
      role: "admin" as "admin",
    };

    (User.create as jest.Mock).mockResolvedValue(mockUser);
    const result = await addUserService(mockUser);

    expect(User.create).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });
  // Update User Cases
  it("should update the user and return 200", async () => {
    const userMock = {
      id: 1,
      update: jest.fn().mockResolvedValue(true),
    };
    const updateData = {
      name: "updatedUser",
      password: "updatedPassword",
    };
    (User.findByPk as jest.Mock).mockReturnValue(userMock);

    const result = await updateUserService(userMock.id, updateData);

    expect(User.findByPk).toHaveBeenCalledWith(userMock.id);
    expect(userMock.update).toHaveBeenCalledWith(updateData);
    expect(result).toEqual(userMock);
  });

  it("should return null when user is not found for update", async () => {
    const userMock = {
      id: 100,
    };
    const updateData = {
      name: "updatedUser",
      password: "updatedPassword",
    };
    (User.findByPk as jest.Mock).mockResolvedValue(null);
    const result = await updateUserService(userMock.id, updateData);

    expect(User.findByPk).toHaveBeenCalledWith(userMock.id);
    expect(result).toBeNull();
  });
  //   Delete User Cases
  it("should return 200 on deletion", async () => {
    const deleteUser = { id: 1, destroy: jest.fn().mockResolvedValue(true) };
    (User.findByPk as jest.Mock).mockResolvedValue(deleteUser);
    const result = await deleteUserService(deleteUser.id);
    expect(User.findByPk).toHaveBeenCalledWith(deleteUser.id);
    expect(deleteUser.destroy).toHaveBeenCalled();
    expect(result).toBe(true);
  });
  it("should return null when user is not found for deletion", async () => {
    const deleteUser = {
      id: 100,
    };

    (User.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await deleteUserService(deleteUser.id);

    expect(User.findByPk).toHaveBeenCalledWith(deleteUser.id);
    expect(result).toBeNull();
  });
});
