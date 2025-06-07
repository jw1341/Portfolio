import app from "./app.js";
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';

dotenv.config()

// Connect to PostgreSQL
connectDB();

// Start Express Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0" ,() => console.log(`server running on port ${PORT}`));