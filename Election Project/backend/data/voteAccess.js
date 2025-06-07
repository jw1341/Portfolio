import { sequelize } from "../config/db.js";
import Votes from "../models/Votes.js";

// CREATE
/**
 * Takes in a validated collection of data
 * From a user creating an election.
 * The data is parsed and put into the database
 * @param {*} user_id
 * @param {*} ballot_id
 * @param {*} office_id
 * @param {*} candidate_id
 * @returns {Promise<Object>} Object with success status and vote or error
 */
export async function addVote(user_id, ballot_id, office_id, candidate_id) {
    const transaction = await sequelize.transaction();
    try {
        console.log("Received user data in data access layer to cast vote for: " + candidate_id);
        const new_vote = await Votes.create({
            user_id,
            ballot_id,
            office_id,
            candidate_id,
        }, { transaction });

        await transaction.commit();
        console.log("Vote cast successfully!");
        return { success: true, Votes: new_vote };
    } catch (error) {
        await transaction.rollback();
        console.error("Error casting vote: ", error);
        return { success: false, error: error.message };
    }
}

// READ
/**
 * Retrieves a count of votes from a ballot given office_id and candidate_id
 * @param {*} office_id
 * @param {*} candidate_id
 * @returns {Promise<Object>} returns count and array of Votes Objects if success, returns error object if not
 */
export async function countVotesByCandidate(ballot_id, office_id, candidate_id) {
    try {
        const { count, rows } = await Votes.findAndCountAll({
            where: {
                ballot_id: ballot_id,
                office_id: office_id,
                candidateId: candidate_id
            }
        });
        return { success: true, count: count, rows: rows };
    } catch (error) {
        console.error("Error retrieving vote counts: ", error);
        return { success: false, error: error.message };
    }
}

export async function getVotesByOffice(ballot_id, office_id){
    try {
        const rows = await Votes.findAll({
            where: {
                ballot_id: ballot_id,
                office_id: office_id
            }
        });
        return rows;
    } catch (error) {
        console.error("Error retrieving office votes: ", error);
        return { success: false, error: error.message };
    }
}

export async function getAllVotes(ballotId, societyId) {
    try {
        const votes = await Votes.findAll({
            where: {
                ballot_id: ballotId
            }
        });
        return votes;
    } catch (error) {
        console.error('Error fetching votes:', error);
        throw error;
    }
}

export async function getUsersVoted(ballotId) {
  try {
    const uniqueUserIds = await Votes.findAll({
      attributes: ['user_id'],
      where: { ballot_id: ballotId },
      group: ['user_id'],
      raw: true, // Returns plain objects instead of Sequelize instances
    });

    // Extract user_id values from the result
    return uniqueUserIds.map(record => record.user_id);
  } catch (error) {
    console.error('Error fetching unique user IDs:', error);
    throw error;
  }
}


// UPDATE
/**
 * Updates the Vote in the database using user_id, ballot_id, office_id, candidate_id
 * @param {*} user_id
 * @param {*} ballot_id
 * @param {*} office_id
 * @param {*} candidate_id
 * @returns {Promise<Object>} Object with success status and updated data or error
 */
export async function updateVote(user_id, ballot_id, office_id, candidate_id) {
    const transaction = await sequelize.transaction();

    try {
        const vote = await Votes.findOne({
            where: {
                user_id: user_id,
                ballot_id: ballot_id,
                office_id: office_id,
                candidate_id: candidate_id
            },
            transaction
        });

        if (!vote) {
            await transaction.rollback();
            return { success: false, error: "Vote not found" };
        }

        await Votes.update(Votes, {
            where: {
                user_id: user_id,
                ballot_id: ballot_id,
                office_id: office_id,
                candidate_id: candidate_id
            },
            transaction
        });

        const updatedVote = await Votes.findOne({
            where: {
                user_id: user_id,
                ballot_id: ballot_id,
                office_id: office_id,
                candidate_id: candidate_id
            },
            transaction
        });

        await transaction.commit();
        return { success: true, updatedVote: updatedVote };
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating vote: ", error);
        return { success: false, error: error.message };
    }
}

// DELETE
/**
 * Delete a vote from the votes table based on user_id, ballot_id, office_id, candidate_id
 * @param {*} user_id
 * @param {*} ballot_id
 * @param {*} office_id
 * @param {*} candidate_id
 * @returns {Promise<Object>} Object with success status or error
 */
export async function deleteVote(user_id, ballot_id, office_id, candidate_id) {
    const transaction = await sequelize.transaction();

    try {
        const result = await Votes.destroy({
            where: {
                user_id: user_id,
                ballot_id: ballot_id,
                office_id: office_id,
                candidate_id: candidate_id
            },
            transaction
        });

        if (result === 0) {
            await transaction.rollback();
            return { success: false, error: "Vote not found" };
        }

        await transaction.commit();
        return { success: true, message: "Vote deleted successfully" };
    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting vote: ", error);
        return { success: false, error: error.message };
    }
}

export default {
    addVote,
    getAllVotes,
    countVotesByCandidate,
    updateVote,
    deleteVote,
    getVotesByOffice
};
