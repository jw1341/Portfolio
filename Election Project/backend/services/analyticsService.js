import { getCandidatesByOffice, getCandidate } from "../data/candidateAccess.js";
import { countVotesByCandidate, getAllVotes, getUsersVoted, getVotesByOffice } from "../data/voteAccess.js";
import { getBallotsBySociety, getActiveBallots, getInactiveBallots } from "../data/ballotAccess.js";
import { getUsersBySociety, classifyVoterParticipation } from "../data/userAccess.js";
import { getInitiativeVotingOptions, getInitiativesByBallot } from "../data/initiativeAccess.js";
import { getInitiativeResults } from "../data/resultsAccess.js";

import { getOfficesByBallot } from "../data/officeAccess.js";

/**
 * Counts votes for each candidate in a specific office.
 * @param {number} office - The office ID.
 * @returns {Promise<Array>} - Aggregated vote counts per candidate.
 */
export async function officeVotes(officeId) {
    console.log("Received request to count votes in Office: ", officeId);
    const rs = await getCandidatesByOffice(officeId);
    const candidates = rs.candidates;

    if(candidates.length()===0){
        console.log("Error finding candidates in office ", rs.error);
        console.log("This is the status of rs.success: " + rs.success);
        return { success: false, error: "Failed to count votes in office ", officeId };
    }
    else{
        const aggregatedVotes = [];
        // count votes for every candidate
        for (const candidate of candidates) {
            NumVotes = await countVotesByCandidate(officeId, candidate.candidate_id);
            // adds office results to array
            aggregatedVotes.push({
                candidate: candidate.candidate_id,
                votes: NumVotes.count
            });
        }
        // returns votes per office candidate
        return aggregatedVotes;
    }
}

/**
 * Counts total votes in a society
 * @param {number} societyId - The ID of the society
 * @returns {Promise<Number>} - Total number of votes made in a society
 */
export async function totalVotesBySociety(societyId) {
    console.log("Received request to count total votes in society: ", societyId);
    const result = await getBallotsBySociety(societyId);

    const votes = 0;
    for (const ballot of result.ballots){
        // gets all office objects 
        const offices = await getOfficesByBallot(ballot);

        // iterate through each office
        for (const office of offices.offices){
            // count votes based on office_id of each office object
            const officeVotes = await officeVotes(office.office_id);
            // iterate through the aggregated array to sum votes
            for (const entry of officeVotes) {
                votes+=entry.votes;
            }
        }
    }
    return votes;
}

/**
 * Returns number of active ballots
 * @param {number} societyId - The society_id to look for active ballots in
 * @returns {Promise<number>} - Number of active ballots in society
 */
export async function getActiveBallotAnalytics(societyId) {
    return getActiveBallots(societyId);
}

/**
 * Returns number of inactive ballots
 * @param {number} societyId - The society_id to look for inactive ballots in
 * @returns {Promise<number>} - Number of active ballots
 */
export async function getInactiveBallotAnalytics(societyId) {
    return getInactiveBallots(societyId);
}

/**
 * Checks voter turnout for a society.
 * @param {number} societyId - The society ID
 * @returns {Promise<number>} - Turnout percentage.
 */
export async function getVoterTurnout(ballot_id, societyId) {
    const usersVoted = await getUsersVoted(ballot_id);
    const allUsers = await getUsersBySociety(societyId);
    console.log("Length of usersVoted: " + usersVoted.length);
    console.log("Count of allUsers: " + allUsers.numUsers);

    if (!allUsers.success) {
        console.log(allUsers);
        throw new Error("Failed to retrieve number of society users. Voter turnover calculation failed.");
    }
    // Calculate total user turnover for society
    return usersVoted.length / allUsers.numUsers;
}

export async function getUsersVotedService(ballot_id, society_id){
    console.log("Getting users who voted in ballot number: " + ballot_id);

    let usersVoted = await getUsersVoted(ballot_id);

    console.log("Length of usersVoted: " + usersVoted.length);

    console.log("Getting users in society number " + society_id + " who did and did not vote");
    let voterParticipation = await classifyVoterParticipation(usersVoted, society_id);

    return voterParticipation;
}

export async function getOfficeResults(ballot_id, office_id){
    console.log("Getting Office Votes...");
    const officeVotes = await getVotesByOffice(ballot_id, office_id);
    console.log(officeVotes.length);
    console.log("Summarizing Office Votes...");
    const officeResults = await summarizeVotes(officeVotes);
    console.log(officeResults);

    return officeResults;
}

async function summarizeVotes(votes) {
    const totalVotes = votes.length;
    const counts = {};
  
    // Count appearances of each candidate_id
    votes.forEach(({ candidate_id }) => {
      counts[candidate_id] = (counts[candidate_id] || 0) + 1;
    });
  
    const result = [];

  for (const [candidate_id, count] of Object.entries(counts)) {
    const candidate = await getCandidate(candidate_id);
    result.push({
      candidate,
      count,
      percentage: ((count / totalVotes) * 100).toFixed(2)
    });
  }

  return result;
}

export async function getBallotResults(ballot_id){
    console.log("Getting ballot results for: ", ballot_id);
    const ballotResults = [];
    const offices = await getOfficesByBallot(ballot_id);
    for(let office of offices.offices){
        let office_id = office.office_id;
        let office_name = office.office_name;
        let numVotes = office.office_num_votes;

        let officeResults = await getOfficeResults(ballot_id, office_id);
        ballotResults.push({
            office_id: office_id,
            office_name: office_name,
            numVotes: numVotes,
            officeResults: officeResults
        });
    }

    console.log("Length of ballotResults: " + ballotResults.length);
    return ballotResults;
}

export async function getInitiativeResultsService(ballot_id,){
    console.log("\n\nGetting initiatives from ballot", ballot_id);
    const initiatives = await getInitiativesByBallot(ballot_id);

    const plainInitiatives = initiatives.map(i => i.get({ plain: true }));

    console.log("Initiatives acquired");
    console.log(initiatives.length);
    console.log(plainInitiatives);

    let results = [];

    for(let init of plainInitiatives){
        console.log("In the for loop...");
        console.log(init);
        let init_id = init.initiative_id;
        const options = await getInitiativeVotingOptions(init_id);
        console.log("Options for", init_id);
        console.log(options);
        let votes = await getInitiativeResults(ballot_id, init_id);
        votes = votes.results.map(vote => vote.dataValues.init_option_id);
        console.dir(votes, {depth: null});
        let init_rs = summarizeTopInitiativeVote(options.initiative_voting_options, votes);
        results.push({name: init.initiative_name, initiative_id: init_id, ...init_rs});
    }

    return results;
}

function summarizeTopInitiativeVote(options, votes) {
    if (!votes.length) return null;
  
    const counts = {};
  
    // Count votes
    votes.forEach(v => {
      counts[v] = (counts[v] || 0) + 1;
    });
  
    // Find most frequent vote
    let topVote = null;
    let maxCount = 0;
  
    for (const [voteVal, count] of Object.entries(counts)) {
      if (count > maxCount) {
        topVote = parseInt(voteVal);
        maxCount = count;
      }
    }
  
    const totalVotes = votes.length;
    const percentage = ((maxCount / totalVotes) * 100).toFixed(2);
    const label = options[`option${topVote}`];
  
    return {
      mostVotedOptionIndex: topVote,
      count: maxCount,
      percentage,
      label
    };
  }
  
  


export default { officeVotes, getVoterTurnout, getActiveBallotAnalytics, getInactiveBallotAnalytics, totalVotesBySociety, getBallotResults, getInitiativeResultsService};
