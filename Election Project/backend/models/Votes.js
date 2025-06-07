import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Votes = sequelize.define('Votes', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ballot_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  office_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  candidate_id: {
    type: DataTypes.INTEGER, 
    allowNull: false
  }
}, {
  tableName: 'votes',
  timestamps: false,
  id: false
});

export default Votes;
