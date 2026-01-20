import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MaterialService ={

    getAllMaterials: async()=>{
        try {
            const response = await axios.get(`${API_URL}/material/getAll`);
            return response.data;
        } catch (error) {
            throw error
        }
    },

}

export default MaterialService;