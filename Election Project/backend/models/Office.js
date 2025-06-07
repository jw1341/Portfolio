import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Candidate from './Candidate.js';
import OfficeCandidate from './OfficeCandidate.js';


const Office = sequelize.define('Office', {
    office_id: { // Primary key
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ballot_id: { // Primary key
        type: DataTypes.INTEGER, 
        allowNull: false,
    },

    office_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    office_num_votes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {
  tableName: 'office',
  timestamps: false,
});

Office.associate = () => {
    Office.belongsToMany(Candidate, {
      through: OfficeCandidate,
      foreignKey: 'office_id',
    });
  };

export default Office;