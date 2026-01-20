import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AWSService={
    createFolder: async (token: string, folderName: string, files: File[]) => {
        try {
            const formData = new FormData();
            formData.append("folderName", folderName);
            files.forEach((file) => {
                formData.append("images", file); // `images` debe coincidir con el nombre en tu `uploadMiddleware`
            });
            const response = await axios.post(`${API_URL}/product/folders/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getFolderNames: async(token: string)=>{
        try {
            const response = await axios.get(`${API_URL}/product/folders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteFolder: async (token: string, folderName: string) => {
        try {
            const response = await axios.delete(`${API_URL}/product/folders/${folderName}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },
    getFolderDetails: async (token: string, folderName: string) => {
        try {
            const response = await axios.get(`${API_URL}/product/folders/${folderName}/images`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    renameFolder: async (token: string, oldName: string, newName: string) => {
        try {
            const response = await axios.put(`${API_URL}/product/folders/${oldName}`, { newName }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteProductImage: async (token: string, folderName: string, fileName: string) => {
        try {
            const response = await axios.delete(`${API_URL}/product/folders/${folderName}/images/${fileName}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}

export default AWSService;