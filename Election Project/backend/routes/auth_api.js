import express from 'express'; 
import userService from '../services/userService.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is empty" });
        }

        console.log("Received request in register: ");
        console.log(req.body);

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await userService.registerUser(req.body);
        console.log("Result of add user:");
        console.log(user);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: "From Catch block: " + error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        // check for empty request
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is empty" });
        }

        // check for empty fields
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }
        
        console.log("Req body in auth_api");
        console.log(req.body);
        // proceed with authentication
        const token = await userService.loginUser(req.body);
        res.status(200).json(token);
    } catch (error) {
        res.status(401).json({ message: "Caught in login catch block:" + error.message });
    }
});

export default router;