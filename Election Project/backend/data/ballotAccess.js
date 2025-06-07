import Ballot from "../models/Ballot.js";
import {sequelize} from "../config/db.js";
import { addOffice } from "./officeAccess.js";
import { addCandidate } from "./candidateAccess.js";
import { addInitiative } from "./initiativeAccess.js";
import { Op } from "sequelize";

// CREATE
/**
 * Takes in a validated collection of data
 * From a user creating an election.
 * The data is parsed and put into the database
 * @param {*} ballotObject 
 * @returns {Promise<Object>} Object with success status and ballot or error
 */
export async function addBallot(ballotObject) {
    const transaction = await sequelize.transaction();
    let results = [];

    try {
        // Remove ballot_id if it's in the input (we want auto-increment to handle it)
        const { ballot_id, ...ballotData } = ballotObject;


        console.log("Captured ballot object in data access layer:");
        console.dir(ballotData, { depth: null });


        // Ensure the ballot_id sequence is in sync with the current max value
        await sequelize.query(
            `SELECT setval('ballot_ballot_id_seq', COALESCE((SELECT MAX(ballot_id) FROM ballot), 1))`,
            { transaction }
        );

        // Create the new ballot
        const newBallot = await Ballot.create(ballotData, { transaction });
        results.push(newBallot);

        let new_ballot_id = newBallot.ballot_id;
        console.log("Ballot ID: ", new_ballot_id);
        console.log("New ballot object in data access layer:");
        console.dir(newBallot, { depth: null });

        for(let office of Object.values(ballotData.offices)){
            console.log("Adding office...");
            let o = await addOffice({"ballot_id": newBallot.ballot_id, ...office}, transaction);
            console.log("New office:");
            console.log(o);
            results.push(o);
            for(let candidate of Object.values(office.candidates)){
                console.log("Adding candidate...");
                let c = await addCandidate({"office_id": o.office.office_id, ...candidate}, transaction);
                results.push(c);
            }
        }

        for(let initiative of Object.values(ballotData.initiatives)){
            console.log("Adding initiative...");
            let i = await addInitiative({"ballot_id": newBallot.ballot_id, ...initiative}, transaction);
            results.push(i);
        }

        console.log("Committing transaction...");
        await transaction.commit();
        return {
            success: true,
            results: results,
            error: "No error. It worked :)"
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Error adding ballot: ", error);
        return {
            success: false,
            error: error.message || "Validation error"
        };
    }
}



// READ
/**
 * Retrieves a ballot using the primary composite key and returns it
 * @param {*} ballotID 
 * @param {*} societyID 
 * @returns {Promise<Object>} ballot Object if successful, returns error object if not
 */
export async function getBallot(ballotID, societyID){
    try {
        const ballot = await Ballot.findOne({
            where: {
                ballot_id: ballotID,
                society_id: societyID
            }
        });

        if (!ballot) {
            return { success: false, error: "Ballot not found" };
        }

        return { success: true, ballot: ballot };
    } catch (error) {
        console.error("Error retrieving ballot: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Retrieves all ballots for a society
 * @param {*} societyID 
 * @returns {Promise<Object>} Object with ballots array if successful, error object if not
 */
export async function getBallotsBySociety(societyID) {
    try {
        const ballots = await Ballot.findAll({
            where: {
                society_id: societyID
            }
        });

        return { success: true, ballots: ballots };
    } catch (error) {
        console.error("Error retrieving ballots: ", error);
        return { success: false, error: error.message };
    }
}

// UPDATE
/**
 * Updates the ballot in the database using the primary key and ballot information
 * @param {*} ballotID 
 * @param {*} societyID 
 * @param {*} ballotInfo 
 * @returns {Promise<Object>} Object with success status and updated data or error
 */
export async function updateBallot(ballotID, societyID, ballotInfo){
    // Start transaction
    const transaction = await sequelize.transaction();
    
    try {
        const ballot = await Ballot.findOne({
            where: {
                ballot_id: ballotID,
                society_id: societyID
            },
            transaction
        });

        if (!ballot) {
            await transaction.rollback();
            return { success: false, error: "Ballot not found" };
        }

        // Update the ballot with new information
        await Ballot.update(ballotInfo, {
            where: {
                ballot_id: ballotID,
                society_id: societyID
            },
            transaction
        });

        // Fetch updated ballot
        const updatedBallot = await Ballot.findOne({
            where: {
                ballot_id: ballotID,
                society_id: societyID
            },
            transaction
        });

        // Commit transaction
        await transaction.commit();
        return { success: true, ballot: updatedBallot };
    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        console.error("Error updating ballot: ", error);
        return { success: false, error: error.message };
    }
}

// DELETE
/**
 * Instead of actually deleting the ballot, we would typically update a status field
 * or move it to an archive table. Since the ER diagram doesn't specify a 'deleted' field
 * for ballots, we'll implement a hard delete.
 * 
 * @param {*} ballotID 
 * @param {*} societyID 
 * @returns {Promise<Object>} Object with success status or error
 */
export async function deleteBallot(ballotID){
    // Start transaction
    const transaction = await sequelize.transaction();
    
    try {
        const result = await Ballot.destroy({
            where: {
                ballot_id: ballotID,
            },
            transaction
        });

        if (result === 0) {
            await transaction.rollback();
            return { success: false, error: "Ballot not found" };
        }

        // Commit transaction
        await transaction.commit();
        return { success: true, message: "Ballot deleted successfully" };
    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        console.error("Error deleting ballot: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Returns number of active ballots
 * @returns {Promise<number>} - Number of active ballots
 */
export async function getActiveBallots(society_id) {
    const targetDate = new Date();
    const activeBallots = await Ballot.findAll({
      where: {
        "endDate": { [Op.gt]: targetDate },
        society_id: society_id
      }
    });
    return activeBallots;
}

/**
 * Returns number of inactive ballots
 * @returns {Promise<number>} - Turnout active ballot number
 */
export async function getInactiveBallots(society_id) {
    const targetDate = new Date();
    const inactiveBallots = await Ballot.findAll({
      where: {
        "endDate": { [Op.lt]: targetDate },
        society_id: society_id
      }
    });
    return inactiveBallots;
}

export default {
    addBallot,
    getBallot,
    getBallotsBySociety,
    updateBallot,
    deleteBallot,
    getActiveBallots,
    getInactiveBallots
};