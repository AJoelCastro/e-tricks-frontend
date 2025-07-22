import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BrandService = {
    getBrands: async () => {
        try {
            const response = await axios.get(`${API_URL}/brand/get`);
            return response.data;
        } catch (error) {
            console.error('Error fetching brands:', error);
            throw error;
        }
    },

    getBrandById: async (id: string) => {
        try {
            const response = await axios.get(`${API_URL}/brand/${id}/get`);
            return response.data;
        } catch (error) {
            console.error('Error fetching brand:', error);
            throw error;
        }
    },

    createBrand: async (data: { name: string }) => {
        try {
            const response = await axios.post(`${API_URL}/brand/create`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating brand:', error);
            throw error;
        }
    },

    updateBrand: async (token: string, id: string, data: { name: string }) => {
        try {
            const response = await axios.put(`${API_URL}/brand/${id}/update`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating brand:', error);
            throw error;
        }
    },

    deleteBrand: async (token: string, id: string) => {
        try {
            const response = await axios.delete(`${API_URL}/brand/${id}/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting brand:', error);
            throw error;
        }
    }
};

export default BrandService;