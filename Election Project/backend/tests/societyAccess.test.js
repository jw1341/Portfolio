import { jest } from "@jest/globals";
import societyAccess from "../data/societyAccess.js";
import Society from "../models/Society.js";
import { sequelize } from "../config/db.js";
import { Op } from "sequelize";

const fakeTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

sequelize.transaction = jest.fn().mockResolvedValue(fakeTransaction);

Society.findOne = jest.fn();
Society.findAll = jest.fn();
Society.create = jest.fn();
Society.update = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("addSociety", () => {
  it("should add a new society", async () => {
    Society.findOne.mockResolvedValue(null);
    Society.create.mockResolvedValue({ society_id: 1, name: "New Society" });

    const result = await societyAccess.addSociety({ name: "New Society" });

    expect(result.success).toBe(true);
    expect(Society.create).toHaveBeenCalled();
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should not add a duplicate society", async () => {
    Society.findOne.mockResolvedValue({ name: "Existing Society" });

    const result = await societyAccess.addSociety({ name: "Existing Society" });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    Society.findOne.mockRejectedValue(new Error("DB Error"));

    const result = await societyAccess.addSociety({ name: "Failing Society" });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe("getSociety", () => {
  it("should return a society by ID", async () => {
    Society.findOne.mockResolvedValue({ society_id: 1, name: "Test" });

    const result = await societyAccess.getSociety(1);

    expect(result.success).toBe(true);
    expect(result.society.name).toBe("Test");
  });

  it("should return error if not found", async () => {
    Society.findOne.mockResolvedValue(null);

    const result = await societyAccess.getSociety(99);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/);
  });
});

describe("getAllSocieties", () => {
  it("should return all active societies", async () => {
    Society.findAll.mockResolvedValue([{ society_id: 1 }, { society_id: 2 }]);

    const result = await societyAccess.getAllSocieties();

    expect(result.success).toBe(true);
    expect(result.societies.length).toBe(2);
  });

  it("should handle errors", async () => {
    Society.findAll.mockRejectedValue(new Error("DB Error"));

    const result = await societyAccess.getAllSocieties();

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
  });
});

describe("updateSociety", () => {
  it("should update a society's information", async () => {
    Society.findOne
      .mockResolvedValueOnce({ society_id: 1 })
      .mockResolvedValueOnce(null);

    Society.update.mockResolvedValue([1]);
    Society.findOne.mockResolvedValueOnce({ society_id: 1, name: "Updated" });

    const result = await societyAccess.updateSociety(1, { name: "Updated" });

    expect(result.success).toBe(true);
    expect(Society.update).toHaveBeenCalled();
    expect(result.society.name).toBe("Updated");
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should fail if society name already exists", async () => {
    Society.findOne
      .mockResolvedValueOnce({ society_id: 1 })
      .mockResolvedValueOnce({ name: "Conflict" });

    const result = await societyAccess.updateSociety(1, { name: "Conflict" });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it("should handle update errors", async () => {
    Society.findOne.mockRejectedValue(new Error("DB Error"));

    const result = await societyAccess.updateSociety(1, {});

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe("deleteSociety", () => {
  it("should soft delete a society", async () => {
    Society.findOne.mockResolvedValue({ society_id: 1 });
    Society.update.mockResolvedValue([1]);

    const result = await societyAccess.deleteSociety(1);

    expect(result.success).toBe(true);
    expect(Society.update).toHaveBeenCalledWith(
      { deleted: true },
      expect.objectContaining({ where: { society_id: 1 } })
    );
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should return error if not found", async () => {
    Society.findOne.mockResolvedValue(null);

    const result = await societyAccess.deleteSociety(1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it("should handle delete errors", async () => {
    Society.findOne.mockRejectedValue(new Error("DB Error"));

    const result = await societyAccess.deleteSociety(1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});
