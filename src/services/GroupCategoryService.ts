import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const GroupCategoryService = {
    getGroupCategories: async (activeOnly: boolean = true) => {
        try {
            const response = await axios.get(`${API_URL}/groupcategory/get`, {
                params: { activeOnly }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching group categories:', error);
            throw error;
        }
    },

    getGroupCategoryById: async (id: string) => {
        try {
            const response = await axios.get(`${API_URL}/groupcategory/${id}/get`);
            return response.data;
        } catch (error) {
            console.error('Error fetching group category:', error);
            throw error;
        }
    },

    getSubCategoriesFromGroup: async (groupId: string) => {
        try {
            const response = await axios.get(`${API_URL}/groupcategory/${groupId}/subcategories`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subcategories from group:', error);
            throw error;
        }
    },

    createGroupCategory: async (token: string, data: {
        name: string;
        description?: string;
        subcategories?: string[];
        active?: boolean;
        brands: string[];
    }) => {
        try {
            const response = await axios.post(`${API_URL}/groupcategory/create`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating group category:', error);
            throw error;
        }
    },

    updateGroupCategory: async (token: string, id: string, data: any) => {
        try {
            const response = await axios.put(`${API_URL}/groupcategory/${id}/update`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating group category:', error);
            throw error;
        }
    },

    toggleGroupCategoryStatus: async (token: string, id: string) => {
        try {
            const response = await axios.patch(`${API_URL}/groupcategory/${id}/toggle-status`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error toggling group category status:', error);
            throw error;
        }
    },

    deleteGroupCategory: async (token: string, id: string) => {
        try {
            const response = await axios.delete(`${API_URL}/groupcategory/${id}/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting group category:', error);
            throw error;
        }
    }
};

export default GroupCategoryService;