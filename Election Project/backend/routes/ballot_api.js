import express from 'express';
import ballotService from '../services/ballotService.js';
import voteService from '../services/voteService.js';
import {authenticateToken, requirePermission} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', 
    authenticateToken, 
    requirePermission('manage_ballots'),
    async (req, res) => {
        console.log("Request Body: ");
        console.dir(req.body, { depth: null });
    try {
        // Check for empty request
        console.log("Object.keys length: ", Object.keys(req.body).length);
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is empty" });
        }
        console.log("Captured req.body in the try block: ", req.body);

        // Proceed with ballot creation
        let ballot = await ballotService.createBallot(req.body);
        console.log(ballot);
        res.status(201).json(ballot);
    } catch (error) {
        res.status(400).json({ message: "Error coming from the create ballot catch block: " + error.message });
    }
}
);

router.get('/get/:ids', 
    authenticateToken, 
    async (req, res) => {
    try {
        // Check for empty request
        if (!req.params || Object.keys(req.params).length === 0) {
            return res.status(400).json({ error: "Request parameters are empty" });
        }

        // Check for empty fields
        let [ballot_id, society_id] = req.params.ids.split(',');
        console.log(ballot_id);
        console.log(society_id);
        console.log(req.params.ids);
        if (!(ballot_id || society_id)) {
            return res.status(400).json({ error: "Ballot ID is required" });
        }

        // Proceed with fetching ballot
        const ballot = await ballotService.getBallotService(ballot_id, society_id);
        console.log("Printing from ballot_api:");
        console.log(ballot);
        res.status(200).json(ballot);
    } catch (error) {
        res.status(400).json({ message: "Error coming from the get ballot catch block: " + error.message });
    }
}
);

router.get('/getAll/:id', 
    authenticateToken, 
    async (req, res) => {
    try {
        if (!req.params || Object.keys(req.params).length === 0) {
            return res.status(400).json({ error: "Request parameters are empty" });
        }

        console.log("Request body in try block: ");
        console.log(req.params);
        const society_id = req.params.id;
        console.log("Captured society id in try block: " + society_id);
        const ballots = await ballotService.getAllBallots(society_id);
        res.status(200).json(ballots);
    } catch (error) {
        res.status(400).json({ message: "Error coming from the get all ballots catch block:" + error.message });
    }
});

router.put('/update/:ids', 
    authenticateToken, 
    requirePermission('manage_ballots'),
    async (req, res) => {
    try {
        // Check for empty request
        if (!req.params || Object.keys(req.params).length === 0) {
            return res.status(400).json({ error: "Request parameters are empty" });
        }

        // Check for empty fields
        let [ballot_id, society_id] = req.params.ids.split(',');
        if (!(ballot_id || society_id)) {
            return res.status(400).json({ error: "Ballot ID is required" });
        }

        // Proceed with updating ballot
        const updatedBallot = await ballotService.updateBallotService(ballot_id, society_id, req.body);
        res.status(200).json(updatedBallot);
    } catch (error) {
        res.status(400).json({ message: "Error coming from the update ballot catch block:" + error.message });
    }
}
);
router.delete('/delete/:id', 
    authenticateToken, requirePermission('manage_ballots'),
    async (req, res) => {
    try {
        // Check for empty request
        if (!req.params || Object.keys(req.params).length === 0) {
            return res.status(400).json({ error: "Request parameters are empty" });
        }

        // Check for empty fields
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Ballot ID is required" });
        }

        // Proceed with deleting ballot
        const result = await ballotService.deleteBallotService(id);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ message: "Error coming from the delete ballot catch block:" + error.message });
    }
}
);


router.post('/castVote', 
    authenticateToken, requirePermission('vote'),
    async (req, res) => {
    try {
        // Check for empty request
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is empty" });
        }

        // Proceed with casting vote
        const result = await voteService.castVote(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: "Error coming from the cast vote catch block:" + error.message });
    }
}
);

router.post('/castInitVote', 
    authenticateToken, requirePermission('vote'),
    async (req, res) => {
    try {
        // Check for empty request
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is empty" });
        }

        // Proceed with casting vote
        const result = await voteService.castInitVoteService(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: "Error coming from the cast vote catch block:" + error.message });
    }
}
);

export default router;