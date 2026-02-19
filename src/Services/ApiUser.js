import axios from "axios";

const apiUrl = 'http://localhost:5000'

export async function getAllUsers() {
    return await axios.get('${apiUrl}/getAllUsers')
    
}
export async function deleteUser(id) {
    return await axios.delete('${apiUrl}/deleteUser/${id}')
    
}
export async function addUser() {
    return await axios.post('${apiUrl}/addUser',)
    
}
export async function updateUser(id) {
    return await axios.put('${apiUrl}/updateUser/${id}',)
    
}