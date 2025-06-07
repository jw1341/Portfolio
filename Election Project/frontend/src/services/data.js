import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export async function handleEditBallotSubmit(fData){
    console.log(fData);
    try {
      let response;
        // RLES runs on port 3000
        console.log(fData);
        if(localStorage.getItem('currentBallot')){
          response = await axios.put(`/api/ballot/update/${[fData.ballot_id, fData.society_id]}`, fData, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        }else{
          response = await axios.post('/api/ballot/create', fData, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        }

        console.log('Edit Ballot submission successful!');
        console.log(response.data);
    } catch (err) {
        // console.log('Ballot submission failed');
        console.log(fData);
        console.error(err);
    }
}

export async function getBallotDataFromDB(setFData, ballot_id, society_id){
  try {
    // RLES runs on port 3000
        console.log(ballot_id);
        const response = await axios.get(`/api/ballot/get/${[ballot_id, society_id]}`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        console.log('Ballot returned:');
        console.log(response.data);
        setFData(response.data);
    } catch (err) {
        // console.log('Ballot submission failed');
        console.error(err);
    }
}

export async function getAllBallotsBySociety(society_id){
  console.log("Getting all ballots from the society id " + society_id);
  const response = await axios.get(`/api/ballot/getAll/${society_id}`,{
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  console.log(response.data);
  localStorage.setItem("ballots", JSON.stringify(response.data));
  return response.data;
}

export async function getEmployeeSocieties(user_id){
  console.log("Getting all societies from the user id " + user_id);
  const response = await axios.get(`/api/user/employee/societies/${user_id}`,{
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  console.log(response.data);
  localStorage.setItem("societies", JSON.stringify(response.data));
  return response.data;
}

export async function castVote(vote){
  const response = await axios.post('/api/ballot/castVote', vote, {
      headers: { 
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
  });
  console.log(response.data);
  return response.data;
}

export async function getSociety(society_id){
  console.log("Getting all ballots from the society id " + society_id);
  const response = await axios.get(`/api/society/get/${society_id}`,{
    headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

console.log("Society Obj:");
console.log(response.data.society);

return response.data.society;

}

// Functions for handling the formData state variable
export function setStateByPath(setFData, path, value) {
    const keys = path.split('.');
  
    setFData(prevState => {
      const build = (obj, i = 0) => {
        const key = keys[i];
        if (i === keys.length - 1) {
          return { ...obj, [key]: value };
        }
        return {
          ...obj,
          [key]: build(obj?.[key] ?? {}, i + 1)
        };
      };
  
      return build(prevState);
    });
  }
  
  export function getValueFromPath(obj, path) {
    const keys = path.includes('.') ? path.split('.') : [path];
    let value = keys.reduce((acc, key) => acc?.[key], obj);

    return value;
  }

  export function removeValueAtPath(obj, path) {
    if (!path) return;
  
    const keys = path.includes('.') ? path.split('.') : [path];
    const lastKey = keys.pop(); // The key to delete
    console.log(lastKey);
    const parent = keys.reduce((acc, key) => acc?.[key], obj);
    console.log(parent);
  
    if (parent && lastKey in parent) {
      delete parent[lastKey];
    }
  }
  

  export const createFormItem = (stateVar, stateSetter, path) => {
    let _path = path + (stateVar.length + 1);
    stateSetter([...stateVar, _path]);
}

export function syncState(obj, path){
    return[...Object.keys(getValueFromPath(obj, path))]
}

export async function checkUsernameExists(username){
  const response = await axios.get(`/api/user/get/username/${username}`,{
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDUwNzQyODksImV4cCI6MTc0NTA3Nzg4OX0.3zvU8-ePlgt77mjw-QBYXRmv3y6cx1L1W1vuYgkaz2M'
    }
});

console.log("Username exists: " + response.data);

return response.data;
}

export const loginUser = async (loginData) => {
  event.preventDefault();

  if (!loginData.username || !loginData.password) {
      console.log('Username and password are required.');
      return;
  }

  try {
      const response = await axios.post('/api/login', loginData, {
          headers: { 'Content-Type': 'application/json' }
      });

      // ✅ Extract token and user from backend response
      // Check userService.js to see response.data declaration
      let token = response.data;
      console.log(token);
      let payload = jwtDecode(token);
      console.log(payload);

      // ✅ Store them in localStorage (or cookies if preferred)
      if(payload.society_id){
        console.log("Calling loadUserData in if block");
        localStorage.setItem("societies", '');
        await loadUserData(payload, payload.role, payload.society_id);
      }else{
        console.log("Calling loadUserData in else block");
        let societies = (payload.role === "admin") ? await getAllSocieties() : await getEmployeeSocieties(payload.user_id);
        await loadUserData(payload, payload.role, 'employee');
        localStorage.setItem('ballots', '');
        localStorage.setItem('societies', JSON.stringify(societies));
      }
      localStorage.setItem('token', token);

      
      console.log('Login successful!');
      console.log("Session Token Saved:", token);

      // 🔁 Optional: redirect or reload
      window.location.href = '/home'; // or call a navigation function
  } catch (err) {
      console.error('Login failed. Please check your credentials.');
      console.error(err);
  }
};

export const registerUser = async (regData) => {
  event.preventDefault();
  console.log("Running handle register...");
  console.log(regData);

  if (!regData.username || !regData.password) {
      console.log('Username and password are required.');
      return;
  }

  if(regData.password !== regData.confirmPassword){
      console.log('Password fields do not match');
      return;
  }

  try {
      console.log("Running the try block");
      let response = await axios.post('/api/register', regData, {
          headers: { 'Content-Type': 'application/json' }
      });
      if(!response){
        console.log("That username is already taken.  Please try a differnt username");
        return false;
      }

      console.log("Registration response:");
      let role = (regData.role) ? regData.role : 'member';
      let society_id = (regData.society_id) ? regData.society_id : (regData.role === "admin") ? "" : Math.floor(Math.random() * 80);
      console.log(response.data.user);
      let newUser = (regData.role === "admin") ? updateUserRole(response.data.user.user_id, role) : await updateUserRole(response.data.user.user_id, role, society_id);
      console.log(newUser);
      if(!regData.role){
        await loadUserData(response.data.user, role, society_id);
        window.location.href = "/home";
      }
      return newUser;
  }
  catch(err) {
      console.log('Registration failed.  Please try again later');
      console.error(err);
  }
}

export const updateUser = async (user_id, userData) => {
  const response = await axios.post('/api/user/update', {"user_id": user_id, ...userData}, {
    headers: { 'Content-Type': 'application/json' }
  });

  return response;
}

export const getAllSocieties = async () => {
  console.log("Running getAllSocieties in data.js...");
  const response = await axios.get(`/api/society/getAll`,{
    headers: {
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDUwNzQyODksImV4cCI6MTc0NTA3Nzg4OX0.3zvU8-ePlgt77mjw-QBYXRmv3y6cx1L1W1vuYgkaz2M'
    }
  });

  console.log(response.data);
  localStorage.setItem("societies", JSON.stringify(response.data));
  return response.data;
}

export const registerEmployee = async (regData) => {
  event.preventDefault();
  console.log("Running handle register...");

  if (!regData.username || !regData.password) {
      console.log('Username and password are required.');
      return;
  }

  if(regData.password !== regData.confirmPassword){
      console.log('Password fields do not match');
      return;
  }

  try {
      console.log("Running the try block");
      const response = await axios.post('/api/user/employee', regData, {
          headers: { 'Content-Type': 'application/json' }
      });
      if(!response){
        console.log("That username is already taken.  Please try a different username");
        return false;
      }
      console.log("Registration response:");
      return response.data;
  }
  catch(err) {
      console.log('Registration failed.  Please try again later');
      console.error(err);
  }
}

export const deleteEmployee = async (user_id) => {
  console.log("Deleting user: " + user_id);

  const response = await axios.post('/api/user/employee/delete', {"user_id": user_id}, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response;
}

export async function loadUserData(userData, role, society_id){
  localStorage.setItem('user_id', JSON.stringify(userData.user_id));
  localStorage.setItem('username', JSON.stringify(userData.username));
  localStorage.setItem('role', JSON.stringify(role).replace(/^['"]|['"]$/g, ''));
  if(society_id === "employee"){
    localStorage.setItem('society_id', '');
  }else{
    localStorage.setItem('society_id', JSON.stringify(society_id));
    await getAllBallotsBySociety(society_id);
  }
  // localStorage.setItem("token", "");
}

export function unloadUserData(){
  localStorage.setItem('user_id', "");
  localStorage.setItem('username', "");
  localStorage.setItem('role', "");
  localStorage.setItem('society_id', "");
  // localStorage.setItem("token", "");
}

export async function updateUserRole(user_id, role, society_id){
  let response;
  if (!user_id || !role) {
    console.log('Error: at least one parameter is undefined');
    return;
  }
  if(role === "admin"){
    console.log("Assigning admin role...");
    response = await axios.post('/api/user/set/admin', {"user_id": user_id, "role": role}, {
      headers: { 'Content-Type': 'application/json' }
    });
  }else{
    if(!society_id){
      console.log('Error: society_id is undefined');
      return;
    }

    response = await axios.post('/api/user/set/society', {"user_id": user_id, "society_id": society_id, "role": role}, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return response;
}

export async function getUser(user_id){
  if(!user_id){
    console.log("user_id required");
    return
  }

  const response = await axios.get(`/api/user/get/${user_id}`,{
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDUwNzQyODksImV4cCI6MTc0NTA3Nzg4OX0.3zvU8-ePlgt77mjw-QBYXRmv3y6cx1L1W1vuYgkaz2M'
    }
});

console.log("User returned from getUser:");
console.log(response.data);

return response.data;

}

export function isValidPassword(pw) {
  const regExpression = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~]).{8,}$/;
  return regExpression.test(pw);
}

export function isValidUserName(username) {
  const regEx = /^[A-Za-z][A-Za-z0-9]{4,}$/;
  return regEx.test(username);
}

export async function getUsersByVoted(ballot_id, society_id){
  console.log("Getting users by voted...");
  const response = await axios.get('/api/user/get_voted/', {
    params: {
      ballot_id,
      society_id
    },
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDUwNzQyODksImV4cCI6MTc0NTA3Nzg4OX0.3zvU8-ePlgt77mjw-QBYXRmv3y6cx1L1W1vuYgkaz2M'
    }
  });

  console.log("Users by voted result:");
  console.log(response.data);

  return response.data;
}

export async function getVoterParticipation(ballot_id, society_id){
  console.log("Getting voter participation for ballot: " + ballot_id + " and society: " + society_id);
  const response = await axios.get('/api/analytics/voter_turnout/', {
    params: {
      ballot_id,
      society_id
    },
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDUwNzQyODksImV4cCI6MTc0NTA3Nzg4OX0.3zvU8-ePlgt77mjw-QBYXRmv3y6cx1L1W1vuYgkaz2M'
    }
  });
  

console.log("Result of getVoterParticipation: ");
const rounded = Math.round(response.data * 100) / 100;
console.log(rounded);
return response.data;

}

export function formatDateTime(dateString) {
  const date = new Date(dateString);

  const pad = (num) => String(num).padStart(2, '0');

  const mm = pad(date.getMonth() + 1); // Months are 0-indexed
  const dd = pad(date.getDate());
  const yyyy = date.getFullYear();

  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());

  return `${mm}/${dd}/${yyyy} ${hh}:${min}`;
}
