import Society from "../models/Society.js";
import { sequelize } from "../config/db.js";
import { Op } from "sequelize";


// CREATE
/**
 * Creates a new society in the database
 * @param {Object} societyData - The society data to add
 * @returns {Promise<Object>} Object with success status and society or error
 */
async function addSociety(societyData) {
    const transaction = await sequelize.transaction();
    
    try {
        // Check if society with same name already exists
        const existingSociety = await Society.findOne({
            where: { society_name: societyData.society_name },
            transaction
        });

        if (existingSociety) {
            await transaction.rollback();
            return { success: false, error: "Society with this name already exists" };
        }

        await sequelize.query(
            `SELECT setval('societies_society_id_seq', COALESCE((SELECT MAX(society_id) FROM societies), 1))`,
            { transaction }
        );

        const newSociety = await Society.create(societyData, { transaction });
        
        await transaction.commit();
        return { success: true, society: newSociety };
    } catch (error) {
        await transaction.rollback();
        console.error("Error adding society: ", error);
        return { success: false, error: error.message };
    }
}

// READ
/**
 * Retrieves a society by ID
 * @param {number} societyID - The ID of the society to retrieve
 * @returns {Promise<Object>} Object with success status and society or error
 */
async function getSocietyById(societyID) {
    try {
        const society = await Society.findOne({
            where: {
                society_id: societyID,
                deleted: false
            }
        });

        if (!society) {
            return { success: false, error: "Society not found" };
        }

        return { success: true, society: society };
    } catch (error) {
        console.error("Error retrieving society: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Retrieves all active societies
 * @returns {Promise<Object>} Object with success status and societies array or error
 */
async function getAllSocieties() {
    try {
        console.log("Right before getting all societies");
        const societies = await Society.findAll({
            where: { deleted: false }
        });
        console.log("Right after getting all societies");

        // console.log(societies);

        return { success: true, societies: societies };
    } catch (error) {
        console.error("Error retrieving societies: ", error);
        return { success: false, error: error.message };
    }
}

// UPDATE
/**
 * Updates a society's information
 * @param {number} societyID - The ID of the society to update
 * @param {Object} societyData - The new society data
 * @returns {Promise<Object>} Object with success status and updated society or error
 */
async function updateSociety(societyID, societyData) {
    const transaction = await sequelize.transaction();
    
    try {
        const society = await Society.findOne({
            where: {
                society_id: societyID,
                deleted: false
            },
            transaction
        });

        if (!society) {
            await transaction.rollback();
            return { success: false, error: "Society not found" };
        }

        // If updating name, check for conflicts
        if (societyData.name) {
            const nameExists = await Society.findOne({
                where: {
                    name: societyData.society_name,
                    society_id: { [Op.ne]: societyID }
                },
                transaction
            });

            if (nameExists) {
                await transaction.rollback();
                return { success: false, error: "Society with this name already exists" };
            }
        }

        // Update the society
        await Society.update(societyData, {
            where: { society_id: societyID },
            transaction
        });

        // Fetch updated society
        const updatedSociety = await Society.findOne({
            where: { society_id: societyID },
            transaction
        });

        await transaction.commit();
        return { success: true, society: updatedSociety };
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating society: ", error);
        return { success: false, error: error.message };
    }
}

// DELETE (Soft Delete)
/**
 * Soft deletes a society by setting the deleted flag to true
 * @param {number} societyID - The ID of the society to delete
 * @returns {Promise<Object>} Object with success status or error
 */
async function deleteSociety(societyID) {
    const transaction = await sequelize.transaction();
    
    try {
        const society = await Society.findOne({
            where: {
                society_id: societyID,
                deleted: false
            },
            transaction
        });

        if (!society) {
            await transaction.rollback();
            return { success: false, error: "Society not found" };
        }

        // Soft delete by setting deleted flag to true
        await Society.update({ deleted: true }, {
            where: { society_id: societyID },
            transaction
        });

        await transaction.commit();
        return { success: true, message: "Society deleted successfully" };
    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting society: ", error);
        return { success: false, error: error.message };
    }
}

export default {
    addSociety,
    getSocietyById,
    getAllSocieties,
    updateSociety,
    deleteSociety,
};