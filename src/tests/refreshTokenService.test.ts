import { User, RefreshToken } from "./mocks/sequelizeModelMock";
import * as tokenUtil from "../utils/token";
import { refreshTokenService } from "../services/authService";

jest.mock("../utils/token");

describe("refreshTokenService test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockData = {
    refreshToken: "token",
    userId: 1,
  };
  it("should check the refreshToken exists or not", async () => {
    (RefreshToken.findOne as jest.Mock).mockResolvedValue(mockData);
    await refreshTokenService(mockData.refreshToken);
  });
});
