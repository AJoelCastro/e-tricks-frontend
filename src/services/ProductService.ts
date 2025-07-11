import axios from 'axios';

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
    GetProduct : async (id : number) => {
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
    }
}
export default ProductService;