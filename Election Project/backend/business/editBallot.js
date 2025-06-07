    function isValidDateFormat(dateStr) {
        return /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr);
    }

  function validateElectionInfo(election) {
    let valid = true;

    if (!election.ballot_id) {
      console.log("Election ballot_id does not exist");
      valid = false;
    } else if (isNaN(election.ballot_id)) {
      console.log("Election ballot_id is not a number");
      valid = false;
    }

    if (!election.society_id) {
      console.log("Election society_id does not exist");
      valid = false;
    } else if (isNaN(election.society_id)) {
      console.log("Election society_id is not a number");
      valid = false;
    }
  
    // If the election title key does not exist or the value assigned to the key is empty:
    // Then add an error to the errors array
    if (!election.title || election.title.trim() === "") {
      console.log("Election title does not exist");
      valid = false;
    }
  
    // If the startDate key does not exist or the value assigned to the key is empty:
    // Then add an error to the errors array
    if (!election.startDate || election.startDate.trim() === "") {
      console.log("Election start date does not exist");
      valid = false;
    //   If the value is not in the correct date format then add an error to the array
    } else if (!isValidDateFormat(election.startDate)) {
      console.log("Election start date is not a valid date");
      valid = false;
    }
  
    if (!election.endDate || election.endDate.trim() === "") {
      console.log("Election end date does not exist");
      valid = false;
    } else if (!isValidDateFormat(election.endDate)) {
      console.log("Election end date is not a valid date");
      valid = false;
    }
  
    console.log("validateElectionInfo status: ", valid);
    return valid;
  }

  function validateOffices(offices) {
    let valid = true;
  
    // If office parameter is not an array or is empty, return an error
    if (!Array.isArray(offices) || offices.length === 0){
        valid = false;
        console.log("Offices is not an array or is empty");
    } 
  
    // For each office in the offices array, check if all fields are valid
    // Uses an index to properly identify which office is causing an error
    console.log(offices);
    offices.forEach((office, index) => {
      let officeLabel = `Office ${index + 1}`;
  
    //If the name key doesn't exist or is empty, add an error to the array 
      if (!office.name || office.name.trim() === "") {
        console.log(`${officeLabel} must have a name.`);
        valid = false;
      }
  
      let votes = office.numVotes;
      votes = parseInt(votes);
    //   Possible error: numVotes might need to be parsed?
      if (votes === undefined || isNaN(votes)) {
        console.log(`${officeLabel} must have a numeric 'votes per voter'.`);
        valid = false;
      } else if (votes < 1) {
        console.log(`${officeLabel} must have at least 1 vote per voter.`);
        valid = false;
      }
  
      let candidates = Object.values(office.candidates)
      if (!Array.isArray(candidates) || candidates.length < 1) {
        console.log(`${officeLabel} must have at least one candidate.`);
        valid = false;
      } else {
        if (candidates.length < votes) {
          console.log(`${officeLabel} must have candidates >= votes per voter.`);
          valid = false;
        }
  
       if(!validateCandidates(candidates, index)){
        console.log(`Candidates in ${officeLabel} are invalid`);
        valid = false;
       }
      }
    });
    console.log("validateOffices status: ", valid);
    return valid;
  }

  function validateCandidates(candidates, officeIndex) {
    let valid = true;
  
    candidates.forEach((candidate, cIndex) => {
      let label = `Candidate ${cIndex + 1} in Office ${officeIndex + 1}`;
  
      if (!candidate.first_name || candidate.first_name.trim() === "") {
        console.log(`${label} must have a first_name.`);
        valid = false;
      } else if (candidate.first_name.length > 100) {
        console.log(`${label} first_name cannot be longer than 100 characters.`);
        valid = false;
      }
      if (!candidate.last_name || candidate.last_name.trim() === "") {
        console.log(`${label} must have a last_name.`);
        valid = false;
      } else if (candidate.last_name.length > 100) {
        console.log(`${label} last_name cannot be longer than 100 characters.`);
        valid = false;
      }
  
      if (!candidate.candidate_desc || candidate.candidate_desc.trim() === "") {
        console.log(`${label} must have a description.`);
        valid = false;
      }
    });
    console.log("validateCandidates status: ", valid);
    return valid;
  }

  function validateInitiatives(initiatives) {
    let valid = true;
  
    if (!Array.isArray(initiatives) || initiatives.length === 0) return false;
  
    initiatives.forEach((initiative, index) => {
      let label = `Initiative ${index + 1}`;
  
      if (!initiative.name || initiative.name.trim() === "") {
       console.log(`${label} must have a name.`);
       valid = false;
      }
  
      if (!initiative.description || initiative.description.trim() === "") {
       console.log(`${label} must have a description.`);
       valid = false;
      }
  
      let options = Object.values(initiative.options);
      if (!Array.isArray(options) || options.length < 1) {
       console.log(`${label} must have at least one option.`);
       valid = false;
      } else {
        options.forEach((option, oIndex) => {
          if (option.length > 100) {
           console.log(`Option ${oIndex + 1} in ${label} cannot be longer than 100 characters.`);
           valid = false;
          }
        });
      }
    });
    console.log("validateInitiatives status: ", valid);
    return valid;
  }

  export default function validateElection(election) {
    let valid = true;
  
    valid = validateElectionInfo(election);

    let offices = Object.values(election.offices);
    let initiatives = Object.values(election.initiatives);

    console.log("Got past the Object.values call");
  
    let hasOffices = Array.isArray(offices) && offices.length > 0;
    let hasInitiatives = Array.isArray(initiatives) && initiatives.length > 0;
  
    if (!hasOffices && !hasInitiatives) {
      console.log("There must be at least one office or one initiative.");
      valid = false;
    }
  
    if (hasOffices) {
      valid = validateOffices(offices);
    }
  
    if (hasInitiatives) {
      valid = validateInitiatives(initiatives);
    }
    return valid;
  }
  
  