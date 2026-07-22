import axios from "axios";

const apiUrl = "http://localhost:5000/badges";

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ─── Gestion admin (existant) ─────────────────────────
export async function getAllUsersWithBadges() {
  return await axios.get(`${apiUrl}/getAllUsersWithBadges`);
}

export async function getUserBadges(userId) {
  return await axios.get(`${apiUrl}/getUserBadges/${userId}`);
}

export async function addBadgeToUser(userId, badgeName) {
  return await axios.post(`${apiUrl}/addBadgeToUser/${userId}`, { badge: badgeName });
}

export async function removeBadgeFromUser(userId, badgeName) {
  return await axios.put(`${apiUrl}/removeBadgeFromUser/${userId}`, { badge: badgeName });
}

export async function searchUsersByBadges(query) {
  return await axios.get(`${apiUrl}/searchUsersByBadges`, { params: { name: query } });
}

export async function getAvailableBadges() {
  return await axios.get(`${apiUrl}/getAvailableBadges`);
}

export async function getBadgeStats() {
  return await axios.get(`${apiUrl}/getBadgeStats`);
}

export async function createNewBadgeType(badgeData) {
  return await axios.post(`${apiUrl}/addBadgeType`, badgeData);
}

export async function updateBadgeType(id, badgeData) {
  return await axios.put(`${apiUrl}/updateBadgeType/${id}`, badgeData);
}

export async function deleteBadgeType(id) {
  return await axios.delete(`${apiUrl}/deleteBadgeType/${id}`);
}

// ─── XP & Gamification (nouveau) ─────────────────────
export async function getMyXP() {
  return await axios.get(`${apiUrl}/me`, authConfig());
}

export async function getLeaderboard() {
  return await axios.get(`${apiUrl}/leaderboard`);
}

export async function addReviewXP() {
  return await axios.post(`${apiUrl}/add-review-xp`, {}, authConfig());
}