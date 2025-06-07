import { jest } from "@jest/globals";
import resultsAccess from "../data/resultsAccess.js";
import OfficeResults from "../models/OfficeResults.js";
import InitiativeResults from "../models/InitiativeResults.js";
import { sequelize } from "../config/db.js";

const fakeTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

sequelize.transaction = jest.fn().mockResolvedValue(fakeTransaction);

OfficeResults.findOne = jest.fn();
OfficeResults.findAll = jest.fn();
OfficeResults.update = jest.fn();
OfficeResults.create = jest.fn();

InitiativeResults.findOne = jest.fn();
InitiativeResults.findAll = jest.fn();
InitiativeResults.update = jest.fn();
InitiativeResults.create = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("recordOfficeResults", () => {
  it("should update existing record if found", async () => {
    OfficeResults.findOne.mockResolvedValue({ id: 1 });
    OfficeResults.update.mockResolvedValue([1]);

    const result = await resultsAccess.recordOfficeResults(1, 2, 3, 100);

    expect(result.success).toBe(true);
    expect(OfficeResults.update).toHaveBeenCalled();
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should create new record if not found", async () => {
    OfficeResults.findOne.mockResolvedValue(null);
    OfficeResults.create.mockResolvedValue({ id: 1 });

    const result = await resultsAccess.recordOfficeResults(1, 2, 3, 100);

    expect(result.success).toBe(true);
    expect(OfficeResults.create).toHaveBeenCalled();
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    OfficeResults.findOne.mockRejectedValue(new Error("DB Error"));

    const result = await resultsAccess.recordOfficeResults(1, 2, 3, 100);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe("recordInitiativeResults", () => {
  it("should update existing record if found", async () => {
    InitiativeResults.findOne.mockResolvedValue({ id: 1 });
    InitiativeResults.update.mockResolvedValue([1]);

    const result = await resultsAccess.recordInitiativeResults(1, 2, 3, 50);

    expect(result.success).toBe(true);
    expect(InitiativeResults.update).toHaveBeenCalled();
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should create new record if not found", async () => {
    InitiativeResults.findOne.mockResolvedValue(null);
    InitiativeResults.create.mockResolvedValue({ id: 1 });

    const result = await resultsAccess.recordInitiativeResults(1, 2, 3, 50);

    expect(result.success).toBe(true);
    expect(InitiativeResults.create).toHaveBeenCalled();
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    InitiativeResults.findOne.mockRejectedValue(new Error("DB Error"));

    const result = await resultsAccess.recordInitiativeResults(1, 2, 3, 50);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe("getOfficeResults", () => {
  it("should return results successfully", async () => {
    OfficeResults.findAll.mockResolvedValue([{ candidate_id: 1, votes: 100 }]);

    const result = await resultsAccess.getOfficeResults(1, 2);

    expect(result.success).toBe(true);
    expect(result.results).toBeDefined();
  });

  it("should handle retrieval errors", async () => {
    OfficeResults.findAll.mockRejectedValue(new Error("DB Error"));

    const result = await resultsAccess.getOfficeResults(1, 2);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
  });
});

describe("getInitiativeResults", () => {
  it("should return results successfully", async () => {
    InitiativeResults.findAll.mockResolvedValue([{ init_option_id: 1, votes: 200 }]);

    const result = await resultsAccess.getInitiativeResults(1, 2);

    expect(result.success).toBe(true);
    expect(result.results).toBeDefined();
  });

  it("should handle retrieval errors", async () => {
    InitiativeResults.findAll.mockRejectedValue(new Error("DB Error"));

    const result = await resultsAccess.getInitiativeResults(1, 2);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
  });
});
