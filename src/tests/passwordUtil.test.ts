import { comparePassword, hashPassword } from "../utils/password";

describe("password util test", () => {
  let hashed: string;
  const password = "password123";
  beforeEach(async () => {
    jest.clearAllMocks();
    hashed = await hashPassword(password);
  });
  it("should check if password is hashed", async () => {
    expect(typeof hashed).toBe("string");
    expect(hashed).not.toBe(password);
  });
  it("should compare password", async () => {
    const isMatch = await comparePassword(password, hashed);
    expect(isMatch).toBe(true);
  });
});
