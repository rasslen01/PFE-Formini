// ═══════════════════════════════════════════════
// 📁 src/api/apiFormations.js
// ═══════════════════════════════════════════════

import axios from "axios";

const apiUrl = "http://localhost:5000/formations";

// ─────────────────────────────────────────
// GET - Récupérer toutes les formations
// ─────────────────────────────────────────
export async function getAllFormations() {
  return await axios.get(`${apiUrl}/getAllFormations`);
}

// ─────────────────────────────────────────
// GET - Récupérer une formation par ID
// ─────────────────────────────────────────
export async function getFormationById(id) {
  return await axios.get(`${apiUrl}/getFormation/${id}`);
}

// ─────────────────────────────────────────
// POST - Ajouter une formation
// ─────────────────────────────────────────
export async function addFormation(formationData) {
  return await axios.post(`${apiUrl}/addFormation`, {
    name:        formationData.name,
    instructor:  formationData.instructor,
    centre:      formationData.centre,
    location:    formationData.location,
    price:       formationData.price,
    date:        formationData.date,
    time:        formationData.time,
    domain:      formationData.domain,
    centreLogo:  formationData.centreLogo,
    image:       formationData.image || "",   // ✅ AJOUTÉ
  });
}

// ─────────────────────────────────────────
// POST - Ajouter une formation avec image (multipart)
// ─────────────────────────────────────────
export async function addFormationWithImage(formationData) {
  const formData = new FormData();
  formData.append("name",       formationData.name);
  formData.append("instructor", formationData.instructor);
  formData.append("centre",     formationData.centre);
  formData.append("location",   formationData.location);
  formData.append("price",      formationData.price);
  formData.append("date",       formationData.date);
  formData.append("time",       formationData.time);
  formData.append("image",      formationData.image);

  return await axios.post(`${apiUrl}/addFormationWithImage`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
}

// ─────────────────────────────────────────
// PUT - Modifier une formation
// ─────────────────────────────────────────
export async function updateFormation(id, formationData) {
  return await axios.put(`${apiUrl}/updateFormation/${id}`, {
    name:        formationData.name,
    instructor:  formationData.instructor,
    centre:      formationData.centre,
    location:    formationData.location,
    price:       formationData.price,
    date:        formationData.date,
    time:        formationData.time,
    domain:      formationData.domain,
    centreLogo:  formationData.centreLogo,
    image:       formationData.image || "",   // ✅ AJOUTÉ
  });
}

// ─────────────────────────────────────────
// DELETE - Supprimer une formation
// ─────────────────────────────────────────
export async function deleteFormation(id) {
  return await axios.delete(`${apiUrl}/deleteFormation/${id}`);
}

// ─────────────────────────────────────────
// GET - Rechercher formations par nom
// ─────────────────────────────────────────
export async function searchFormations(query) {
  return await axios.get(`${apiUrl}/searchFormations`, {
    params: { name: query },
  });
}

// ─────────────────────────────────────────
// GET - Filtrer formations par centre
// ─────────────────────────────────────────
export async function getFormationsByCentre(centre) {
  return await axios.get(`${apiUrl}/getFormationsByCentre/${centre}`);
}

// ─────────────────────────────────────────
// GET - Filtrer formations par lieu
// ─────────────────────────────────────────
export async function getFormationsByLocation(location) {
  return await axios.get(`${apiUrl}/getFormationsByLocation/${location}`);
}

// ─────────────────────────────────────────
// GET - Filtrer formations par formateur
// ─────────────────────────────────────────
export async function getFormationsByInstructor(instructor) {
  return await axios.get(`${apiUrl}/getFormationsByInstructor/${instructor}`);
}

// ─────────────────────────────────────────
// GET - Filtrer formations par prix (gratuit/payant)
// ─────────────────────────────────────────
export async function getFormationsByPriceType(isFree) {
  return await axios.get(`${apiUrl}/getFormationsByPriceType`, {
    params: { isFree },
  });
}

// ─────────────────────────────────────────
// GET - Filtrer formations par plage de prix
// ─────────────────────────────────────────
export async function getFormationsByPriceRange(minPrice, maxPrice) {
  return await axios.get(`${apiUrl}/getFormationsByPriceRange`, {
    params: { minPrice, maxPrice },
  });
}

// ─────────────────────────────────────────
// GET - Filtrer formations par date
// ─────────────────────────────────────────
export async function getFormationsByDate(date) {
  return await axios.get(`${apiUrl}/getFormationsByDate`, {
    params: { date },
  });
}

// ─────────────────────────────────────────
// GET - Filtrer formations par plage de dates
// ─────────────────────────────────────────
export async function getFormationsByDateRange(startDate, endDate) {
  return await axios.get(`${apiUrl}/getFormationsByDateRange`, {
    params: { startDate, endDate },
  });
}

// ─────────────────────────────────────────
// PUT - Accepter/Valider une formation
// ─────────────────────────────────────────
export async function acceptFormation(id) {
  return await axios.put(`${apiUrl}/acceptFormation/${id}`);
}

// ─────────────────────────────────────────
// PUT - Rejeter une formation
// ─────────────────────────────────────────
export async function rejectFormation(id) {
  return await axios.put(`${apiUrl}/rejectFormation/${id}`);
}

// ─────────────────────────────────────────
// GET - Récupérer formations en attente
// ─────────────────────────────────────────
export async function getPendingFormations() {
  return await axios.get(`${apiUrl}/getPendingFormations`);
}

// ─────────────────────────────────────────
// GET - Récupérer formations acceptées
// ─────────────────────────────────────────
export async function getAcceptedFormations() {
  return await axios.get(`${apiUrl}/getAcceptedFormations`);
}

// ─────────────────────────────────────────
// PUT - Modifier le prix d'une formation
// ─────────────────────────────────────────
export async function updateFormationPrice(id, price) {
  return await axios.put(`${apiUrl}/updateFormationPrice/${id}`, { price });
}

// ─────────────────────────────────────────
// PUT - Modifier la date et l'heure d'une formation
// ─────────────────────────────────────────
export async function updateFormationDateTime(id, date, time) {
  return await axios.put(`${apiUrl}/updateFormationDateTime/${id}`, { date, time });
}

// ─────────────────────────────────────────
// GET - Compter le nombre total de formations
// ─────────────────────────────────────────
export async function getFormationsCount() {
  return await axios.get(`${apiUrl}/getFormationsCount`);
}

// ─────────────────────────────────────────
// GET - Récupérer les formations à venir
// ─────────────────────────────────────────
export async function getUpcomingFormations() {
  return await axios.get(`${apiUrl}/getUpcomingFormations`);
}