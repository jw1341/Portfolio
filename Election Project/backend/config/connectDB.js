import { sequelize } from './db.js';
import registerModels from '../models/registerModels.js';

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established.');

    registerModels(); // register all models and their relationships

    // await sequelize.sync({
    //   // DESTROYS ALL THE DATA
    //   //  force: true 
    //   }); // or { alter: true } in production
    console.log('✅ Database models synchronized.');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
