// load-csvs.js
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Sequelize, QueryTypes } from 'sequelize';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import hashPassword from '../../utils/passwordHashing.js';


import Candidate from '../../models/Candidate.js';
import Office from '../../models/Office.js';
import UserLogin from '../../models/User.js';
import Ballot from '../../models/Ballot.js';
import Society from '../../models/Society.js';
import registerModels from '../../models/registerModels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mappings.js

const tableOverrides = {
  'members.csv': 'users', // override only weird table names
};

const associativeColumns = {
  'candidates.csv': {
    'officeID': {             // ✅ Match this to your actual CSV column header
      toTable: 'office_candidates', // ✅ Your junction table
      via: 'candidate_id',     // ✅ The FK from candidates
      targetColumn: 'office_id', // ✅ The column you're linking to
      splitOn: ';'             // ✅ If it's a semicolon-separated list
    }
  }
};


const columnOverrides = {
  'ballot.csv': {
    'ballot_title': 'title',
    'start_date': 'startDate',
    'end_date': 'endDate'
  },
  'societies.csv': {
    'society_abbr': null,
    'society_field': null
  },
  'members.csv': {
    'member_id': null,
    'first_name': null,
    'last_name': null,
    'password': 'password_hash'
  },
  'candidates.csv': {
    'candidate_first_name': 'first_name',
    'candidate_last_name': 'last_name',
    'candidate_bio': 'candidate_desc',
    'candidate_credentials': 'candidate_demographics',
    'allowed_votes': 'office_num_votes',
    'election_id': 'ballot_id'
  }
};

const modelMap = {
  'members.csv': UserLogin,
  'ballot.csv': Ballot,
  'societies.csv': Society
};

const csvInsertOrder = [
  'societies.csv',
  'members.csv',
  'candidates.csv',
  'ballot.csv' // inserted last since it depends on others
];

function normalizeKey(key) {
  return key.trim().toLowerCase().replace(/\s+/g, '_');
}

async function transformRow(row) {
  const result = { ...row };

  // Only transform if this file has a "password" column
  if ('password' in row) {
    result.password = await hashPassword(row.password);
  }

  return result;
}


function remapRow(row, overrideMap = {}) {
  const result = {};

  for (const key in row) {
    const override = overrideMap[key];

    if (override === null || override === false) {
      // Explicitly ignore this column
      continue;
    }

    const newKey = override || normalizeKey(key);
    result[newKey] = row[key];
  }

  return result;
}



dotenv.config();

const dbUrl = `${process.env.DB_URL}`;
const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
});

const csvDir = path.resolve(__dirname, '../'); // adjust if needed

export async function loadCSVFiles() {
  registerModels();
  const files = csvInsertOrder.filter(file => fs.existsSync(path.join(csvDir, file)));

  for (const filename of files) {
    if (!filename.endsWith('.csv')) continue;

    const csvPath = path.join(csvDir, filename);
    const tableName = tableOverrides[filename] || path.basename(filename, '.csv').toLowerCase();

    console.log(`Inserting ${filename} into table ${tableName} ...`);

    const rows = await parseCSV(csvPath, filename);
    if (rows.length === 0) continue;

    // Replaces all row objects with new row objects that have a hashed password
    if(filename === 'users.csv'){
      for(let i=0; i < rows.length; i++){
        const newRow = transformRow(rows[i]);
        rows[i] = newRow;
      }
    }

    // 👉 Special handler for candidates
    if (filename === 'candidates.csv') {
      await importCandidates(); // assumes this uses Sequelize models + associations
      continue;
    }

    // 👇 Handle other tables using Sequelize models
    const Model = modelMap[filename];
    if (!Model) {
      console.warn(`⚠️ No model found for ${filename}. Skipping...`);
      continue;
    }else{
      console.log(Model);
    }

    // Use bulkCreate with ignoreDuplicates
    await Model.bulkCreate(rows, {
      ignoreDuplicates: true,
      validate: true,
    });
  }

  async function importCandidates(filename = 'candidates.csv') {
    const CANDIDATE_COLUMNS = ['candidate_id', 'first_name', 'last_name','candidate_desc', 'candidate_demographics'];
    const OFFICE_COLUMNS = ['office_id', 'ballot_id','office_name', 'office_num_votes'];
    const overrideMap = columnOverrides[filename] || {};
    const filePath = path.join(csvDir, filename);
    const rows = await parseCSV(filePath);
  
    for (const rawRow of rows) {
      // Extract candidate & office data
      const row = Object.fromEntries(
        Object.entries(rawRow).map(([key, value]) => [
          overrideMap[key] || key,
          value,
        ])
      );
      const candidateData = pick(row, CANDIDATE_COLUMNS);
      const officeData = pick(row, OFFICE_COLUMNS);
  
      // Create or find candidate
      const [candidate] = await Candidate.findOrCreate({
        where: { candidate_id: candidateData.candidate_id },
        defaults: candidateData
      });

      console.log(candidate);
  
      // Create or find office
      const [office] = await Office.findOrCreate({
        where: { office_id: officeData.office_id }, // assuming 'title' is unique
        defaults: officeData
      });
  
      // Create association if it doesn't exist
      await candidate.addOffice(office);
    }
  }
  
  function pick(obj, keys) {
    return Object.fromEntries(
      Object.entries(obj).filter(([k]) => keys.includes(k))
    );
  }
  

  console.log('✅ CSV import complete!');
  await sequelize.close();
}

function parseCSV(filePath, filename) {
  const overrides = columnOverrides[filename] || {};

  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => results.push(remapRow(row, overrides)))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}


loadCSVFiles();