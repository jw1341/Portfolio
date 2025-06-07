import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const HasVoted = sequelize.define('hasVoted', {
    ballot_id: { // Primary key & Foreign key
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Ballot',
            key: 'ballot_id'
        }
    },
    user_id: { // Primary key & Foreign key
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'UserLogin',
            key: 'user_id'
        }
    },
}, {
  tableName: 'has_voted',
  timestamps: false,
});

export default HasVoted;