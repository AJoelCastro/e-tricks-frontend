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
            throw error;
        }
    },

    UpdateProduct : async (token: string, id: string, productData: Partial<IProduct>) => {
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        if (!id) {
            throw new Error('ID del producto es requerido');
        }

        try {
            const response = await axios.put(`${API_URL}/product/${id}/update`, productData, {
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
    GetProductsByIdGroupAndIdSubCategory : async (idGroup : string,idSubCategory : string) => {
        try {
            const response = await axios.get(`${API_URL}/product/${idGroup}/${idSubCategory}/products`);
            return response.data;
        }catch (error) {
            throw error;
        }
    },
    GetProductsByIdGroupAndIdSubCategoryAndIdCategory : async (idGroup : string,idSubCategory : string, idCategory : string) => {
        try {
            const response = await axios.get(`${API_URL}/product/${idGroup}/${idSubCategory}/${idCategory}/products`);
            return response.data;
        }catch (error) {
            throw error;
        }
    },
    GetProductsByIdMarca : async (idMarca : string) => {
        try {
            const response = await axios.get(`${API_URL}/product/${idMarca}/productsBrands`);
            return response.data;
        }catch (error) {
            throw error;
        }
    },
    GetProductsByIdMarcaAndIdCategory : async (idMarca : string, idCategory : string) => {
        try {
            const response = await axios.get(`${API_URL}/product/${idMarca}/${idCategory}/productsBrands`);
            return response.data;
        }catch (error) {
            throw error;
        }
    },

    GetNewProducts : async () => {
        try {
            const response = await axios.get(`${API_URL}/product/getNewProducts`);
            return response.data;
        }catch (error) {
            console.error(error);
            throw error;
        }
    },
}
export default ProductService;