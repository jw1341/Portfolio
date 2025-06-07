import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Ballot = sequelize.define('Ballot', {
  ballot_id: { // Primary key
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  society_id: { // Primary key
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'societies',
      key: 'society_id'
    }
  },
  title: {
    type: DataTypes.TEXT,   // ALLOW NULL OR NOT    
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'ballot',
  timestamps: false,
});

export default Ballot;