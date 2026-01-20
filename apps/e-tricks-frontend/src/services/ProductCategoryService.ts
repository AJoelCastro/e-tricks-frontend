import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProductCategoryService = {
    getCategories: async () => {
        try {
            const response = await axios.get(`${API_URL}/product-category/get`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getCategoryById: async (id: string) => {
        try {
            const response = await axios.get(`${API_URL}/product-category/${id}/get`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllCategoryWithDescuentos: async () => {
        try {
            const response = await axios.get(`${API_URL}/product-category/getAllWithDescuento`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createCategory: async (token: string, data: { name: string }) => {
        try {
            const response = await axios.post(`${API_URL}/product-category/create`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateCategory: async (token: string, id: string, data: { name: string }) => {
        try {
            const response = await axios.put(`${API_URL}/product-category/${id}/update`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteCategory: async (token: string, id: string) => {
        try {
            const response = await axios.delete(`${API_URL}/product-category/${id}/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};

export default ProductCategoryService;