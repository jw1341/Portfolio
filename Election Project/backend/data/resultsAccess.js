import OfficeResults from "../models/OfficeResults.js";
import InitiativeResults from "../models/InitiativeResults.js";
import InitiativeVote from "../models/InitiativeVotes.js";
import { sequelize } from "../config/db.js";


// RESULTS FUNCTIONS

/**
 * Records or updates the results for an office election
 * @param {*} ballotID 
 * @param {*} officeID 
 * @param {*} candidateID 
 * @param {*} votes 
 * @returns {Promise<Object>} Object with success status or error
 */
async function recordOfficeResults(ballotID, officeID, candidateID, votes){
    const transaction = await sequelize.transaction();
    
    try {
        // Check if record already exists
        const existingResult = await OfficeResults.findOne({
            where: {
                ballot_id: ballotID,
                office_id: officeID,
                candidate_id: candidateID
            },
            transaction
        });

        if (existingResult) {
            // Update existing record
            await OfficeResults.update({
                num_votes: votes
            }, {
                where: {
                    ballot_id: ballotID,
                    office_id: officeID,
                    candidate_id: candidateID
                },
                transaction
            });
        } else {
            // Create new record
            await OfficeResults.create({
                ballot_id: ballotID,
                office_id: officeID,
                candidate_id: candidateID,
                num_votes: votes
            }, { transaction });
        }

        await transaction.commit();
        return { success: true, message: "Office results recorded successfully" };
    } catch (error) {
        await transaction.rollback();
        console.error("Error recording office results: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Records or updates the results for an initiative
 * @param {*} ballotID 
 * @param {*} initiativeID 
 * @param {*} optionID 
 * @param {*} votes 
 * @returns {Promise<Object>} Object with success status or error
 */
async function recordInitiativeResults(ballotID, initiativeID, optionID, votes){
    const transaction = await sequelize.transaction();
    
    try {
        // Check if record already exists
        const existingResult = await InitiativeResults.findOne({
            where: {
                ballot_id: ballotID,
                initiative_id: initiativeID,
                init_option_id: optionID
            },
            transaction
        });

        if (existingResult) {
            // Update existing record
            await InitiativeResults.update({
                num_votes: votes
            }, {
                where: {
                    ballot_id: ballotID,
                    initiative_id: initiativeID,
                    init_option_id: optionID
                },
                transaction
            });
        } else {
            // Create new record
            await InitiativeResults.create({
                ballot_id: ballotID,
                initiative_id: initiativeID,
                init_option_id: optionID,
                num_votes: votes
            }, { transaction });
        }

        await transaction.commit();
        return { success: true, message: "Initiative results recorded successfully" };
    } catch (error) {
        await transaction.rollback();
        console.error("Error recording initiative results: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Gets the results for an office election
 * @param {*} ballotID 
 * @param {*} officeID 
 * @returns {Promise<Object>} results object if successful, error object if not
 */
async function getOfficeResults(ballotID, officeID){
    try {
        const results = await OfficeResults.findAll({
            where: {
                ballot_id: ballotID,
                office_id: officeID
            }
        });

        return { success: true, results: results };
    } catch (error) {
        console.error("Error getting office results: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Gets the results for an initiative
 * @param {*} ballotID 
 * @param {*} initiativeID 
 * @returns {Promise<Object>} results object if successful, error object if not
 */
export async function getInitiativeResults(ballotID, initiativeID){
    try {
        const results = await InitiativeVote.findAll({
            where: {
                ballot_id: ballotID,
                initiative_id: initiativeID
            }
        });

        return { success: true, results: results };
    } catch (error) {
        console.error("Error getting initiative results: ", error);
        return { success: false, error: error.message };
    }
}

export default {
    recordOfficeResults,
    recordInitiativeResults,
    getOfficeResults,
    getInitiativeResults
};