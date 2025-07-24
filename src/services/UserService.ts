import { store } from '@/store';
import axios from 'axios';
import { IAddress } from '@/interfaces/Address';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UserService = {
    verifyUser: async(token: string, userId: string )=>{
        try {
            const response = await axios.get(`${API_URL}/user/verifyUser/${userId}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            console.error('Error in verifyUser:', error);
            throw error
        }
    },

    getFavorites: async (token: string)=>{
        const { userId} = store.getState().auth;
        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }
        try {
            const response = await axios.get(`${API_URL}/user/getFavorites/${userId}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            console.error('Error in getFavorites:', error);
            throw error
        }
    },

    getCartItems: async (token: string)=>{
        const { userId} = store.getState().auth;
        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }
        try {
            const response = await axios.get(`${API_URL}/user/getCartItems/${userId}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            console.error('Error in getCartItems:', error);
            throw error
        }
    },

    getFavoriteIds: async (token: string)=>{
        const { userId} = store.getState().auth;
        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }
        try {
            const response = await axios.get(`${API_URL}/user/getFavoriteIds/${userId}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            console.error('Error in getFavoriteIds:', error);
            throw error
        }
    },

    addFavorite: async (token: string,idProduct: string)=>{
        const { userId} = store.getState().auth;

        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }
        try {
            const response = await axios.post(`${API_URL}/user/addFavorite/${userId}`,{
                idProduct
            },{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            console.error('Error in addFavorite:', error);
            throw error
        }
    },

    removeFavorite: async (token: string,idProduct: string) => {
        const { userId} = store.getState().auth;

        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }

        try {
            const response = await axios.delete(`${API_URL}/user/removeFavorite/${userId}`, {
                data: { idProduct },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in removeFavorite:', error);
            throw error;
        }
    },

    // Función corregida para agregar al carrito
    addCartItem: async (token: string, idProduct: string, quantity: number, size: string)=>{
        const { userId} = store.getState().auth;

        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }

        if (!idProduct || !quantity || !size) {
            throw new Error('Faltan datos del producto');
        }

        try {
            console.log('Adding to cart:', { userId, idProduct, quantity, size });
            
            const response = await axios.post(`${API_URL}/user/addCartItem/${userId}`,{
                idProduct, 
                quantity, 
                size
            },{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            console.log('Cart item added successfully:', response.data);
            return response.data
        } catch (error) {
            console.error('Error in addCartItem:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
            }
            throw error
        }
    },

    removeCartItem: async (token: string,idCartItem: string) => {
        const { userId} = store.getState().auth;

        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }

        try {
            const response = await axios.delete(`${API_URL}/user/removeCartItem/${userId}`, {
                data: { idCartItem },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in removeCartItem:', error);
            throw error;
        }
    },

    getAddresses: async (token: string) => {
        const { userId } = store.getState().auth;

        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }

        try {
            const response = await axios.get(`${API_URL}/user/addresses/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in getAddresses:', error);
            throw error;
        }
    },

    addAddress: async (token: string,address: IAddress) => {
        const { userId } = store.getState().auth;

        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }

        try {
            const response = await axios.post(`${API_URL}/user/addresses/${userId}`, {
                address
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in addAddress:', error);
            throw error;
        }
    },

    updateAddress: async (token: string,addressId: string, address: Partial<IAddress>) => {
        const { userId } = store.getState().auth;

        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }

        try {
            const response = await axios.put(`${API_URL}/user/addresses/${userId}/${addressId}`, address, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in updateAddress:', error);
            throw error;
        }
    },

    deleteAddress: async (token: string,addressId: string) => {
        const { userId } = store.getState().auth;

        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }

        try {
            const response = await axios.delete(`${API_URL}/user/addresses/${userId}/${addressId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in deleteAddress:', error);
            throw error;
        }
    },
};

export default UserService;