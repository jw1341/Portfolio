import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const UserLogin = sequelize.define('UserLogin', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('member', 'officer', 'employee', 'admin')}, // Set by the admin
  society_id: { type: DataTypes.INTEGER }, // Set by Officer
  status: { type: DataTypes.ENUM('active', 'deleted'),
    defaultValue: 'active'
  }, // Active by default
}, {
  tableName: 'users',
  timestamps: false,
});

export default UserLogin;