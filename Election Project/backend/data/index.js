import societyAccess from "./societyAccess.js";
import ballotAccess from "./ballotAccess.js";
import officeAccess from "./officeAccess.js";
import initiativeAccess from "./initiativeAccess.js";
import candidateAccess from "./candidateAccess.js";
import resultsAccess from "./resultsAccess.js";
import societyAccess from "./societyAccess.js";

export default {
    // Society functions
    addSociety: societyAccess.addSociety,
    getSociety: societyAccess.getSociety,
    getAllSocieties: societyAccess.getAllSocieties,
    updateSociety: societyAccess.updateSociety,
    deleteSociety: societyAccess.deleteSociety,
    // Ballot functions
    addBallot: ballotAccess.addBallot,
    getBallot: ballotAccess.getBallot,
    getBallotsBySociety: ballotAccess.getBallotsBySociety,
    updateBallot: ballotAccess.updateBallot,
    deleteBallot: ballotAccess.deleteBallot,

    // Office functions
    addOffice: officeAccess.addOffice,
    getOffice: officeAccess.getOffice,
    getOfficesByBallot: officeAccess.getOfficesByBallot,
    updateOffice: officeAccess.updateOffice,
    deleteOffice: officeAccess.deleteOffice,

    // Initiative functions
    addInitiative: initiativeAccess.addInitiative,
    getInitiative: initiativeAccess.getInitiative,
    getInitiativesByBallot: initiativeAccess.getInitiativesByBallot,
    updateInitiative: initiativeAccess.updateInitiative,
    deleteInitiative: initiativeAccess.deleteInitiative,

    // Candidate functions
    addCandidate: candidateAccess.addCandidate,
    getCandidate: candidateAccess.getCandidate,
    assignCandidateToOffice: candidateAccess.assignCandidateToOffice,
    getCandidatesByOffice: candidateAccess.getCandidatesByOffice,
    updateCandidate: candidateAccess.updateCandidate,
    deleteCandidate: candidateAccess.deleteCandidate,
    removeCandidateFromOffice: candidateAccess.removeCandidateFromOffice,

    // Results functions
    recordOfficeResults: resultsAccess.recordOfficeResults,
    recordInitiativeResults: resultsAccess.recordInitiativeResults,
    getOfficeResults: resultsAccess.getOfficeResults,
    getInitiativeResults: resultsAccess.getInitiativeResults
};