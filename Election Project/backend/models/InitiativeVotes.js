import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const InitiativeVote = sequelize.define('InitiativeVote', {
  voter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  ballot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  initiative_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  init_option_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'initiative_votes',
  timestamps: false
});

export default InitiativeVote;
