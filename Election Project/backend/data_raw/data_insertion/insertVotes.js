import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

import Votes from '../../models/Votes.js';
import UserLogin from '../../models/User.js';
import Office from '../../models/Office.js';
import Candidate from '../../models/Candidate.js';
import Ballot from '../../models/Ballot.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REQUIRED_COLUMNS = ['member_id','election_id','office_id','candidate_id'];

async function getValidIds() {
    const users = await UserLogin.findAll({ attributes: ['user_id'], raw: true });
    const offices = await Office.findAll({ attributes: ['office_id'], raw: true });
    const candidates = await Candidate.findAll({ attributes: ['candidate_id'], raw: true });
    const ballots = await Ballot.findAll({ attributes: ['ballot_id'], raw: true });
  
    return {
      userIds: new Set(users.map(u => u.user_id)),
      officeIds: new Set(offices.map(o => o.office_id)),
      candidateIds: new Set(candidates.map(c => c.candidate_id)),
      ballotIds: new Set(ballots.map(b => b.ballot_id)),
    };
}


// Function to insert votes from CSV
async function insertVotes() {
  const csvFilePath = path.join(__dirname, '../votes.csv'); // Update the path if needed
  const records = [];


  const valid = await getValidIds();
  console.log('Loaded valid ID sets');
  // Create a parser for the CSV file
  const parser = fs.createReadStream(csvFilePath).pipe(csv({ columns: true, trim: true }));
  

  // Iterate through each record in the CSV
  for await (const record of parser) {

    const hasMissingField = REQUIRED_COLUMNS.some(column => {
        const value = record[column];
        return value === null || value === undefined || value === '';
    });
    // Skip rows missing candidate_id
    if (hasMissingField) {
      console.warn('Skipping row (missing candidate_id):', record);
      continue;
    }

    if (
        !valid.userIds.has(Number(record.member_id)) ||
        !valid.officeIds.has(Number(record.office_id)) ||
        !valid.candidateIds.has(Number(record.candidate_id)) ||
        !valid.ballotIds.has(Number(record.election_id))
      ) {
        console.warn('Skipping row (invalid foreign key):', record);
        continue;
      }

    // Prepare the vote record
    records.push({
      member_id: record.member_id,
      election_id: record.election_id,
      office_id: record.office_id,
      candidate_id: record.candidate_id,
    });
  }

  // Insert valid records into the database
  if (records.length > 0) {
    try {
      await Votes.bulkCreate(records, {
        ignoreDuplicates: true, // Adjust based on your database constraints
      });
      console.log(`Successfully inserted ${records.length} vote(s).`);
    } catch (error) {
      console.error('Error inserting votes:', error);
    }
  } else {
    console.log('No valid votes to insert.');
  }
}

// Execute the insertion function
insertVotes();
