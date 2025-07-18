import axios from 'axios';
import { IProduct } from '@/interfaces/Product';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ProductService = {

    GetProducts : async () => {
        try {
            const response = await axios.get(`${API_URL}/product/get`, {});
            return response.data;
        }catch (error) {
            console.error(error);
            throw error;
        }
    },
    GetProductById : async (id : string) => {
        try {
            const response = await axios.get(`${API_URL}/product/${id}/get`);
            return response.data;
        }catch (error) {
            console.error(error);
            throw error;
        }
    },
    GetProductsByCategory : async (category : string) => {
        try {
            const response = await axios.get(`${API_URL}/product/category/${category}`);
            return response.data;
        }catch (error) {
            console.error(error);
            throw error;
        }
    },
    CreateProduct : async (token: string,productData: Omit<IProduct, '_id'>) => {

        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        try {
            const response = await axios.post(`${API_URL}/product/create`, productData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
export default ProductService;