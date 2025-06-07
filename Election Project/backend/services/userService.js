import hashPassword from '../utils/passwordHashing.js';
import jwt from 'jsonwebtoken';
import dl from "../data/userAccess.js";
import { addEmployee, getSocietyIdsByUserId, deleteEmployee, removeSocietyFromEmployee, updateEmployee } from '../data/employeeAccess.js';
import { getSocietyById } from './societyService.js';
import { isValidPassword, isValidUserName, isHashed } from '../business/login.js'

/**
 * Registers a new user with hashed password.
 * @param {Object} userData - User details including email and password.
 * @returns {Promise<Object>} - Created user object.
 */
async function registerUser(userData) {
  console.log("Received user data in userService");
  console.log(userData);
    if (isValidPassword(userData.password)) {
      console.log("Password Passed business validation");
    }else{
      throw new Error("Password does not meet complexity requirements.");
    }

    if (isValidUserName(userData.username)) {
      console.log("Username Passed business validation");
    }else{
      throw new Error("Username does not meet complexity requirements.");
    }

    const hashedPassword = await hashPassword(userData.password);
    const newUser = await dl.addUser(userData.username, hashedPassword); //, userData.email, userData.role
    return newUser;
}

export async function registerEmployee(userData) {
  console.log("Received user data in userService");
  console.log(userData);
    if (!isValidPassword(userData.password)) {
        throw new Error("Password does not meet complexity requirements.");
    }else{
      console.log("User Data Passed business validation");
    }

    const hashedPassword = await hashPassword(userData.password);
    const newUser = await addEmployee({
      "user_id": userData.user_id,
      "username": userData.username,
      "society_ids": userData.societyIds,
      "password_hash": hashedPassword
    });
    return newUser;
}

export async function getSocietiesFromEmployee(user_id){
  console.log("Received user_id in userService: ", user_id);
  const society_ids = await getSocietyIdsByUserId(user_id);
  let societies = [];
  for(const society_id of society_ids){
    let society = await getSocietyById(society_id);
    societies.push(society);
  }

  return societies;
}

export async function deleteEmployeeService(user_id){
  console.log("Received user_id in userService: ", user_id);
  let deleteSuccess = await deleteEmployee(user_id);
  return deleteSuccess;
}

export async function removeSocietyFromEmployeeService(user_id, society_id){
  console.log("Received user_id in userService: ", user_id);
  console.log("Received society_id in userService: ", user_id);
  let deleteSuccess = await removeSocietyFromEmployee(user_id, society_id);
  return deleteSuccess;
}

/**
 * Authenticates user and returns a JWT token.
 * @param {Object} userObj - User credentials including username and password.
 * @returns {Promise<string>} - JWT access token.
 */
async function loginUser(userObj) {
    if (!userObj?.username || !userObj?.password) {
      throw new Error("Username and password required");
    }
  
    const user = await dl.authenticateUser(userObj);
    console.log("User after calling authenticate user");
    console.log(user);
    console.log(user.user);
    if (!user.success) {
      console.log("User not found in userService");
      console.log(user.user);
      throw new Error("Coming from userService: Invalid username or password");
    }
    

    // Build JWT payload with useful info
    const payload = {
      user_id: user.user.user_id,
      username: user.user.username,
      role: user.user.role,
      society_id: user.user.society_id
    };

    console.log("Payload in userService:");
    console.log(payload);
  
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("User ID from token: " + jwt.verify(token, process.env.JWT_SECRET).user_id);

    return token;
}

export async function getUsernameExists(username) {
  const userExists = await dl.usernameExists(username);
  return userExists;
}

export async function getUserByID(user_id){
  console.log("Received user_id in getUserByID: " + user_id);

  const user = await dl.getUser(user_id);

  return user;
}

export async function setUserSocietyAndRole(user_id, society_id, role){
  console.log("Role: ", role);
  if (!user_id) {
    throw new Error("user_id is required");
  }
  if (!society_id || !role) {
    throw new Error("society_id and role are required");
  }

  const result = await dl.updateUser(user_id, role, society_id);
  return result;
}

export async function setAdmin(user_id, role){
  console.log("Role: ", role);
  if (!user_id) {
    throw new Error("user_id is required");
  }
  if (!role) {
    throw new Error("role is required");
  }

  const result = await dl.updateUser(user_id, role);
  return result;
}

export async function updateUserService(userObj){
  console.log("Received user data in userService");
  console.log(userObj);
  let hashed = isHashed(userObj.password);
    if (hashed || isValidPassword(userObj.password)) {
      console.log("Password Passed business validation");
    }else{
      throw new Error("Password does not meet complexity requirements.");
    }

    if (isValidUserName(userObj.username)) {
      console.log("Username Passed business validation");
    }else{
      throw new Error("Username does not meet complexity requirements.");
    }

    let hashedPassword;
    if(!hashed){
      hashedPassword = hashPassword(userObj.password);
    }else{
      hashedPassword = userObj.password;
    }

    let user_result = await dl.updateUser(userObj.user_id, userObj.role, userObj.society_id, userObj.username, hashedPassword);
    let emp_result;
    if(userObj.role === "employee"){
      emp_result = await updateEmployee(userObj.user_id, userObj.society_ids);
    }
    return (emp_result) ? {"user_result": user_result, "emp_result": emp_result} : user_result;
}

export async function deleteUserService(user_id){
  console.log("Received user_id in userService: ", user_id);
  const deleteResult = await dl.deleteUser(user_id);
  return deleteResult;
}


export default {
  loginUser, 
  registerUser, 
  getUsernameExists, 
  setUserSocietyAndRole, 
  registerEmployee, 
  getSocietiesFromEmployee,
  deleteEmployeeService,
  removeSocietyFromEmployeeService,
  getUserByID,
  updateUserService,
  setAdmin,
  deleteUserService
};