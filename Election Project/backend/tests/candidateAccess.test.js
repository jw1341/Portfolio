import { jest } from "@jest/globals";
import candidateAccess from "../data/candidateAccess.js";
import Candidate from "../models/Candidate.js";
import Office from "../models/Office.js";
import OfficeCandidate from "../models/OfficeCandidate.js";
import { sequelize } from "../config/db.js"; 

const fakeTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

sequelize.transaction = jest.fn().mockResolvedValue(fakeTransaction); 

Candidate.findOne = jest.fn();
Candidate.findAll = jest.fn();
Candidate.create = jest.fn();
Candidate.update = jest.fn();
Candidate.destroy = jest.fn();

Office.findOne = jest.fn();

OfficeCandidate.findOne = jest.fn();
OfficeCandidate.findAll = jest.fn();
OfficeCandidate.create = jest.fn();
OfficeCandidate.destroy = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("addCandidate", () => {
  it("should add a new candidate", async () => {
    Candidate.findOne.mockResolvedValue(null);
    Candidate.create.mockResolvedValue({ id: 1 });

    const result = await candidateAccess.addCandidate({ candidate_id: 1 });

    expect(result.success).toBe(true);
    expect(Candidate.create).toHaveBeenCalled();
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it("should not add an existing candidate", async () => {
    Candidate.findOne.mockResolvedValue({ id: 1 });

    const result = await candidateAccess.addCandidate({ candidate_id: 1 });

    expect(result.success).toBe(false);
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe("getCandidate", () => {
  it("should return a candidate", async () => {
    Candidate.findOne.mockResolvedValue({ id: 1 });

    const result = await candidateAccess.getCandidate(1);

    expect(result.success).toBe(true);
    expect(result.candidate).toBeDefined();
  });

  it("should return error if not found", async () => {
    Candidate.findOne.mockResolvedValue(null);

    const result = await candidateAccess.getCandidate(1);

    expect(result.success).toBe(false);
  });
});

describe("assignCandidateToOffice", () => {
  it("should assign a candidate to an office", async () => {
    Candidate.findOne.mockResolvedValue({ id: 1 });
    Office.findOne.mockResolvedValue({ id: 2 });
    OfficeCandidate.findOne.mockResolvedValue(null);
    OfficeCandidate.create.mockResolvedValue({});

    const result = await candidateAccess.assignCandidateToOffice(1, 2);

    expect(result.success).toBe(true);
    expect(OfficeCandidate.create).toHaveBeenCalled();
  });

  it("should not assign if candidate not found", async () => {
    Candidate.findOne.mockResolvedValue(null);

    const result = await candidateAccess.assignCandidateToOffice(1, 2);

    expect(result.success).toBe(false);
  });

  it("should not assign if office not found", async () => {
    Candidate.findOne.mockResolvedValue({ id: 1 });
    Office.findOne.mockResolvedValue(null);

    const result = await candidateAccess.assignCandidateToOffice(1, 2);

    expect(result.success).toBe(false);
  });

  it("should not assign if already assigned", async () => {
    Candidate.findOne.mockResolvedValue({ id: 1 });
    Office.findOne.mockResolvedValue({ id: 2 });
    OfficeCandidate.findOne.mockResolvedValue({});

    const result = await candidateAccess.assignCandidateToOffice(1, 2);

    expect(result.success).toBe(false);
  });
});

describe("getCandidatesByOffice", () => {
  it("should get candidates for an office", async () => {
    OfficeCandidate.findAll.mockResolvedValue([{ candidate_id: 1 }, { candidate_id: 2 }]);
    Candidate.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await candidateAccess.getCandidatesByOffice(2);

    expect(result.success).toBe(true);
    expect(result.candidates.length).toBe(2);
  });
});

describe("updateCandidate", () => {
  it("should update a candidate", async () => {
    Candidate.findOne.mockResolvedValueOnce({ id: 1 }); // check exists
    Candidate.update.mockResolvedValue([1]);
    Candidate.findOne.mockResolvedValueOnce({ id: 1, name: "Updated" }); // after update

    const result = await candidateAccess.updateCandidate(1, { name: "Updated" });

    expect(result.success).toBe(true);
    expect(result.candidate).toBeDefined();
  });

  it("should fail if candidate not found", async () => {
    Candidate.findOne.mockResolvedValue(null);

    const result = await candidateAccess.updateCandidate(1, {});

    expect(result.success).toBe(false);
  });
});

describe("deleteCandidate", () => {
  it("should delete a candidate", async () => {
    OfficeCandidate.destroy.mockResolvedValue(1);
    Candidate.destroy.mockResolvedValue(1);

    const result = await candidateAccess.deleteCandidate(1);

    expect(result.success).toBe(true);
  });

  it("should fail if candidate not found", async () => {
    OfficeCandidate.destroy.mockResolvedValue(0);
    Candidate.destroy.mockResolvedValue(0);

    const result = await candidateAccess.deleteCandidate(1);

    expect(result.success).toBe(false);
  });
});

describe("removeCandidateFromOffice", () => {
  it("should remove candidate from office", async () => {
    OfficeCandidate.destroy.mockResolvedValue(1);

    const result = await candidateAccess.removeCandidateFromOffice(1, 2);

    expect(result.success).toBe(true);
  });

  it("should fail if candidate not in office", async () => {
    OfficeCandidate.destroy.mockResolvedValue(0);

    const result = await candidateAccess.removeCandidateFromOffice(1, 2);

    expect(result.success).toBe(false);
  });
});
