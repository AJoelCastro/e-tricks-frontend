import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SubCategoryService = {
    getSubCategories: async () => {
        try {
            const response = await axios.get(`${API_URL}/subcategory/get`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            throw error;
        }
    },

    getSubCategoryById: async (id: string) => {
        try {
            const response = await axios.get(`${API_URL}/subcategory/${id}/get`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subcategory:', error);
            throw error;
        }
    },

    getCategoriesFromGroup: async (groupId: string) => {
        try {
            const response = await axios.get(`${API_URL}/subcategory/${groupId}/categories`);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories from group:', error);
            throw error;
        }
    },

    getProductsBySubCategory: async (subCategoryId: string) => {
        try {
            const response = await axios.get(`${API_URL}/subcategory/${subCategoryId}/products`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products by subcategory:', error);
            throw error;
        }
    },

    createSubCategory: async (token: string, data: any) => {
        try {
            const response = await axios.post(`${API_URL}/subcategory/create`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating subcategory:', error);
            throw error;
        }
    },

    updateSubCategory: async (token: string, id: string, data: any) => {
        try {
            const response = await axios.put(`${API_URL}/subcategory/${id}/update`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating subcategory:', error);
            throw error;
        }
    },

    toggleSubCategoryStatus: async (token: string, id: string) => {
        try {
            const response = await axios.patch(`${API_URL}/subcategory/${id}/toggle-status`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error toggling subcategory status:', error);
            throw error;
        }
    },

    deleteSubCategory: async (token: string, id: string) => {
        try {
            const response = await axios.delete(`${API_URL}/subcategory/${id}/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting subcategory:', error);
            throw error;
        }
    }
};

export default SubCategoryService;