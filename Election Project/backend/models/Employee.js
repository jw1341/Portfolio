import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Employee = sequelize.define('Employee', {
    user_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        allowNull: false, 
        references: {
            model: 'User',
            key: 'user_id'
        }
    },
    society_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Society',
            key: 'society_id'
        }
    },
}, {
  tableName: 'employees',
  timestamps: false
});

export default Employee;