import express from 'express';
import analyticsService from '../services/analyticsService.js';

const router = express.Router();

//returns votes for all candiates within an office
router.get('/office/:office_id', async (req, res) => {
    try {
        const officeId = req.params.office_id;
        const analytics = await analyticsService.officeVotes(officeId);
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/society/:society_id', async (req, res) => {
    try {
        const societyId = req.params.society_id;
        const analytics = await analyticsService.totalVotesBySociety(societyId);
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

// returns number of active ballots
router.get('/active/:society_id', async (req, res) => {
    try {
        const societyId = req.params.society_id;
        const analytics = await analyticsService.getActiveBallotAnalytics(societyId);
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

// returns number of inactive ballots
router.get('/inactive/:society_id', async (req, res) => {
    try {
        const societyId = req.params.society_id;
        const analytics = await analyticsService.getInactiveBallotAnalytics(societyId);
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);
// returns voter turnout
router.get('/voter_turnout', async (req, res) => {
    console.log("Received request in voter turnout endpoint");
    try {
        // const [ballot_id, society_id] = req.params.ids.split(',');
        const { ballot_id, society_id } = req.query;
        console.log("Ballot_id: ", ballot_id);
        const analytics = await analyticsService.getVoterTurnout(ballot_id, society_id);
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

router.get('/ballot_results/:ballot_id', async (req, res) => {
    console.log("Received request in ballot_results endpoint");
    try {
        // const [ballot_id, society_id] = req.params.ids.split(',');
        const ballot_id = req.params.ballot_id
        console.log("Ballot_id: ", ballot_id);
        const ballotResults = await analyticsService.getBallotResults(ballot_id);
        console.dir(ballotResults, {depth: null});
        res.status(200).json(ballotResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

router.get('/initiative_results/:ballot_id', async (req, res) => {
    console.log("Received request in ballot_results endpoint");
    try {
        const ballot_id = req.params.ballot_id
        const initiativeResults = await analyticsService.getInitiativeResultsService(ballot_id);
        console.dir(initiativeResults, {depth: null});
        res.status(200).json(initiativeResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

// router.get('/')

export default router;