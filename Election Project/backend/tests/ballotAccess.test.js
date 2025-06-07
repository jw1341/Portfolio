import { jest } from "@jest/globals";
import ballotAccess from "../data/ballotAccess.js";
import Ballot from "../models/Ballot.js";
import { sequelize } from "../config/db.js"; 

const fakeTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

sequelize.transaction = jest.fn().mockResolvedValue(fakeTransaction); 

Ballot.findOne = jest.fn();
Ballot.findAll = jest.fn();
Ballot.create = jest.fn();
Ballot.update = jest.fn();
Ballot.destroy = jest.fn();

describe("addBallot", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should add a new ballot if it doesn't already exist", async () => {
    Ballot.findOne.mockResolvedValue(null);
    Ballot.create.mockResolvedValue({ id: 1, title: "Test Ballot" });

    const result = await ballotAccess.addBallot({ ballot_id: 123, society_id: 1 });

    expect(result.success).toBe(true);
    expect(Ballot.create).toHaveBeenCalled();
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should not add a ballot if one already exists", async () => {
    Ballot.findOne.mockResolvedValue({ id: 123 });

    const result = await ballotAccess.addBallot({ ballot_id: 123, society_id: 1 });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/i);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it("should handle unexpected errors", async () => {
    Ballot.findOne.mockRejectedValue(new Error("DB Error"));

    const result = await ballotAccess.addBallot({ ballot_id: 123, society_id: 1 });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe("getBallot", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return a ballot if found", async () => {
    Ballot.findOne.mockResolvedValue({ id: 1 });

    const result = await ballotAccess.getBallot(1, 1);

    expect(result.success).toBe(true);
    expect(result.ballot).toBeDefined();
  });

  it("should return an error if ballot not found", async () => {
    Ballot.findOne.mockResolvedValue(null);

    const result = await ballotAccess.getBallot(1, 1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });
});

describe("getBallotsBySociety", () => {
  it("should return a list of ballots", async () => {
    Ballot.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await ballotAccess.getBallotsBySociety(1);

    expect(result.success).toBe(true);
    expect(result.ballots.length).toBe(2);
  });

  it("should handle errors", async () => {
    Ballot.findAll.mockRejectedValue(new Error("DB Error"));

    const result = await ballotAccess.getBallotsBySociety(1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
  });
});

describe("updateBallot", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should update a ballot successfully", async () => {
    Ballot.findOne.mockResolvedValueOnce({ id: 1 }); // found ballot
    Ballot.update.mockResolvedValue([1]);
    Ballot.findOne.mockResolvedValueOnce({ id: 1, title: "Updated Ballot" }); // after update

    const result = await ballotAccess.updateBallot(1, 1, { title: "Updated Ballot" });

    expect(result.success).toBe(true);
    expect(result.ballot).toBeDefined();
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should handle ballot not found", async () => {
    Ballot.findOne.mockResolvedValue(null);

    const result = await ballotAccess.updateBallot(1, 1, {});

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe("deleteBallot", () => {
  it("should delete a ballot successfully", async () => {
    Ballot.destroy.mockResolvedValue(1);

    const result = await ballotAccess.deleteBallot(1, 1);

    expect(result.success).toBe(true);
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should handle ballot not found", async () => {
    Ballot.destroy.mockResolvedValue(0);

    const result = await ballotAccess.deleteBallot(1, 1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    Ballot.destroy.mockRejectedValue(new Error("DB Error"));

    const result = await ballotAccess.deleteBallot(1, 1);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/DB Error/);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});
