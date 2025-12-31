import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

// AUTH
export const signup = (data) => axios.post(`${BASE_URL}/auth/register`, data);
export const login = (data) => axios.post(`${BASE_URL}/auth/login`, data);

// EXPO
export const getAllExpos = () => axios.get(`${BASE_URL}/expos`);
export const getSingleExpo = (id) => axios.get(`${BASE_URL}/expos/${id}`);
export const createExpo = (data, token) =>
  axios.post(`${BASE_URL}/expos`, data, { headers: { Authorization: `Bearer ${token}` } });
export const updateExpo = (id, data, token) =>
  axios.put(`${BASE_URL}/expos/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteExpo = (id, token) =>
  axios.delete(`${BASE_URL}/expos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const getBoothsByExpo = (expoId, token) =>  axios.get(`${BASE_URL}/booths/expo/${expoId}`, {
    headers: { Authorization: `Bearer ${token}` },  });

// EXHIBITOR
export const applyExhibitor = (data, token) =>
  axios.post(`${BASE_URL}/exhibitors/apply`, data, { headers: { Authorization: `Bearer ${token}` } });
export const approveExhibitor = (id, token) =>
  axios.put(`${BASE_URL}/exhibitors/approve/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
export const getExhibitorsByExpo = (expoId, token) =>
  axios.get(`${BASE_URL}/exhibitors/expo/${expoId}`, { headers: { Authorization: `Bearer ${token}` } });
export const getPendingExhibitors = (token) =>
  axios.get(`${BASE_URL}/exhibitors/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
// Get all applications of current user (Exhibitor)aa
export const getExhibitorsByUser = (token) =>
  axios.get(`${BASE_URL}/exhibitors/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });


// BOOTH
export const createBooths = (data, token) =>
  axios.post(`${BASE_URL}/booths`, data, { headers: { Authorization: `Bearer ${token}` } });
export const getAvailableBooths = (expoId, token) =>
  axios.get(`${BASE_URL}/booths/available/${expoId}`, { headers: { Authorization: `Bearer ${token}` } });
export const selectBooth = (boothId, token) =>
  axios.put(`${BASE_URL}/booths/select/${boothId}`, {}, { headers: { Authorization: `Bearer ${token}` } });

// SESSION
export const createSession = (data, token) =>
  axios.post(`${BASE_URL}/sessions`, data, { headers: { Authorization: `Bearer ${token}` } });
export const updateSession = (id, data, token) =>
  axios.put(`${BASE_URL}/sessions/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const getSessionsByExpo = (expoId, token) =>
  axios.get(`${BASE_URL}/sessions/expo/${expoId}`, { headers: { Authorization: `Bearer ${token}` } });

// REGISTRATION
// export const registerExpo = (data, token) =>
//   axios.post(`${BASE_URL}/registrations/expo`, data, { headers: { Authorization: `Bearer ${token}` } });
export const registerSession = (data, token) =>
  axios.post(`${BASE_URL}/registrations/session`, data, { headers: { Authorization: `Bearer ${token}` } });
export const registerExpo = (data, token) =>
  axios.post(`${BASE_URL}/registrations/expo`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
// api.js
export const getUserRegistrations = (token) =>
  axios.get(`${BASE_URL}/registrations/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });

