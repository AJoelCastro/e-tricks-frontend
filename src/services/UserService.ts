import { store } from '@/store';
import axios from 'axios';
import { IAddress } from '@/interfaces/Address';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UserService = {
    verifyUser: async(token: string, idClerk: string )=>{
        try {
            const response = await axios.get(`${API_URL}/user/verifyUser/${idClerk}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    getFavorites: async ()=>{
        const { userId, token} = store.getState().auth;
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
            throw error
        }
    },
    getCartItems: async ()=>{
        const { userId, token} = store.getState().auth;
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
            throw error
        }
    },
    getFavoriteIds: async ()=>{
        const { userId, token} = store.getState().auth;
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
            throw error
        }
    },

    addFavorite: async (idProduct: string)=>{
        const { userId, token} = store.getState().auth;

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
            throw error
        }
    },

    removeFavorite: async (idProduct: string) => {
        const { userId, token} = store.getState().auth;

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
            throw error;
        }
    },
    addCartItem: async (idProduct: string, quantity: number, size: string)=>{
        const { userId, token} = store.getState().auth;

        if (!userId || !token) {
            throw new Error('Faltan credenciales del usuario');
        }
        try {
            const response = await axios.post(`${API_URL}/user/addCartItem/${userId}`,{
                idProduct, quantity, size
            },{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },
    removeCartItem: async (idCartItem: string) => {
        const { userId, token} = store.getState().auth;

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
            throw error;
        }
    },
    getAddresses: async () => {
        const { userId, token } = store.getState().auth;

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
            throw error;
        }
    },

    addAddress: async (address: IAddress) => {
        const { userId, token } = store.getState().auth;

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
            throw error;
        }
    },

    updateAddress: async (addressId: string, address: Partial<IAddress>) => {
        const { userId, token } = store.getState().auth;

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
            throw error;
        }
    },

    deleteAddress: async (addressId: string) => {
        const { userId, token } = store.getState().auth;

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
            throw error;
        }
    },

    // setDefaultAddress: async (addressId: string) => {
    //     const { userId, token } = store.getState().auth;

    //     if (!userId || !token) {
    //         throw new Error('Faltan credenciales del usuario');
    //     }

    //     try {
    //         const response = await axios.put(`${API_URL}/user/addresses/${userId}/${addressId}/default`, {}, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
};

export default UserService;