import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const FavoriteService = {
    GetFavorites : async (id: string, token: string) => {
        try {
            const response = await axios.get(`${API_URL}/favorite/${id}/get`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        }catch (error) {
            console.error(error);
            throw error;
        }
    },
    CreateListFavorite : async (id: string, token: string) => {
        try {
            const response = await axios.post(`${API_URL}/favorite/${id}/create`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        }catch (error) {
            console.error(error);
            throw error;
        }
    }
}
export default FavoriteService;