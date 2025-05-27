import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AuthService = {
    HealthCheck : async () => {
        try {
            const response = await axios.get(`${API_URL}/health`);
            return response.data;
        }catch (error) {
            console.error(error);
            throw error;
        }

    }
}
export default AuthService;