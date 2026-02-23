// ═══════════════════════════════════════════════
// 📁 src/api/apiCentre.js
// ═══════════════════════════════════════════════

import axios from "axios";

const apiUrl = "http://localhost:5000";

// ─────────────────────────────────────────
// GET - Récupérer tous les centres
// ─────────────────────────────────────────
export async function getAllCentres() {
  return await axios.get(`${apiUrl}/getAllCentres`);
}

// ─────────────────────────────────────────
// GET - Récupérer un centre par ID
// ─────────────────────────────────────────
export async function getCentreById(id) {
  return await axios.get(`${apiUrl}/getCentre/${id}`);
}

// ─────────────────────────────────────────
// POST - Ajouter un centre
// ─────────────────────────────────────────
export async function addCentre(centreData) {
  return await axios.post(`${apiUrl}/addCentre`, {
    name: centreData.name,
    email: centreData.email,
    logo: centreData.logo,
    status: centreData.status,
  });
}

// ─────────────────────────────────────────
// PUT - Modifier un centre
// ─────────────────────────────────────────
export async function updateCentre(id, centreData) {
  return await axios.put(`${apiUrl}/updateCentre/${id}`, {
    name: centreData.name,
    email: centreData.email,
    logo: centreData.logo,
    status: centreData.status,
  });
}

// ─────────────────────────────────────────
// DELETE - Supprimer un centre
// ─────────────────────────────────────────
export async function deleteCentre(id) {
  return await axios.delete(`${apiUrl}/deleteCentre/${id}`);
}

// ─────────────────────────────────────────
// PUT - Accepter un centre (pending → accepted)
// ─────────────────────────────────────────
export async function acceptCentre(id) {
  return await axios.put(`${apiUrl}/acceptCentre/${id}`, {
    status: "accepted",
  });
}

// ─────────────────────────────────────────
// PUT - Rejeter un centre (pending → rejected)
// ─────────────────────────────────────────
export async function rejectCentre(id) {
  return await axios.put(`${apiUrl}/rejectCentre/${id}`, {
    status: "rejected",
  });
}

// ─────────────────────────────────────────
// GET - Récupérer centres par status
// ─────────────────────────────────────────
export async function getCentresByStatus(status) {
  return await axios.get(`${apiUrl}/getCentresByStatus/${status}`);
}

// ─────────────────────────────────────────
// GET - Rechercher centres par nom
// ─────────────────────────────────────────
export async function searchCentres(query) {
  return await axios.get(`${apiUrl}/searchCentres`, {
    params: { name: query },
  });
}