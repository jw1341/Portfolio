import apiClient from './apiClient';

export async function getUser(user_id) {
  const response = await apiClient.get(`/user/get/${user_id}`);
  return response.data;
}

export async function updateUser(user_id, userData) {
  return await apiClient.post('/user/update', { user_id, ...userData });
}

export async function deleteUser(user_id) {
  return await apiClient.post('/user/delete', { user_id });
}

export async function updateUserRole(user_id, role, society_id) {
  if (!user_id || !role) return;

  const endpoint = (role === 'admin') 
    ? '/user/set/admin' 
    : '/user/set/society';

  const body = (role === 'admin') 
    ? { user_id, role } 
    : { user_id, role, society_id };

  return await apiClient.post(endpoint, body);
}

export async function checkUsernameExists(username) {
  const response = await apiClient.get(`/user/get/username/${username}`);
  return response.data;
}

export async function deleteEmployee(user_id) {
  return await apiClient.post('/user/employee/delete', { user_id });
}

export async function registerUser(regData) {
  if (!regData.username || !regData.password) {
    throw new Error('Username and password are required.');
  }

  if (regData.password !== regData.confirmPassword) {
    throw new Error('Passwords do not match.');
  }

  const response = await apiClient.post('/register', regData);

  if (!response.data || !response.data.user) {
    throw new Error('Registration failed: no user returned.');
  }

  const role = regData.role || 'member';
  const society_id = regData.society_id ?? (role === 'admin' ? '' : Math.floor(Math.random() * 80));

  if (role === 'admin') {
    await updateUserRole(response.data.user.user_id, role);
  } else {
    await updateUserRole(response.data.user.user_id, role, society_id);
  }

  return response.data.user;
}

export async function registerEmployee(regData) {
  if (!regData.username || !regData.password) {
    throw new Error('Username and password are required.');
  }

  if (regData.password !== regData.confirmPassword) {
    throw new Error('Passwords do not match.');
  }

  const response = await apiClient.post('/user/employee', regData);

  if (!response.data || !response.data.newEmployee) {
    throw new Error('Registration failed: no employee returned.');
  }

  return response.data.newEmployee;
}


export async function getEmployeeSocieties(user_id) {
  const response = await apiClient.get(`/user/employee/societies/${user_id}`);
  return response.data;
}
