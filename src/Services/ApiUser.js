import axios from "axios";

const apiUrl = "http://localhost:5000/users";

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export async function getAllUsers() {
  return axios.get(`${apiUrl}/getAllUsers`, authConfig());
}

export async function getUserById(id) {
  return axios.get(`${apiUrl}/getUser/${id}`, authConfig());
}

export async function addUser(userData) {
  return axios.post(
    `${apiUrl}/addUser`,
    {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      xp: userData.xp,
      isActive: userData.isActive,
      password: userData.password,
    },
    authConfig()
  );
}

export async function updateUser(id, userData) {
  return axios.put(
    `${apiUrl}/updateUser/${id}`,
    {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      xp: userData.xp,
      isActive: userData.isActive,
    },
    authConfig()
  );
}

export async function deleteUser(id) {
  return axios.delete(`${apiUrl}/deleteUser/${id}`, authConfig());
}
export const getMyProfile = (token) => {
  return axios.get(`${apiUrl}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const changePassword = (userId, oldPassword, newPassword) =>
    axios.put(
        `${apiUrl}/change-password/${userId}`,
        { oldPassword, newPassword },
        authConfig()
    );