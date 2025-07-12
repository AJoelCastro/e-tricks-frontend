import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UserService = {
    getFavoritesCartList: async(data)=>{
        try {
            const response = await axios.get(`${API_URL}/user/getFCL`,{
                headers: {
                    'Authorization': `Bearer ${data}`
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    }

}
export default UserService;