import Initiative from "../models/Initiative.js";
import userAccess from "./userAccess.js";
import societyAccess from "./societyAccess.js";

import { sequelize } from "../config/db.js";
import Employee from "../models/Employee.js";

// CREATE
/**
 * Creates a new Employee in the database
 * @param {Object} userData - The user data to make an employee
 * @returns {Promise<Object>} Object with success status and employee or error
 */
export async function addEmployee(userData) {
    const transaction = await sequelize.transaction();
    console.log("User Data passed into employeeAccess:");
    console.log(userData);
    try {
        // Check if Employee with same user_id and society_id already exists
        let user = await userAccess.getUserByUName(userData.username);
        let plainUser;
        if(!user){
            // adds user if it does not exists
            user = await userAccess.addUser(userData.username, userData.password_hash, "employee");
            plainUser = user.user.get({ plain: true });

            console.log("User created:");
            console.log(plainUser);
        }

        // checks if user exists
        let newEmployee;
        // checks if society exists
        for (const society_id of userData.society_ids) {
            const society = await societyAccess.getSocietyById(society_id);
            if (!society) {
                throw new Error(`Society ${society_id} does not exist`);
            }
        
            const existingEmployee = await Employee.findOne({
                where: { 
                    user_id: plainUser.user_id,
                    society_id: society_id
                },
                transaction
            });
        
            if (existingEmployee) {
                await transaction.rollback();
                return { success: false, error: "Employee already exists" };
            }
        
            // Add employee
            newEmployee = await Employee.create(
                { user_id: plainUser.user_id, society_id: society_id },
                { transaction }
            );
        }
        

        await transaction.commit();
        return { success: true, newEmployee: newEmployee };
    } catch (error) {
        await transaction.rollback();
        console.error("Error adding Employee: ", error);
        return { success: false, error: error.message };
    }
}

// READ
/**
 * Retrieves an employee by user_id and society_id
 * @param {number} user_id - The ID of the user to retrieve
 * @param {number} society_id - The ID of the society to retrieve
 * @returns {Promise<Object>} Object with success status and employee or error
 */

export async function getEmployee(user_id, society_id){
    try {
        const employee = await Employee.findOne({
            where: {
                user_id: user_id,
                society_id: society_id
            }
        });

        if (!employee) {
            return { success: false, error: "Employee not found" };
        }

        return { success: true, employee: employee };
    } catch (error) {
        console.error("Error retrieving Employee: ", error);
        return { success: false, error: error.message };
    }
}

export async function getSocietyIdsByUserId(user_id) {
    const employees = await Employee.findAll({
      where: {
        user_id: user_id
      },
      attributes: ['society_id']
    });
  
    // Extract only the society_id values
    return employees.map(record => record.society_id);
}
  

// Delete
/**
 * Deletes an employee by user_id and society_id
 * @param {number} user_id - The ID of the user to retrieve
 * @param {number} society_id - The ID of the society to retrieve
 * @returns {Promise<Object>} Object with success status and employee or error
 */

export async function deleteEmployee(user_id){
    const transaction = await sequelize.transaction();
    console.log("Start of delete employee");
    try {
        console.log("Right before running getSocieties");
        const employee = await getSocietyIdsByUserId(user_id);
        console.log("Right after running getSocieties");
        if (!employee) {
            await transaction.rollback();
            return { success: false, error: "Employee not found" };
        }
        else {
            console.log("About to destroy employees");
            const result = await Employee.destroy({
                where: {
                    user_id: user_id
                },
                transaction
            });
            if (result === 0) {
                await transaction.rollback();
                return { success: false, error: "Failed to delete Employee" };
            }
            await transaction.commit();
            console.log("Employee deleted successfully");
            return { success: true, message: "Employee deleted successfully" };
        }
        
    } catch (error) {
        console.error("Error deleting Employee: ", error);
        return { success: false, error: error.message };
    }
}

export async function removeSocietyFromEmployee(user_id, society_id){
    const transaction = await sequelize.transaction();
    try {
        const employee = getEmployee(user_id, society_id);
        if (!employee) {
            await transaction.rollback();
            return { success: false, error: "Employee not found" };
        }
        else {
            const result = await Employee.destroy({
                where: {
                    user_id: user_id,
                    society_id: society_id
                },
                transaction
            });
            if (result === 0) {
                await transaction.rollback();
                return { success: false, error: "Failed to remove society from employee" };
            }
            await transaction.commit();
            return { success: true, message: "Society removed successfully" };
        }
        
    } catch (error) {
        console.error("Error deleting Employee: ", error);
        return { success: false, error: error.message };
    }
}

export async function updateEmployee(user_id, society_ids){
    const transaction = await sequelize.transaction();
    console.log("Received society ids in updateEmployee:");
    console.log(society_ids);
    console.log("Length of society_ids: " + society_ids.length);
    try {
        console.log("Right before running delete...");
        let deleted = await deleteEmployee(user_id);
        console.log("Right after running delete...");

        // checks if user exists
        let newEmployee;
        // checks if society exists
        console.log("Length of society_ids: " + society_ids.length);
        for (const society_id of society_ids) {
            console.log("Got into the for loop");
            const society = await societyAccess.getSocietyById(society_id);
            if (!society) {
                throw new Error(`Society ${society_id} does not exist`);
            }
        
            const existingEmployee = await Employee.findOne({
                where: { 
                    user_id: user_id,
                    society_id: society_id
                },
                transaction
            });
        
            if (existingEmployee) {
                await transaction.rollback();
                return { success: false, error: "Employee already exists" };
            }
        
            // Add employee
            newEmployee = await Employee.create(
                { user_id: user_id, society_id: society_id },
                { transaction }
            );
            console.log("Created employee: " + user_id + ", " + society_id);
        }

        await transaction.commit();
        console.log("Employees created successfully");
        return { success: true, newEmployee: newEmployee };
        
    } catch (error) {
        console.error("Error updating Employee: ", error);
        return { success: false, error: error.message };
    }
}