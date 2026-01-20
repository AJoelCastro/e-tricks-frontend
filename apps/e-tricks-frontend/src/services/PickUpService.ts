import axios from 'axios';
import { IPickUp, IPickUpUpdate } from '@/interfaces/PickUp';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PickUpService = {
    getPickUps: async () => {
        try {
            const response = await axios.get(`${API_URL}/pickup/get`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getPickUpById: async (id: string) => {
        try {
            const response = await axios.get(`${API_URL}/pickup/${id}/get`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createPickUp: async (token: string, pickUpData: Omit<IPickUp, '_id'>) => {
        try {
            const response = await axios.post(`${API_URL}/pickup/create`, pickUpData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deletePickUp: async (token: string, id: string) => {
        try {
            const response = await axios.delete(`${API_URL}/pickup/${id}/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updatePickUp: async (token: string, id: string, pickUpData: IPickUpUpdate) => {
        try {
            const response = await axios.put(`${API_URL}/pickup/${id}/update`, pickUpData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}
export default PickUpService