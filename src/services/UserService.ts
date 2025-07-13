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
        try {
            const response = await axios.get(`${API_URL}/user/getFavorites/${localStorage.getItem('idClerk')}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    getFavoriteIds: async ()=>{
        try {
            const response = await axios.get(`${API_URL}/user/getFavoriteIds/${localStorage.getItem('idClerk')}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    addFavorite: async (idProduct: string)=>{
        try {
            const response = await axios.post(`${API_URL}/user/addFavorite/${localStorage.getItem('idClerk')}`,{
                idProduct
            },{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    }

}
export default UserService;