import express from "express"
import userService from "../services/userService.js";
import { getUsersVotedService } from "../services/analyticsService.js";
import { authenticateToken, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();
// Route to get user by ID
router.get("/get/:user_id", async (req, res) => {
  try {
    // Check for empty request
    if (!req.params || Object.keys(req.params).length === 0) {
      return res.status(400).json({ error: "Request parameters are empty" });
    }

    // Check for empty fields
    let user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Proceed with fetching user
    const user = await userService.getUserByID(user_id);
    res.status(200).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error coming from the catch block: " + error.message });
  }
});

// Route to get user by username

router.get("/get/username/:username", async (req, res) => {
    try {
        // Check for empty request
        if (!req.params || Object.keys(req.params).length === 0) {
        return res.status(400).json({ error: "Request parameters are empty" });
        }
    
        // Check for empty fields
        let username = req.params.username;
        if (!username) {
        return res.status(400).json({ error: "Username is required" });
        }
    
        // Proceed with fetching user
        const userExists = await userService.getUsernameExists(username);
        res.status(200).json(userExists);
    } catch (error) {
        res
        .status(400)
        .json({ message: "Error coming from the catch block: " + error.message });
    }
    });

// Route to get all users

router.get("/get/all",
  authenticateToken, requirePermission('manage_users'),
  async (req, res) => {
    try {
        // Check for empty request
        if (!req.params || Object.keys(req.params).length === 0) {
        return res.status(400).json({ error: "Request parameters are empty" });
        }
    
        // Proceed with fetching all users
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res
        .status(400)
        .json({ message: "Error coming from the catch block: " + error.message });
    }
    }
);

// Route to set a user's society_id and role

router.post("/set/society", 
  authenticateToken, requirePermission('manage_users'),
  async (req, res) => {
  try {
    // Check for empty request
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    // Check for empty fields
    let { user_id, society_id, role } = req.body;
    if (!user_id || !society_id || !role) {
      return res.status(400).json({ error: "User ID, Society ID, and Role are required" });
    }

    // Proceed with setting user's society_id and role
    const result = await userService.setUserSocietyAndRole(user_id, society_id, role);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error " + error.message });
  }
});

router.post("/set/admin",
  authenticateToken, requirePermission('manage_users'),
  async (req, res) => {
  try {
    // Check for empty request
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    // Check for empty fields
    let { user_id, role } = req.body;
    if (!user_id || !role) {
      return res.status(400).json({ error: "User ID, Society ID, and Role are required" });
    }

    // Proceed with setting user's society_id and role
    const result = await userService.setAdmin(user_id, role);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error " + error.message });
  }
});

router.post("/update", 
  authenticateToken, requirePermission('manage_users'),
  async (req, res) => {
  try {
    // Check for empty request
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    // Proceed with setting user's society_id and role
    let result = await userService.updateUserService(req.body);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error coming from api catch block: " + error.message });
  }
});

router.post("/delete/", 
  authenticateToken, requirePermission('manage_users'),
  async (req, res) => {
  try {
    // Check for empty request
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    let user_id = req.body.user_id;
    // Proceed with setting user's society_id and role
    let result = await userService.deleteUserService(user_id);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error coming from api catch block: " + error.message });
  }
});

router.post('/employee', 
  authenticateToken, requirePermission('manage_users'),
  async (req, res) => {
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

        const user = await userService.registerEmployee(req.body);
        console.log("Result of add employee:");
        console.log(user);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: "From Catch block: " + error.message });
    }
});

router.post('/employee/delete',
  authenticateToken, requirePermission('manage_users'),
  async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is empty" });
        }

        console.log("Received request in delete employee: ");
        console.log(req.body.user_id);

        const deleteSuccess = await userService.deleteEmployeeService(req.body.user_id);
        console.log("Result of add employee:");
        console.log(deleteSuccess);
        res.status(201).json(deleteSuccess);
    } catch (error) {
        res.status(400).json({ message: "From delete employee Catch block: " + error.message });
    }
});

router.post('/employee/societies/delete',
  authenticateToken, requirePermission('manage_users'),
  async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is empty" });
    }

    console.log("Received request in delete employee: ");
    console.log(req.body);

    const deleteSuccess = await userService.removeSocietyFromEmployeeService(req.body.user_id, req.body.society_id);
    console.log("Result of add employee:");
    console.log(deleteSuccess);
    res.status(201).json(deleteSuccess);
  } catch (error) {
      res.status(400).json({ message: "From delete employee society Catch block: " + error.message });
  }
});

router.get("/employee/societies/:user_id",
  authenticateToken, requirePermission('manage_users'),
  async (req, res) => {
  try {
    // Check for empty request
    if (!req.params || Object.keys(req.params).length === 0) {
      return res.status(400).json({ error: "Request parameters are empty" });
    }

    // Check for empty fields
    let user_id = req.params.user_id;
    console.log("User_Id get employee societies: ", user_id);
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Proceed with fetching user
    const societies = await userService.getSocietiesFromEmployee(user_id);
    res.status(200).json(societies);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error coming from the catch block: " + error.message });
  }
});

router.get("/get_voted/", 
  // authenticateToken, requirePermission('view_results'),
  async (req, res) => {
  try {
    // Check for empty request
    const { ballot_id, society_id } = req.query;
    console.log("ballot_id get users voted ", ballot_id);
    if (!ballot_id) {
      return res.status(400).json({ error: "Ballot ID is required" });
    }

    // Proceed with fetching user
    const users = await getUsersVotedService(ballot_id, society_id);
    res.status(200).json(users);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error coming from the catch block: " + error.message });
  }
});

export default router;