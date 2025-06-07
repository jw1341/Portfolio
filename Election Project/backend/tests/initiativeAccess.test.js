import { jest } from "@jest/globals";
import initiativeAccess from "../data/initiativeAccess.js";
import Initiative from "../models/Initiative.js";
import Ballot from "../models/Ballot.js";
import { sequelize } from "../config/db.js"; 

const fakeTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

sequelize.transaction = jest.fn().mockResolvedValue(fakeTransaction); 

Initiative.findOne = jest.fn();
Initiative.findAll = jest.fn();
Initiative.create = jest.fn();
Initiative.update = jest.fn();
Initiative.destroy = jest.fn();

Ballot.findOne = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("addInitiative", () => {
  it("should add a new initiative if it doesn't already exist", async () => {
    Initiative.findOne.mockResolvedValue(null);
    Ballot.findOne.mockResolvedValue({ id: 1 });
    Initiative.create.mockResolvedValue({ id: 1 });

    const result = await initiativeAccess.addInitiative({ initiative_id: 1, ballot_id: 1 });

    expect(result.success).toBe(true);
    expect(Initiative.create).toHaveBeenCalled();
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should not add if initiative already exists", async () => {
    Initiative.findOne.mockResolvedValue({ id: 1 });

    const result = await initiativeAccess.addInitiative({ initiative_id: 1, ballot_id: 1 });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/i);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it("should not add if ballot not found", async () => {
    Initiative.findOne.mockResolvedValue(null);
    Ballot.findOne.mockResolvedValue(null);

    const result = await initiativeAccess.addInitiative({ initiative_id: 1, ballot_id: 1 });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/ballot not found/i);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    Initiative.findOne.mockRejectedValue(new Error("DB Error"));

    const result = await initiativeAccess.addInitiative({ initiative_id: 1, ballot_id: 1 });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe("getInitiative", () => {
  it("should return initiative if found", async () => {
    Initiative.findOne.mockResolvedValue({ id: 1 });

    const result = await initiativeAccess.getInitiative(1, 1);

    expect(result.success).toBe(true);
    expect(result.initiative).toBeDefined();
  });

  it("should return error if initiative not found", async () => {
    Initiative.findOne.mockResolvedValue(null);

    const result = await initiativeAccess.getInitiative(1, 1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });
});

describe("getInitiativesByBallot", () => {
  it("should return list of initiatives", async () => {
    Initiative.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await initiativeAccess.getInitiativesByBallot(1);

    expect(result.success).toBe(true);
    expect(result.initiatives.length).toBe(2);
  });

  it("should handle errors", async () => {
    Initiative.findAll.mockRejectedValue(new Error("DB Error"));

    const result = await initiativeAccess.getInitiativesByBallot(1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
  });
});

describe("updateInitiative", () => {
  it("should update initiative successfully", async () => {
    Initiative.findOne.mockResolvedValueOnce({ id: 1 }); // before update
    Initiative.update.mockResolvedValue([1]);
    Initiative.findOne.mockResolvedValueOnce({ id: 1, title: "Updated" }); // after update

    const result = await initiativeAccess.updateInitiative(1, 1, { title: "Updated" });

    expect(result.success).toBe(true);
    expect(result.initiative).toBeDefined();
  });

  it("should return error if initiative not found", async () => {
    Initiative.findOne.mockResolvedValue(null);

    const result = await initiativeAccess.updateInitiative(1, 1, {});

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });

  it("should handle update errors", async () => {
    Initiative.findOne.mockRejectedValue(new Error("DB Error"));

    const result = await initiativeAccess.updateInitiative(1, 1, {});

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
  });
});

describe("deleteInitiative", () => {
  it("should delete initiative successfully", async () => {
    Initiative.destroy.mockResolvedValue(1);

    const result = await initiativeAccess.deleteInitiative(1, 1);

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/deleted successfully/i);
  });

  it("should return error if initiative not found", async () => {
    Initiative.destroy.mockResolvedValue(0);

    const result = await initiativeAccess.deleteInitiative(1, 1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });

  it("should handle delete errors", async () => {
    Initiative.destroy.mockRejectedValue(new Error("DB Error"));

    const result = await initiativeAccess.deleteInitiative(1, 1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
  });
});
