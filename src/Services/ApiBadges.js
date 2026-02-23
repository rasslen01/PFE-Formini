import axios from "axios";

const apiUrl = "http://localhost:5000";

export async function getAllUsersWithBadges() {
  return await axios.get(`${apiUrl}/getAllUsersWithBadges`);
}

export async function getUserBadges(userId) {
  return await axios.get(`${apiUrl}/getUserBadges/${userId}`);
}

export async function addBadgeToUser(userId, badgeName) {
  return await axios.post(`${apiUrl}/addBadgeToUser/${userId}`, {
    badge: badgeName,
  });
}

export async function removeBadgeFromUser(userId, badgeName) {
  return await axios.put(`${apiUrl}/removeBadgeFromUser/${userId}`, {
    badge: badgeName,
  });
}

export async function searchUsersByBadges(query) {
  return await axios.get(`${apiUrl}/searchUsersByBadges`, {
    params: { name: query },
  });
}

export async function getAvailableBadges() {
  return await axios.get(`${apiUrl}/getAvailableBadges`);
}

export async function getBadgeStats() {
  return await axios.get(`${apiUrl}/getBadgeStats`);
}

export async function createNewBadgeType(badgeData) {
  return await axios.post(`${apiUrl}/addBadgeType`, {
    name: badgeData.name,
    color: badgeData.color,
  });
}