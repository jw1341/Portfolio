import apiClient from './apiClient';
import { jwtDecode } from 'jwt-decode';
import { getAllSocieties } from './societyService';
import { getEmployeeSocieties } from './userService';
import { loadUserData } from './data';

export async function loginUser(loginData) {
  if (!loginData) {
    console.log('Login data is required.');
    return;
  }

  if (!loginData.username || !loginData.password) {
    console.log('Username and password are required.');
    return;
  }

  try {
    const response = await apiClient.post('/login', loginData);
    const token = response.data;
    console.log("token for frontend:",token)
    const payload = jwtDecode(token);
    console.log(payload)
    localStorage.setItem('token', token);

    if (payload.society_id) {
      localStorage.setItem("societies", '');
      await loadUserData(payload, payload.role, payload.society_id);
    } else {
      const societies = (payload.role === "admin") 
        ? await getAllSocieties() 
        : await getEmployeeSocieties(payload.user_id);
      await loadUserData(payload, payload.role, 'employee');
      localStorage.setItem('ballots', '');
      localStorage.setItem('societies', JSON.stringify(societies));
    }

    window.location.href = '/home';
  } catch (err) {
    console.error('Login failed:', err);
  }
}

export function unloadUserData() {
  localStorage.clear();
}