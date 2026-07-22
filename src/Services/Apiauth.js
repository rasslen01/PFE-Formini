import axios from "axios";

const apiUrl = "http://localhost:5000/auth";

export const registerUser = (data) =>
  axios.post(`${apiUrl}/register`, data);

export const loginUser = (data) =>
  axios.post(`${apiUrl}/login`, data);

export const verifyEmail = (token) =>
  axios.get(`${apiUrl}/verify-email?token=${token}`);

export const resendVerifyEmail = (email) =>
  axios.post(`${apiUrl}/resend-verify-email`, { email });

export const forgotPassword = (email) =>
  axios.post(`${apiUrl}/forgot-password`, { email });

export const resetPassword = (token, password) =>
  axios.post(`${apiUrl}/reset-password`, { token, password });