import express from "express";
import voteService from "../services/voteService";
import analyticsService from "../services/analyticsService";
import { authenticateToken, requirePermission } from "../middleware/authMiddleware.js";

// Create a new router
const router = express.Router();

router.get("/count/:ballot_id",
  // authenticateToken,
  requirePermission("view_results"),
  async (req, res) => {
    try {
      // Check for empty request
      if (!req.params || Object.keys(req.params).length === 0) {
        return res.status(400).json({ error: "Request parameters are empty" });
      }

      // Check for empty fields
      let { user_id, ballot_id } = req.params;
      if (!(user_id || ballot_id)) {
        return res.status(400).json({ error: "User ID and Ballot ID are required" });
      }

      // Proceed with counting votes
      const voteCount = await analyticsService.getBallotResults(ballot_id);

      res.status(200).json(voteCount);
    } catch (error) {
      res.status(400).json({ message: "Error coming from the count votes catch block: " + error.message });
    }
  }
);

