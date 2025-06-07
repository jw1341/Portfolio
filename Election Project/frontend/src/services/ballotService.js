import apiClient from './apiClient';

export async function handleEditBallotSubmit(fData) {
  try {
    const endpoint = localStorage.getItem('currentBallot') 
      ? `/ballot/update/${[fData.ballot_id, fData.society_id]}`
      : '/ballot/create';
    const method = localStorage.getItem('currentBallot') ? 'put' : 'post';

    const response = await apiClient[method](endpoint, fData);
    console.log('Ballot submission successful:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error editing ballot:', err);
  }
}

export async function getBallotDataFromDB(setFData, ballot_id, society_id) {
  const response = await apiClient.get(`/ballot/get/${[ballot_id, society_id]}`);
  setFData(response.data);
}

export async function getAllBallotsBySociety(society_id) {
  const response = await apiClient.get(`/ballot/getAll/${society_id}`);
  localStorage.setItem('ballots', JSON.stringify(response.data));
  return response.data;
}

export async function castVote(vote) {
  const response = await apiClient.post('/ballot/castVote', vote);
  return response.data;
}

export async function castInitVote(vote) {
  const response = await apiClient.post('/ballot/castInitVote', vote);
  return response.data;
}

export function createFormItem(stateVar, stateSetter, path) {
  let _path = path + (stateVar.length + 1);
  stateSetter([...stateVar, _path]);
}

export function syncState(obj, path) {
  // Define getValueFromPath function
  function getValueFromPath(obj, path) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  }
  
    return [...Object.keys(getValueFromPath(obj, path))];
}

export async function deleteBallot(ballot_id){
  const response = await apiClient.delete(`/ballot/delete/${ballot_id}`);
  console.log("Result of delete ballot:");
  console.log(response);
  return response.data;
}

export async function getBallotResults(ballot_id){
  if(!ballot_id){
    console.log("ballot_id required");
    return
  }

  const response = await apiClient.get(`/analytics/ballot_results/${ballot_id}`);
  console.log("Results returned from getBallotResults:");
  console.dir(response.data, {depth: null});

  return response.data;
}

export async function getInitiativeResults(ballot_id){
  if(!ballot_id){
    console.log("ballot_id required");
    return
  }

  const response = await apiClient.get(`/analytics/initiative_results/${ballot_id}`);
  console.log("Results returned from getBallotResults:");
  console.dir(response.data, {depth: null});

  return response.data;
}