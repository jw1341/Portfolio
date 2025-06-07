import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';


const InitiativeResults = sequelize.define('initiativeResults', {
    ballot_id: { // Primary key & Foreign key
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Ballot',
            key: 'ballot_id'
        }
    },
    initiative_id: { // Primary key & Foreign key
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false,
        references: {
            model: 'Initiative',
            key: 'initiative_id'
        }
    },

    init_option_id: { // Primary key & Foreign key
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false,
        references: {
            model: 'Initiative',
            key: 'initiative_id'
        }
    },

    num_votes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
  tableName: 'initiative_results',
  timestamps: false,
});

export default InitiativeResults;