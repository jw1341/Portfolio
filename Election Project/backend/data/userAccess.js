import UserLogin from "../models/User.js";
import bcrypt from 'bcrypt';
import { sequelize } from '../config/db.js';

// CREATE
/**
 * Takes in all user info and adds it to the database
 * @param {*} username 
 * @param {*} hashedPassword 
 * * @returns true if successful, false if not
 */
async function addUser(username, hashedPassword, role) {
    const transaction = await sequelize.transaction();

    console.log("Received user data in data access layer: " + username);
    let newUser;
    
    try {
        const existingUser = await UserLogin.findOne({ 
            where: { username },
            transaction
        });
        
        if (existingUser) {
            await transaction.rollback();
            return { success: false, error: "Username already exists" };
        }

        if(role){
            newUser = await UserLogin.create({
                username,
                password_hash: hashedPassword,
                role: role
            }, { transaction });
        }else{
            newUser = await UserLogin.create({
                username,
                password_hash: hashedPassword
            }, { transaction });
        }

        await transaction.commit();
        return { success: true, user: newUser };
    } catch (error) {
        await transaction.rollback();
        console.error("Error registering user: ", error);
        return { success: false, error: error.message };
    }
}

// READ
/**
 * Authenticates a user by username and password.
 * @param {{ username: string, password: string }} userObj 
 * @returns {Promise<boolean>} true if valid, false otherwise
 */
async function authenticateUser(userObj) {
    const { username, password } = userObj;
  
    if (!username || !password) {
      throw new Error("Username and password are required.");
    }
    
    console.log(userObj);
    console.log(username, password);
  
    const user = await UserLogin.findOne({
      where: { username: username.trim() }
    });

    console.log("User received in authenticate User:");
    console.log(user);
    console.log("User.DataValues received in authenticate User:");
    // console.log(user.dataValues);
  
    if (!user) {
      console.log("User does not exist????");
      // Dummy bcrypt compare to protect against timing attacks
      const DUMMY_HASH = '$2b$10$abcdefghi4hjksdfghqruoiccxbnmb8nmqbnmqw33ebnmzxc6hjkjkfgsd8hjklmnopqrstuv'; // Dummy hash for bcrypt compare
      // This should be a hash of a password that is guaranteed to fail
      await bcrypt.compare(password, DUMMY_HASH);
      return { success: false, error: "User was not found OR bcrypt.compare did not work" };
    }
  
    const passwordMatch = await bcrypt.compare(password.trim(), user.password_hash);

    if (!passwordMatch) {
      console.log("Password match failed");
      return { success: false, error: "Password Match failed" };
    }
  
    // Optional: add a "status" check if you add it later
    if (user.status !== 'active') {
      return { success: false, error: "Account inactive. Contact support." };
    }
  
    // Return a safe user object (no password_hash)
    const safeUser = {
      user_id: user.dataValues.user_id,
      username: user.dataValues.username,
      role: user.dataValues.role,
      society_id: user.dataValues.society_id
    };

    console.log("safeUser in authenticate User:");
    console.log(safeUser);
  
    return { success: true, user: safeUser };
  }

/**
 * Retrieves a user from the database using userID and returns an object with relevant info
 * @param {*} userID 
 * @returns user Object if successful, returns false if not
 */
export async function getUser(userID) {
    try {
      const user = await UserLogin.findOne({ where: { user_id: userID } }); // Fix field name
      if (!user) return false;
  
      // Build safe user object (no password_hash)
      const userObj = {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        society_id: user.society_id,
        hashedPassword: user.password_hash
      };
  
      return userObj;
    } catch (error) {
      console.error("Error obtaining user: ", error);
      throw new Error(error.message); // Better to throw and catch higher
    }
  }

  export async function usernameExists(username) {
    try {
      const user = await UserLogin.findOne({ where: { username: username } }); // Fix field name
      if (!user) return false;

      return true;
    } catch (error) {
      console.error("Error obtaining user: ", error);
      throw new Error(error.message); // Better to throw and catch higher
    }
  }

  export async function getUserByUName(username) {
    try {
      const user = await UserLogin.findOne({ where: { username: username } }); // Fix field name
      if (!user) return false;

      return user;
    } catch (error) {
      console.error("Error obtaining user: ", error);
      throw new Error(error.message); // Better to throw and catch higher
    }
  }

async function getUserRole(userID){
    try {
        let user = await UserLogin.findOne({ where: { userId: userID } });

    } catch (error) {
        
    }
}

/**
 * Finds all users in a society
 * @param {number} societyId - The society ID
 * @returns { Array<User> } - Array of users in a society
 * @returns { Promise<Number> } - number of user objects in the array
 */
export async function getUsersBySociety(societyId){
  try {
    // Find all users in a society
    const users = await UserLogin.findAll({ where: { society_id: societyId } }); 
    if (!users){
      return { success: false, error: "No users found in society" };
    } 
    return { success: true, societyUsers: users, numUsers: users.length };

  } catch (error) {
    console.error("Error obtaining society users: ", error);
    return { success: false, error: error.message };
  }
}

// UPDATE
/**
 * Updates a user's info
 * @param {*} userID 
 * @param {*} useName 
 * @param {*} password 
 * @param {*} email 
 * @param {*} role 
 * @returns true if successful, false if not
 */
async function updateUser(userID, role, society_id, useName, password){
    let transaction = await sequelize.transaction();
    let updated;

    console.log("Received role in updateUser: " + role);
    console.log("Received society_id in updateUser: " + society_id);
    
    try {
        if(!useName || !password){
            updated = await UserLogin.update(
                (society_id) ?
                {
                    role: role,
                    society_id: society_id
                }
                :
                {
                  role: role
                },
                {
                  where: {
                    user_id: userID,
                  },
                  transaction
                },
            );
        }else{
            updated = await UserLogin.update(
                (society_id) ?
                { username: useName,
                    password_hash: password,
                    role: role,
                    society_id: society_id
                }
                :
                { username: useName,
                  password_hash: password,
                  role: role,
                },
                {
                  where: {
                    user_id: userID,
                  },
                  transaction
                },
            );
        }
        if (updated[0] === 0) {
            await transaction.rollback();
            return { success: false, error: "Failed to update user." };
        }
        
        await transaction.commit();
        return { success: true, user: updated };
        
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating user: ", error);
        return { success: false, error: "Error coming from userAccess" + error.message };
    }
}

// DELETE
/**
 * Sets user visibility in the database to deleted
 * @param {*} userID 
 * @returns true if successful, false if not
 */
export async function deleteUser(userID){
    const transaction = await sequelize.transaction();
    
    try {
        const updated = await UserLogin.update(
            { status:'inactive',},
            {
              where: {
                user_id: userID,
              },
              transaction
            },
        );
        if (updated === 0) {
            await transaction.rollback();
            return { success: false, error: "Failed to delete user." };
        }
        
        await transaction.commit();
        return { success: true };
        
    } catch (error) {
        await transaction.rollback();
        console.error("Error deleting user: ", error);
        return { success: false, error: error.message };
    }
}

export async function classifyVoterParticipation(userIds, societyId) {
  try {
    // Get all users in the given society
    const usersInSociety = await UserLogin.findAll({
      where: { society_id: societyId },
      raw: true
    });

    const hasVoted = [];
    const hasNotVoted = [];

    // Classify each user
    for (const user of usersInSociety) {
      if (userIds.includes(user.user_id)) {
        hasVoted.push(user);
      } else {
        hasNotVoted.push(user);
      }
    }

    return { hasVoted, hasNotVoted };
  } catch (error) {
    console.error('Error classifying voter participation:', error);
    throw error;
  }
}


export default  { 
    addUser,
    authenticateUser,
    getUser,
    usernameExists,
    getUserByUName,
    updateUser,
    deleteUser,
    getUsersBySociety
};