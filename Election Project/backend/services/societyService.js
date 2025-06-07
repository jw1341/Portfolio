import societyAccess from "../data/societyAccess.js";

export async function getSocietyById(id) {
    // Validate the ID
    if (!id) {
        return { success: false, error: "Society ID is required" };
    }
    return await societyAccess.getSocietyById(id);
}

export function addSociety(societyData) {
    // Validate the society data
    if (!societyData.society_name || !societyData.description) {
        return { success: false, error: "Name and description are required" };
    }

    // Call the data access layer to add the society
    return societyAccess.addSociety(societyData);
}

export async function getAllSocietiesService() {
    console.log("Getting all societies...");
    console.log("Right before calling societyAccess.getAllSocieties in societyService");
    let societies = await societyAccess.getAllSocieties();
    console.log("Right after calling societyAccess.getAllSocieties in societyService");

    return societies;
}

export function updateSociety(societyData) {
    // Validate the society data
    if (!societyData.society_id) {
        return { success: false, error: "Society ID is required" };
    }

    if (!societyData.society_name || !societyData.description) {
        return { success: false, error: "Name and description are required" };
    }

    return societyAccess.updateSociety(societyData.society_id, societyData);
}

export function deleteSociety(societyID) {
    // Validate the society ID
    if (!societyID) {
        return { success: false, error: "Society ID is required" };
    }

    return societyAccess.deleteSociety(societyID);
}

export default {
    getSocietyById,
    addSociety,
    getAllSocietiesService,
    updateSociety,
    deleteSociety
};
