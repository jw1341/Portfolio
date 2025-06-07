import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Office from './Office.js';
import OfficeCandidate from './OfficeCandidate.js';



const Candidate = sequelize.define('Candidate', {
    candidate_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    candidate_desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    candidate_demographics: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    office_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // or false, depending on your needs
      references: {
        model: 'offices', // Table name, not model name
        key: 'office_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Or 'CASCADE' if you want to delete candidates with offices
    },
    candidate_image: {
      type: DataTypes.BLOB('long'), 
      allowNull: true
    }
  }, {
    tableName: 'candidates',
    timestamps: false
  });

  Candidate.associate = (models) => {
    Candidate.belongsTo(models.Office, {
      foreignKey: 'office_id',
    });
  };

export default Candidate;