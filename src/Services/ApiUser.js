// ═══════════════════════════════════════════════
// 📁 src/api/apiUser.js
// ═══════════════════════════════════════════════

import axios from "axios";
import { use } from "react";

const apiUrl = "http://localhost:5000/users";

// ─────────────────────────────────────────
// GET - Récupérer tous les utilisateurs
// ─────────────────────────────────────────
export async function getAllUsers() {
  return await axios.get(`${apiUrl}/getAllUsers`);
}

// ─────────────────────────────────────────
// GET - Récupérer un utilisateur par ID
// ─────────────────────────────────────────
export async function getUserById(id) {
  return await axios.get(`${apiUrl}/getUser/${id}`);
}

// ─────────────────────────────────────────
// POST - Ajouter un utilisateur
// ─────────────────────────────────────────
export async function addUser(userData) {
  return await axios.post(`${apiUrl}/addUser`, {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    xp: userData.xp,
    isActive: userData.isActive,
    password: userData.password,
  });
}
export async function addUserWithImage(userData) {
  return await axios.post(`${apiUrl}/addUserWithImage`, {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    xp: userData.xp,
    isActive: userData.isActive,
    image: userData.image,
    Headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
}


 
// ─────────────────────────────────────────
// PUT - Modifier un utilisateur
// ─────────────────────────────────────────
export async function updateUser(id, userData) {
  return await axios.put(`${apiUrl}/updateUser/${id}`, {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    xp: userData.xp,
    isActive: userData.isActive,
  });
}

// ─────────────────────────────────────────
// DELETE - Supprimer un utilisateur
// ─────────────────────────────────────────
export async function deleteUser(id) {
  return await axios.delete(`${apiUrl}/deleteUser/${id}`);
}

// ─────────────────────────────────────────
// GET - Rechercher utilisateurs par nom
// ─────────────────────────────────────────
export async function searchUsers(query) {
  return await axios.get(`${apiUrl}/searchUsers`, {
    params: { name: query },
  });
}

// ─────────────────────────────────────────
// GET - Filtrer utilisateurs par rôle
// ─────────────────────────────────────────
export async function getUsersByRole(role) {
  return await axios.get(`${apiUrl}/getUsersByRole/${role}`);
}

// ─────────────────────────────────────────
// GET - Filtrer utilisateurs par status
// ─────────────────────────────────────────
export async function getUsersByStatus(isActive) {
  return await axios.get(`${apiUrl}/getUsersByStatus`, {
    params: { isActive },
  });
}

// ─────────────────────────────────────────
// PUT - Modifier le status d'un utilisateur
// ─────────────────────────────────────────
export async function updateUserStatus(id, isActive) {
  return await axios.put(`${apiUrl}/updateUserStatus/${id}`, {
    isActive,
  });
}

// ─────────────────────────────────────────
// PUT - Modifier le XP d'un utilisateur
// ─────────────────────────────────────────
export async function updateUserXP(id, xp) {
  return await axios.put(`${apiUrl}/updateUserXP/${id}`, {
    xp,
  });
}
export async function loginUser(userData) {
  return await axios.post(`${apiUrl}/login`, userData)
}