import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BannerPrincipalService = {
    getAllBanners : async () => {
        try {
            const response = await axios.get(`${API_URL}/bannerPrincipal/get`);
            return response.data;
        }catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default BannerPrincipalService