import validateElection from "../business/editBallot.js";
import { addBallot, getBallot, getBallotsBySociety, updateBallot, deleteBallot } from "../data/ballotAccess.js";
import { getOfficesByBallot } from "../data/officeAccess.js";
import { getInitiativesByBallot } from "../data/initiativeAccess.js";
import { getCandidatesByOffice } from "../data/candidateAccess.js";

/**
 * Adds a new ballot.
 * @param {Object} data - Ballot details.
 * @returns {Promise<Object>} - Created ballot object.
 * @throws {Error} - If the ballot data is invalid.
 * @throws {Error} - If the ballot creation fails.
 */
async function createBallot(data) {
  // Logic to create a ballot
  console.log("Data received in create ballot: ", data);
  let electionValid = validateElection(data);
  if(electionValid){
    console.log(electionValid)
    let rs = await addBallot(data);
    if(!rs.success) {console.log("Error adding ballot to the database: ", rs.error);
      console.log("This is the status of rs.success: " + rs.success);
    }
    console.log(rs);
    return rs;
  }else{
    console.log(electionValid);
    console.error("Ballot validation failed");
  }
  return result.ballot;
}

/**
 * Gets all ballots by society
 * @param {string} societyID 
 * @returns {Promise<Array>}
 */
async function getAllBallots(societyID) {
  console.log("Captured society id in ballotService: " + societyID);
  const result = await getBallotsBySociety(societyID);

  let structuredBallots = [];

  await Promise.all(
  result.ballots.map(async ballot => {
    let newBallot = await structureBallotFields(ballot);
    structuredBallots.push(newBallot);
  }));

  if (!result.success) {
    throw new Error(result.error || 'Error fetching ballots');
  }
  return structuredBallots;
}

/**
 * Updates a ballot
 * @param {string} id 
 * @param {string} societyID 
 * @param {Object} updateData 
 * @returns {Promise<Object>}
 */
async function updateBallotService(id, societyID, updateData) {
  const result = await updateBallot(id, societyID, updateData);
  if (!result.success) {
    throw new Error(result.error || 'Failed to update ballot');
  }
  return result.ballot;
}

/**
 * Fetches a ballot by ID.
 * @param {string} id - The ID of the ballot.
 * @returns {Promise<Object>} - Ballot object.
 * @throws {Error} - If the ballot ID is invalid.
 * @throws {Error} - If the ballot is not found.
 */
async function getBallotByID(ballot_id, society_id) {
    // Logic to fetch a ballot by ID
    
    // Possible call to business layer here:

    // get ballot from data access layer
    let ballot = await getBallot(ballot_id,society_id);

    let tempObj = {
      "ballot": ballot.ballot,
    }

    console.log("\ntemp Obj info\n");
    console.log(tempObj);

    let newBallot = await structureBallotFields(tempObj.ballot);
    console.log("New Ballot After Restructuring: ");
    console.log(newBallot);
    return newBallot;

}

async function structureBallotFields(ballot){
  /*
      {
        "ballot_id": 10002,
        "society_id": 69,
        "title": "Taco Tuesday",
        "startDate": "02/26/2003",
        "endDate": "02/29/2003",
        "offices":{
            "office1":{
                "name": "Prezzy",
                "numVotes": 1,
                "candidates": {
                    "candidate1":{
                        "name": "Brian",
                        "university": "Clown School",
                        "description": "He's cool",
                    }
                }
            },
            "office2":{
                "name": "Head Clown",
                "numVotes": 1,
                "candidates": {
                    "candidate1":{
                        "name": "Macy",
                        "university": "Clown School",
                        "description": "He's cool",
                    }
                }
            }
        },
        "initiatives": {
            "initiative1": {
                "name": "Free Ice Cream from Dean",
                "description": "I think we deserve it",
                "options": {
                    "option1": "Yes",
                    "option2": "No"
                }
            }
        }
    }
  */

  let offices = await getOfficesByBallot(ballot.ballot_id);
  let initiatives = await getInitiativesByBallot(ballot.ballot_id);

  let ballotObj = {
    "ballot_id": ballot.ballot_id,
    "society_id": ballot.society_id,
    "title": ballot.title,
    "startDate": ballot.startDate,
    "endDate": ballot.endDate,
    "offices": {},
    "initiatives": {}
  }

  // console.log("Offices object in structureBallotFields: ");
  // console.log(offices);

  await Promise.all(
  offices.offices.map(async (o, i) => {
    // console.log("Add candidates then push office");
    let office_id = o.dataValues.office_id;

    let candidates = await getCandidatesByOffice(office_id);
    // console.log("\nCandidates:\n");
    // console.log(candidates);
    // console.log("\nCandidates.Candidates:\n");
    // console.log(candidates.candidates);

    let ballot_office = {}
    // console.log(ballot_office);

    ballot_office.name = o.dataValues.office_name;
    ballot_office.numVotes = o.dataValues.office_num_votes;
    ballot_office.office_id = office_id;
    ballot_office.candidates = {};

    await Promise.all(
    candidates.candidates.map((c, j) => {
      ballot_office.candidates["candidate" + (j+1)] = c;
    })
  );

    ballotObj.offices["office" + (i+1)] = ballot_office;
    // console.log("ballot_office:");
    // console.log(ballot_office);
  })
);

if(initiatives.length > 0){
  console.log("Start of initiative loop");
  await Promise.all(
    initiatives.map((i, k) => {

      let ballot_initiative = {}
    // console.log(ballot_initiative);
    /*
        function mapInitiativeKeys(initiative) {
    const { name, options, description, ...rest } = initiative;
    return {
      initiative_name: name,
      initiative_voting_options: options,
      initiative_description: description,
      ...rest
    };
  }
    */
      console.log(i.dataValues.initiative_id);

      ballot_initiative.initiative_id = i.dataValues.initiative_id;
      ballot_initiative.name = i.dataValues.initiative_name;
      ballot_initiative.description = i.dataValues.initiative_description;
      ballot_initiative.options = i.dataValues.initiative_voting_options;
      ballotObj.initiatives["initiative" + (k+1)] = ballot_initiative;
    })
  );
}

console.log("Final ballot object:");
console.log(ballotObj);


return ballotObj;

}

export async function deleteBallotService(ballot_id){
  const result = await deleteBallot(ballot_id);
  return result;
}

export default {
    createBallot,
    updateBallotService,
    getBallotByID,
    getAllBallots,
    deleteBallotService
};
