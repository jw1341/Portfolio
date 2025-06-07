import Office from "../models/Office.js";
import Ballot from "../models/Ballot.js";
import { sequelize } from "../config/db.js";


// OFFICE CRUD FUNCTIONS

// CREATE
/**
 * Takes in a validated collection of data
 * From a user creating an office for a ballot.
 * The data is parsed and put into the database
 * @param {*} officeObject 
 * @returns {Promise<Object>} Object with success status and office or error
 */
export async function addOffice(officeObject, transaction){
    if (!transaction) {
        throw new Error("Transaction must be provided to addOffice");
    }

    officeObject = mapOfficeKeys(officeObject);
    
    try {

        await sequelize.query(
            `SELECT setval('office_office_id_seq', COALESCE((SELECT MAX(office_id) FROM office), 1))`,
            { transaction }
        );

        let ballot_id = officeObject.ballot_id;

        const ballot = await Ballot.findOne({
            where: { ballot_id },
            transaction
          });
      
          if (!ballot) {
            return { success: false, error: `Ballot with ID ${ballot_id} does not exist` };
          }


        const newOffice = await Office.create(officeObject, { transaction });
        return { success: true, office: newOffice };
    } catch (error) {
        await transaction.rollback();
        console.error("Error adding office: ", error);
        return { success: false, error: error.message };
    }
}

// READ
/**
 * Retrieves an office using the primary key and returns it
 * @param {*} officeID 
 * @param {*} ballotID 
 * @returns {Promise<Object>} office Object if successful, returns error object if not
 */
export async function getOffice(officeID, ballotID){
    try {
        const office = await Office.findOne({
            where: {
                office_id: officeID,
                ballot_id: ballotID
            }
        });

        if (!office) {
            return { success: false, error: "Office not found" };
        }

        return { success: true, office: office };
    } catch (error) {
        console.error("Error retrieving office: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Retrieves all offices for a given ballot
 * @param {*} ballotID 
 * @returns {Promise<Object>} Object with offices array if successful, error object if not
 */
export async function getOfficesByBallot(ballotID){
    try {
        const offices = await Office.findAll({
            where: {
                ballot_id: ballotID
            }
        });

        return { success: true, offices: offices };
    } catch (error) {
        console.error("Error retrieving offices: ", error);
        return { success: false, error: error.message };
    }
}

// UPDATE
/**
 * Updates the office in the database using the primary key and office information
 * @param {*} officeID 
 * @param {*} ballotID 
 * @param {*} officeInfo 
 * @returns {Promise<Object>} Object with success status and updated data or error
 */
export async function updateOffice(officeID, ballotID, officeInfo){
    const transaction = await sequelize.transaction();
    
    try {
        const office = await Office.findOne({
            where: {
                office_id: officeID,
                ballot_id: ballotID
            },
            transaction
        });

        if (!office) {
            await transaction.rollback();
            return { success: false, error: "Office not found" };
        }

        // Update the office with new information
        await Office.update(officeInfo, {
            where: {
                office_id: officeID,
                ballot_id: ballotID
            },
            transaction
        });

        // Fetch updated office
        const updatedOffice = await Office.findOne({
            where: {
                office_id: officeID,
                ballot_id: ballotID
            },
            transaction
        });

        await transaction.commit();
        return { success: true, office: updatedOffice };
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating office: ", error);
        return { success: false, error: error.message };
    }
}

// DELETE
/**
 * Removes an office from the database
 * @param {*} officeID 
 * @param {*} ballotID 
 * @returns {Promise<Object>} Object with success status or error
 */
export async function deleteOffice(officeID, ballotID){
    const transaction = await sequelize.transaction();
    
    try {
        const result = await Office.destroy({
            where: {
                office_id: officeID,
                ballot_id: ballotID
            },
            transaction
        });

        if (result === 0) {
            await transaction.rollback();
            return { success: false, error: "Office not found" };
        }

        await transaction.commit();
        return { success: true, message: "Office deleted successfully" };
    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting office: ", error);
        return { success: false, error: error.message };
    }
}

function mapOfficeKeys(office) {
    return {
      office_name: office.name,
      office_num_votes: office.numVotes,
      ...office
    };
  }
  

export default {
    addOffice,
    getOffice,
    getOfficesByBallot,
    updateOffice,
    deleteOffice
};