import axios from "axios";

const API = "http://localhost:5000/evaluations";
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

// Soumettre ou modifier une évaluation
export const submitEvaluation = (formationId, rating, comment) =>
    axios.post(API, { formationId, rating, comment }, auth());

// Récupérer toutes les évaluations d'une formation (public)
export const getFormationEvaluations = (formationId) =>
    axios.get(`${API}/formation/${formationId}`);

// Récupérer mon évaluation pour une formation
export const getMyEvaluation = (formationId) =>
    axios.get(`${API}/my/${formationId}`, auth());

// Supprimer une évaluation
export const deleteEvaluation = (id) =>
    axios.delete(`${API}/${id}`, auth());

// Admin : toutes les évaluations
export const getAllEvaluationsAdmin = (params = {}) =>
    axios.get(`${API}/admin/all`, { ...auth(), params });