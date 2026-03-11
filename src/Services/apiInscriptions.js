import axios from "axios";

const API = "http://localhost:5000/inscriptions";


export const registerFormation = (formationId, token) => {

  return axios.post(
    `${API}/createInscription`,
    { formationId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};


export const getMyInscriptions = (token) => {

  return axios.get(`${API}/getMyInscriptions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};


export const acceptInscription = (id, token) => {

  return axios.put(
    `${API}/acceptInscription/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};


export const cancelInscription = (id, token) => {

  return axios.put(
    `${API}/cancelInscription/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};