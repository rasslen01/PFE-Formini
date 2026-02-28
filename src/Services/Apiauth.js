import axios from "axios";

const apiUrl = "http://localhost:5000/auth";

export const registerUser = (data) => {
  return axios.post(`${apiUrl}/register`, data);
};

export const loginUser = (data) => {
  return axios.post(`${apiUrl}/login`, data);
};