import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Initiative = sequelize.define('Initiative', {
  initiative_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  ballot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ballot',
      key: 'ballot_id'
    }
  },
  initiative_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  initiative_description: {
    type: DataTypes.TEXT
  },
  initiative_voting_options: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: 'initiative',
  timestamps: false
});
export default Initiative;