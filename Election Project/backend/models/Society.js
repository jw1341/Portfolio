import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Society = sequelize.define('Society', {
  society_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  society_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'societies',
  timestamps: false
});

export default Society;