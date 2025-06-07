import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/auth_api.js"
import ballotRoutes from "./routes/ballot_api.js"
import societyRoutes from "./routes/society_api.js"
// import voteRoutes from "./routes/vote_api.js"
// import candidateRoutes from "./routes/candidate_api.js"
// import officeRoutes from "./routes/office_api.js"
import userRoutes from "./routes/user_api.js"
import analyticsRoutes from "./routes/analytics_api.js";



import path from 'path';
import { fileURLToPath } from 'url';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());
app.use(cors());

const __dirname = fileURLToPath(import.meta.url);

const frontendPath = path.join(__dirname, '../../frontend/dist')
// Serve static React Files
// app.use(express.static(frontendPath))

// // Serve React app for any non-API routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(frontendPath, 'index.html'))
// });

// Set up helmet to protect routes
app.use(helmet());

// Set up rate limiter to prevent brute force login attempts
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Use the routes

app.use("/api/", authRoutes);
app.use("/api/ballot/", ballotRoutes);
app.use("/api/society/", societyRoutes);
// app.use("/api/vote/", voteRoutes);
// app.use("/api/candidate/", candidateRoutes);
// app.use("/api/office/", officeRoutes);
app.use("/api/society/", societyRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/analytics/", analyticsRoutes);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use((req, res, next) => {
    console.log(`[DEBUG] Incoming ${req.method} ${req.url}`);
    next();
  });
// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });

export default app;