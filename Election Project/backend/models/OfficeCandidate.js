import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const OfficeCandidate = sequelize.define('OfficeCandidate', {
    candidate_id: { // Primary key & Foreign key
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        references: {
            model: 'Candidate',
            key: 'candidate_id'
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
}, {
  tableName: 'office_candidate',
  timestamps: false,
});

export default OfficeCandidate;