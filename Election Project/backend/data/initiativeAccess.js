import Initiative from "../models/Initiative.js";
import Ballot from "../models/Ballot.js";
import InitiativeVote from "../models/InitiativeVotes.js";
import { sequelize } from "../config/db.js";


// INITIATIVE CRUD FUNCTIONS

// CREATE
/**
 * Takes in a validated collection of data
 * From a user creating an initiative for a ballot.
 * The data is parsed and put into the database
 * @param {*} initiativeObject 
 * @returns {Promise<Object>} Object with success status and initiative or error
 */
export async function addInitiative(initiativeObject, transaction){
    if (!transaction) {
        throw new Error("Transaction must be provided to addInitiative");
      }

    initiativeObject = mapInitiativeKeys(initiativeObject);
    
    try {

        let ballot_id = initiativeObject.ballot_id;

        const ballot = await Ballot.findOne({
            where: { ballot_id },
            transaction
          });
      
          if (!ballot) {
            return { success: false, error: `Ballot with ID ${ballot_id} does not exist` };
          }

        await sequelize.query(
            `SELECT setval('initiative_initiative_id_seq', COALESCE((SELECT MAX(initiative_id) FROM initiative), 1))`,
            { transaction }
        );


        const newInitiative = await Initiative.create(initiativeObject, { transaction });
        return { success: true, initiative: newInitiative };
    } catch (error) {
        await transaction.rollback();
        console.error("Error adding initiative: ", error);
        return { success: false, error: error.message };
    }
}

// READ
/**
 * Retrieves an initiative using the primary key and returns it
 * @param {*} initiativeID 
 * @param {*} ballotID 
 * @returns {Promise<Object>} initiative Object if successful, returns error object if not
 */
export async function getInitiative(initiativeID, ballotID){
    try {
        const initiative = await Initiative.findOne({
            where: {
                initiative_id: initiativeID,
                ballot_id: ballotID
            }
        });

        if (!initiative) {
            return { success: false, error: "Initiative not found" };
        }

        return initiative.dataValues;
        return { success: true, initiative: initiative };
    } catch (error) {
        console.error("Error retrieving initiative: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Retrieves all initiatives for a given ballot
 * @param {*} ballotID 
 * @returns {Promise<Object>} Object with initiatives array if successful, error object if not
 */
export async function getInitiativesByBallot(ballotID){
    try {
        const initiatives = await Initiative.findAll({
            where: {
                ballot_id: ballotID
            }
        });

        return initiatives;
        return { success: true, initiatives: initiatives };
    } catch (error) {
        console.error("Error retrieving initiatives: ", error);
        return { success: false, error: error.message };
    }
}

// UPDATE
/**
 * Updates the initiative in the database using the primary key and initiative information
 * @param {*} initiativeID 
 * @param {*} ballotID 
 * @param {*} initiativeInfo 
 * @returns {Promise<Object>} Object with success status and updated data or error
 */
export async function updateInitiative(initiativeID, ballotID, initiativeInfo){
    const transaction = await sequelize.transaction();
    
    try {
        const initiative = await Initiative.findOne({
            where: {
                initiative_id: initiativeID,
                ballot_id: ballotID
            },
            transaction
        });

        if (!initiative) {
            await transaction.rollback();
            return { success: false, error: "Initiative not found" };
        }

        // Update the initiative with new information
        await Initiative.update(initiativeInfo, {
            where: {
                initiative_id: initiativeID,
                ballot_id: ballotID
            },
            transaction
        });

        // Fetch updated initiative
        const updatedInitiative = await Initiative.findOne({
            where: {
                initiative_id: initiativeID,
                ballot_id: ballotID
            },
            transaction
        });

        await transaction.commit();
        return { success: true, initiative: updatedInitiative };
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating initiative: ", error);
        return { success: false, error: error.message };
    }
}

// DELETE
/**
 * Removes an initiative from the database
 * @param {*} initiativeID 
 * @param {*} ballotID 
 * @returns {Promise<Object>} Object with success status or error
 */
export async function deleteInitiative(initiativeID, ballotID){
    const transaction = await sequelize.transaction();
    
    try {
        const result = await Initiative.destroy({
            where: {
                initiative_id: initiativeID,
                ballot_id: ballotID
            },
            transaction
        });

        if (result === 0) {
            await transaction.rollback();
            return { success: false, error: "Initiative not found" };
        }

        await transaction.commit();
        return { success: true, message: "Initiative deleted successfully" };
    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting initiative: ", error);
        return { success: false, error: error.message };
    }
}

//Initiative Vote

export async function castInitiativeVote(voteObject) {
    const transaction = await sequelize.transaction();
  
    try {
      const existingVote = await InitiativeVote.findOne({
        where: {
          voter_id: voteObject.voter_id,
          ballot_id: voteObject.ballot_id,
          initiative_id: voteObject.initiative_id
        },
        transaction
      });
  
      if (existingVote) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Vote already exists for this voter on this initiative'
        };
      }
  
      const newVote = await InitiativeVote.create(voteObject, { transaction });
  
      await transaction.commit();
      return { success: true, vote: newVote };
    } catch (error) {
      await transaction.rollback();
      console.error('Error casting initiative vote:', error);
      return { success: false, error: error.message };
    }
  }

  export async function getInitiativeVotingOptions(initiative_id){
      try {
        const initiative = await Initiative.findOne({
            where: { initiative_id: initiative_id },
            attributes: ['initiative_voting_options']
          });

        if (!initiative) {
            return { success: false, error: "Initiative not found" };
        }

        return initiative.dataValues;
    } catch (error) {
        console.error("Error retrieving initiative: ", error);
        return { success: false, error: error.message };
    }
      
  }


  
function mapInitiativeKeys(initiative) {
    const { name, options, description, ...rest } = initiative;
    return {
      initiative_name: name,
      initiative_voting_options: options,
      initiative_description: description,
      ...rest
    };
  }
  

export default {
    addInitiative,
    getInitiative,
    getInitiativesByBallot,
    updateInitiative,
    deleteInitiative,
    castInitiativeVote
};