import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AWSService={
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
        console.log(folderName, 'folder')
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
    
}

export default AWSService;