
import { addVote } from "../data/voteAccess.js";
import { castInitiativeVote } from "../data/initiativeAccess.js";
// const { generateVoteHash } = require("../utils/voteHashing");

/**
 * Casts a vote while ensuring anonymity.
 * @param {Number} userId - The voter's unique identifier.
 * @param {Number} electionId - The election being voted in.
 * @param {Number} officeId - The election being voted in.
 * @param {Number} candidateId - The selected candidate.
 * @returns {Promise<Object>} - Vote confirmation response.
 */
async function castVote(vote) {
    let user_id = vote.user_id;
    let election_id = vote.ballot_id;
    let office_id = vote.office_id;
    let candidate_id = vote.candidate_id;
    console.log("Data received to cast vote for: ", candidate_id, " in election ", election_id);

    let rs = await addVote(user_id, election_id, office_id, candidate_id);
    return rs;
}

async function castInitVoteService(vote) {
    console.log("Vote object received in castInitVoteService:");
    console.log(vote);
    let rs = await castInitiativeVote({
        voter_id: vote.user_id,
        ballot_id: vote.ballot_id,
        initiative_id: vote.initiative_id,
        init_option_id: vote.init_option_id
    })
    return rs;
} 
    
export default {
    castVote,
    castInitVoteService
}
