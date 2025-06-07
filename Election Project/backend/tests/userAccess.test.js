import { jest } from "@jest/globals";
import userAccess from "../data/userAccess.js";
import UserLogin from "../models/User.js";
import { sequelize } from "../config/db.js";
import bcrypt from "bcrypt";

const fakeTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

sequelize.transaction = jest.fn().mockResolvedValue(fakeTransaction);

UserLogin.findOne = jest.fn();
UserLogin.create = jest.fn();
UserLogin.update = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("addUser", () => {
  it("should create a new user", async () => {
    const mockUser = {
      username: "jdoe",
      password_hash: "hashed_pw"
    };

    UserLogin.findOne.mockResolvedValue(null);
    UserLogin.create.mockResolvedValue({ userId: 1, ...mockUser });

    const result = await userAccess.addUser(mockUser.username, mockUser.password_hash);

    expect(result.success).toBe(true);
    expect(UserLogin.create).toHaveBeenCalledWith(expect.objectContaining({
      username: "jdoe",
      password_hash: "hashed_pw"
    }), expect.any(Object));
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should not add a user if username exists", async () => {
    UserLogin.findOne.mockResolvedValue({ username: "jdoe" });

    const result = await userAccess.addUser("jdoe", "pw");

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/exists/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe("authenticateUser", () => {
  it("should return true if password matches", async () => {
    const hashed = await bcrypt.hash("password123", 10);
    UserLogin.findOne.mockResolvedValue({
      username: "jdoe",
      password_hash: hashed
    });

    const result = await userAccess.authenticateUser({ username: "jdoe", password: "password123" });

    expect(result).toBe(true);
  });

  it("should return false if user not found", async () => {
    UserLogin.findOne.mockResolvedValue(null);

    const result = await userAccess.authenticateUser({ username: "jdoe", password: "any" });

    expect(result.success).toBe(false);
  });
});

describe("getUser", () => {
  it("should return user object if found", async () => {
    UserLogin.findOne.mockResolvedValue({
      userID: 1,
      username: "jdoe",
      email: "jdoe@example.com"
    });

    const result = await userAccess.getUser(1);

    expect(result.success).toBe(true);
    expect(result.user.username).toBe("jdoe");
  });

  it("should return false if user not found", async () => {
    UserLogin.findOne.mockResolvedValue(null);

    const result = await userAccess.getUser(99);

    expect(result).toBe(false);
  });
});

describe("updateUser", () => {
  it("should update user info", async () => {
    UserLogin.update.mockResolvedValue(1);

    const result = await userAccess.updateUser(1, "newName", "hash", "new@example.com", "admin");

    expect(result.success).toBe(true);
    expect(UserLogin.update).toHaveBeenCalledWith(expect.objectContaining({
      username: "newName",
      password_hash: "hash",
      email: "new@example.com",
      role: "admin"
    }), expect.objectContaining({ where: { userId: 1 } }));
  });

  it("should fail to update user", async () => {
    UserLogin.update.mockResolvedValue(0);

    const result = await userAccess.updateUser(1, "bad", "pw", "bad@e.com", "member");

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Failed/);
  });
});

describe("deleteUser", () => {
  it("should soft delete a user", async () => {
    UserLogin.update.mockResolvedValue(1);

    const result = await userAccess.deleteUser(1);

    expect(result.success).toBe(true);
    expect(UserLogin.update).toHaveBeenCalledWith({ status: "inactive" }, expect.objectContaining({
      where: { userId: 1 }
    }));
  });

  it("should fail to delete a user", async () => {
    UserLogin.update.mockResolvedValue(0);

    const result = await userAccess.deleteUser(1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Failed/);
  });
});
