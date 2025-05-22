import {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("token util test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockData = {
    id: 1,
    email: "mock@mail.com",
    role: "admin",
  };
  const requiredFields = {
    id: 1,
  };

  it("should check the missing fields for accessToken and return error", async () => {
    // @ts-ignore
    expect(() => generateToken(requiredFields)).toThrow(
      "Missing required fields"
    );
  });

  it("should check the missing fields for refreshToken and return error", async () => {
    // @ts-ignore
    expect(() => generateRefreshToken(requiredFields)).toThrow(
      "Missing required fields"
    );
  });

  it("should check for the valid payload for accessToken", async () => {
    (jwt.sign as jest.Mock).mockReturnValue("mocktoken");
    const token = await generateToken(mockData);
    expect(token).toBe("mocktoken");
    expect(jwt.sign).toHaveBeenCalledWith(mockData, expect.any(String), {
      expiresIn: "3h",
    });
  });

  it("should check for the valid payload for refreshToken", async () => {
    (jwt.sign as jest.Mock).mockReturnValue("refreshToken");
    const token = await generateRefreshToken(mockData);
    expect(token).toBe("refreshToken");
    expect(jwt.sign).toHaveBeenCalledWith(mockData, expect.any(String), {
      expiresIn: "1d",
    });
  });

  it("should verify the accessToken", async () => {
    (jwt.verify as jest.Mock).mockReturnValue(mockData);
    const decoded = verifyToken("token");
    expect(decoded).toEqual(mockData);
    expect(jwt.verify).toHaveBeenCalledWith("token", expect.any(String));
  });

  it("should verify the refreshToken", async () => {
    (jwt.verify as jest.Mock).mockReturnValue(mockData);
    const decoded = verifyRefreshToken("refreshToken");
    expect(decoded).toEqual(mockData);
    expect(jwt.verify).toHaveBeenCalledWith("refreshToken", expect.any(String));
  });
});
