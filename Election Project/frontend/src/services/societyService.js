import apiClient from './apiClient';

export async function getSociety(society_id) {
  const response = await apiClient.get(`/society/get/${society_id}`);
  return response.data.society;
}

export async function getAllSocieties() {
  const response = await apiClient.get('/society/getAll');
  localStorage.setItem("societies", JSON.stringify(response.data));
  return response.data;
}

export async function addSociety(societyObj){
  const response = await apiClient.post(`/society/add/`, societyObj);
  console.log("Result of addSociety:");
  console.log(response);
  return response.data;
}

export async function updateSociety(society_id, societyObj){
  const response = await apiClient.put("/society/update/", {society_id, ...societyObj});
  console.log("Result of updateSociety:");
  console.log(response);
  return response.data;
}

export async function deleteSociety(society_id){
  const response = await apiClient.delete(`/society/delete/${society_id}`);
  console.log("Result of deleteSociety:");
  console.log(response);
  return response.data;
}