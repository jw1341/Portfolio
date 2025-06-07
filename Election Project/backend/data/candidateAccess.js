import Candidate from "../models/Candidate.js";
import Office from "../models/Office.js";
import OfficeCandidate from "../models/OfficeCandidate.js";
import { sequelize } from "../config/db.js";


// CANDIDATE CRUD FUNCTIONS

// CREATE
/**
 * Takes in a validated collection of data
 * From a user creating a candidate.
 * The data is parsed and put into the database
 * @param {*} candidateObject 
 * @returns {Promise<Object>} Object with success status and candidate or error
 */
export async function addCandidate(candidateObject, transaction){
    if (!transaction) {
        throw new Error("Transaction must be provided to addCandidate");
    }
    
    try {
        const newCandidate = await Candidate.create(candidateObject, { transaction });
        return { success: true, candidate: newCandidate };
    } catch (error) {
        await transaction.rollback();
        console.error("Error adding candidate: ", error);
        return { success: false, error: error.message };
    }
}

// READ
/**
 * Retrieves a candidate using the primary key and returns it
 * @param {*} candidateID 
 * @returns {Promise<Object>} candidate Object if successful, returns error object if not
 */
export async function getCandidate(candidateID){
    try {
        const candidate = await Candidate.findOne({
            where: {
                candidate_id: candidateID
            }
        });

        if (!candidate) {
            return { success: false, error: "Candidate not found" };
        }

        return { success: true, candidate: candidate };
    } catch (error) {
        console.error("Error retrieving candidate: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Associates a candidate with an office
 * @param {*} candidateID 
 * @param {*} officeID 
 * @returns {Promise<Object>} Object with success status or error
 */
export async function assignCandidateToOffice(candidateID, officeID) {
    const transaction = await sequelize.transaction();
  
    try {
      // Check if the candidate exists
      const candidate = await Candidate.findOne({
        where: { candidate_id: candidateID },
        transaction
      });
  
      if (!candidate) {
        await transaction.rollback();
        return { success: false, error: "Candidate not found" };
      }
  
      // Check if the office exists
      const office = await Office.findOne({
        where: { office_id: officeID },
        transaction
      });
  
      if (!office) {
        await transaction.rollback();
        return { success: false, error: "Office not found" };
      }
  
      // Check if already assigned
      if (candidate.office_id === officeID) {
        await transaction.rollback();
        return { success: false, error: "Candidate is already assigned to this office" };
      }
  
      // Assign candidate to office
      await candidate.update({ office_id: officeID }, { transaction });
  
      await transaction.commit();
      return { success: true, message: "Candidate assigned to office successfully" };
    } catch (error) {
      await transaction.rollback();
      console.error("Error assigning candidate to office: ", error);
      return { success: false, error: error.message };
    }
  }
  

/**
 * Retrieves all candidates for a given office
 * @param {*} officeID 
 * @returns {Promise<Object>} Object with candidates array if successful, error object if not
 */
export async function getCandidatesByOffice(officeID) {
    try {
      const candidates = await Candidate.findAll({
        where: { office_id: officeID }
      });
  
      return { success: true, candidates };
    } catch (error) {
      console.error("Error retrieving candidates by office: ", error);
      return { success: false, error: error.message };
    }
  }
  

// UPDATE
/**
 * Updates the candidate in the database using the primary key and candidate information
 * @param {*} candidateID 
 * @param {*} candidateInfo 
 * @returns {Promise<Object>} Object with success status and updated data or error
 */
export async function updateCandidate(candidateID, candidateInfo){
    const transaction = await sequelize.transaction();
    
    try {
        const candidate = await Candidate.findOne({
            where: {
                candidate_id: candidateID
            },
            transaction
        });

        if (!candidate) {
            await transaction.rollback();
            return { success: false, error: "Candidate not found" };
        }

        // Update the candidate with new information
        await Candidate.update(candidateInfo, {
            where: {
                candidate_id: candidateID
            },
            transaction
        });

        // Fetch updated candidate
        const updatedCandidate = await Candidate.findOne({
            where: {
                candidate_id: candidateID
            },
            transaction
        });

        await transaction.commit();
        return { success: true, candidate: updatedCandidate };
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating candidate: ", error);
        return { success: false, error: error.message };
    }
}

// DELETE
/**
 * Removes a candidate from the database
 * @param {*} candidateID 
 * @returns {Promise<Object>} Object with success status or error
 */
export async function deleteCandidate(candidateID){
    const transaction = await sequelize.transaction();
    
    try {
        // First remove any office associations
        await OfficeCandidate.destroy({
            where: {
                candidate_id: candidateID
            },
            transaction
        });

        // Then delete the candidate
        const result = await Candidate.destroy({
            where: {
                candidate_id: candidateID
            },
            transaction
        });

        if (result === 0) {
            await transaction.rollback();
            return { success: false, error: "Candidate not found" };
        }

        await transaction.commit();
        return { success: true, message: "Candidate deleted successfully" };
    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting candidate: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Removes a candidate from an office
 * @param {*} candidateID 
 * @param {*} officeID 
 * @returns {Promise<Object>} Object with success status or error
 */
export async function removeCandidateFromOffice(candidateID, officeID){
    const transaction = await sequelize.transaction();
    
    try {
        const result = await OfficeCandidate.destroy({
            where: {
                candidate_id: candidateID,
                office_id: officeID
            },
            transaction
        });

        if (result === 0) {
            await transaction.rollback();
            return { success: false, error: "Candidate is not assigned to this office" };
        }

        await transaction.commit();
        return { success: true, message: "Candidate removed from office successfully" };
    } catch (error) {
        await transaction.rollback();
        console.error("Error removing candidate from office: ", error);
        return { success: false, error: error.message };
    }
}

export default {
    addCandidate,
    getCandidate,
    assignCandidateToOffice,
    getCandidatesByOffice,
    updateCandidate,
    deleteCandidate,
    removeCandidateFromOffice
};