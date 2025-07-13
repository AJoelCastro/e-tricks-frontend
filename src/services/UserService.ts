import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UserService = {
    verifyUser: async(token: string, idClerk: string )=>{
        try {
            const response = await axios.get(`${API_URL}/user/verifyUser/${idClerk}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    getFavorites: async ()=>{
        const idClerk = localStorage.getItem('idClerk');
        const token = localStorage.getItem('auth_token');
        if (!idClerk || !token) {
            throw new Error('Faltan credenciales del usuario');
        }
        try {
            const response = await axios.get(`${API_URL}/user/getFavorites/${idClerk}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    getFavoriteIds: async ()=>{
        const idClerk = localStorage.getItem('idClerk');
        const token = localStorage.getItem('auth_token');
        if (!idClerk || !token) {
            throw new Error('Faltan credenciales del usuario');
        }
        try {
            const response = await axios.get(`${API_URL}/user/getFavoriteIds/${idClerk}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    addFavorite: async (idProduct: string)=>{
        const idClerk = localStorage.getItem('idClerk');
        const token = localStorage.getItem('auth_token');

        if (!idClerk || !token) {
            throw new Error('Faltan credenciales del usuario');
        }
        try {
            const response = await axios.post(`${API_URL}/user/addFavorite/${idClerk}`,{
                idProduct
            },{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    removeFavorite: async (idProduct: string) => {
        const idClerk = localStorage.getItem('idClerk');
        const token = localStorage.getItem('auth_token');

        if (!idClerk || !token) {
            throw new Error('Faltan credenciales del usuario');
        }

        try {
            const response = await axios.delete(`${API_URL}/user/removeFavorite/${idClerk}`, {
                data: { idProduct },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }


}
export default UserService;