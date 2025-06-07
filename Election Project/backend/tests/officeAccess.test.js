import { jest } from "@jest/globals";
import officeAccess from "../data/officeAccess.js";
import Office from "../models/Office.js";
import Ballot from "../models/Ballot.js";
import { sequelize } from "../config/db.js";

const fakeTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

sequelize.transaction = jest.fn().mockResolvedValue(fakeTransaction);

Office.findOne = jest.fn();
Office.findAll = jest.fn();
Office.create = jest.fn();
Office.update = jest.fn();
Office.destroy = jest.fn();
Ballot.findOne = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("addOffice", () => {
  it("should add a new office if it doesn't already exist", async () => {
    Office.findOne.mockResolvedValue(null);
    Ballot.findOne.mockResolvedValue({ id: 1 });
    Office.create.mockResolvedValue({ id: 1 });

    const result = await officeAccess.addOffice({ office_id: 1, ballot_id: 1 });

    expect(result.success).toBe(true);
    expect(Office.create).toHaveBeenCalled();
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should not add if office already exists", async () => {
    Office.findOne.mockResolvedValue({ id: 1 });

    const result = await officeAccess.addOffice({ office_id: 1, ballot_id: 1 });

    expect(result.success).toBe(false);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it("should not add if ballot not found", async () => {
    Office.findOne.mockResolvedValue(null);
    Ballot.findOne.mockResolvedValue(null);

    const result = await officeAccess.addOffice({ office_id: 1, ballot_id: 1 });

    expect(result.success).toBe(false);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    Office.findOne.mockRejectedValue(new Error("DB Error"));

    const result = await officeAccess.addOffice({ office_id: 1, ballot_id: 1 });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe("getOffice", () => {
  it("should return office if found", async () => {
    Office.findOne.mockResolvedValue({ id: 1 });

    const result = await officeAccess.getOffice(1, 1);

    expect(result.success).toBe(true);
    expect(result.office).toBeDefined();
  });

  it("should return error if office not found", async () => {
    Office.findOne.mockResolvedValue(null);

    const result = await officeAccess.getOffice(1, 1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });
});

describe("getOfficesByBallot", () => {
  it("should return list of offices", async () => {
    Office.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await officeAccess.getOfficesByBallot(1);

    expect(result.success).toBe(true);
    expect(result.offices.length).toBe(2);
  });

  it("should handle errors", async () => {
    Office.findAll.mockRejectedValue(new Error("DB Error"));

    const result = await officeAccess.getOfficesByBallot(1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
  });
});

describe("updateOffice", () => {
  it("should update office successfully", async () => {
    Office.findOne.mockResolvedValueOnce({ id: 1 });
    Office.update.mockResolvedValue([1]);
    Office.findOne.mockResolvedValueOnce({ id: 1, name: "Updated" });

    const result = await officeAccess.updateOffice(1, 1, { name: "Updated" });

    expect(result.success).toBe(true);
    expect(result.office).toBeDefined();
  });

  it("should return error if office not found", async () => {
    Office.findOne.mockResolvedValue(null);

    const result = await officeAccess.updateOffice(1, 1, {});

    expect(result.success).toBe(false);
  });

  it("should handle update errors", async () => {
    Office.findOne.mockRejectedValue(new Error("DB Error"));

    const result = await officeAccess.updateOffice(1, 1, {});

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
  });
});

describe("deleteOffice", () => {
  it("should delete office successfully", async () => {
    Office.destroy.mockResolvedValue(1);

    const result = await officeAccess.deleteOffice(1, 1);

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/deleted successfully/i);
  });

  it("should return error if office not found", async () => {
    Office.destroy.mockResolvedValue(0);

    const result = await officeAccess.deleteOffice(1, 1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });

  it("should handle delete errors", async () => {
    Office.destroy.mockRejectedValue(new Error("DB Error"));

    const result = await officeAccess.deleteOffice(1, 1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
  });
});
