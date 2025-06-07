import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const OfficeResults = sequelize.define('officeResults', {
    ballot_id: { // Primary key & Foreign key
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Ballot',
            key: 'ballot_id'
        }
    },
    office_id: { // Primary key & Foreign key
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false,
        references: {
            model: 'Office',
            key: 'office_id'
        }
    },
    candidate_id: { // Primary key & Foreign key
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false,
        references: {
            model: 'Candidate',
            key: 'candidate_id'
        }
    },
    num_votes: { 
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
  tableName: 'office_results',
  timestamps: false,
});

export default OfficeResults;