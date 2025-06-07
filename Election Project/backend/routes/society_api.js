import express from "express";
import societyService from "../services/societyService.js";
import { authenticateToken, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get/:society_id", 
  authenticateToken, 
  requirePermission('view_societies'),
  async (req, res) => {
  try {
    // Check for empty request
    if (!req.params || Object.keys(req.params).length === 0) {
      return res.status(400).json({ error: "Request parameters are empty" });
    }

    // Check for empty fields
    let society_id = req.params.society_id;
    if (!society_id) {
      return res.status(400).json({ error: "Society ID is required" });
    }

    // Proceed with fetching society
    const society = await societyService.getSocietyById(society_id);
    res.status(200).json(society);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error coming from the catch block: " + error.message });
  }
});

router.get("/getAll", 
  authenticateToken, 
  requirePermission('view_societies'),
  async (req, res) => {
  try {
    console.log("Calling get all societies from api...");
    const response = await societyService.getAllSocietiesService();
    console.log("All Societies:");
    const rawSocieties = response.societies.map(society => society.dataValues);

    // console.log(societies);
    res.status(200).json(rawSocieties);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error coming from the catch block: " + error.message });
  }
});

router.post("/add", 
  authenticateToken, 
  requirePermission('manage_societies'), 
  async (req, res) => {
  try {

    console.log(req.body)
    // Check for empty request
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    // Check for empty fields
    let societyData = req.body;
    if (!societyData.society_name || !societyData.description) {
      console.log(req.body);
      return res.status(400).json({ error: "Name and description are required" });
    }

    // Proceed with adding society
    const society = await societyService.addSociety(societyData);
    res.status(200).json(society);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error coming from the catch block: " + error.message });
  }
});

router.put("/update", 
  authenticateToken, 
  requirePermission('manage_societies'), 
  async (req, res) => {
  try {
    // Check for empty request
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    // Check for empty fields
    let societyData = req.body;
    if (!societyData.society_id || !societyData.society_name || !societyData.description) {
      return res.status(400).json({ error: "Society ID, name and description are required" });
    }

    // Proceed with updating society
    const society = await societyService.updateSociety(societyData);
    res.status(200).json(society);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error coming from the catch block: " + error.message });
  }
});

router.delete("/delete/:society_id", 
  authenticateToken,
  requirePermission('manage_societies'), 
  async (req, res) => {
  try {
    // Check for empty request
    if (!req.params || Object.keys(req.params).length === 0) {
      return res.status(400).json({ error: "Request parameters are empty" });
    }

    // Check for empty fields
    let society_id = req.params.society_id;
    if (!society_id) {
      return res.status(400).json({ error: "Society ID is required" });
    }

    // Proceed with deleting society
    const society = await societyService.deleteSociety(society_id);
    res.status(200).json(society);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error coming from the catch block: " + error.message });
  }
});

export default router;