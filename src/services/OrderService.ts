import { IConfirmPaymentData, ICreateOrderData, ICreateOrderResponse, ICreatePreferenceData } from '@/interfaces/Order';
import axios from 'axios';
import { store } from '@/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL;



const OrderService = {
    /**
     * Crear nueva orden con MercadoPago
     */
    createOrder: async (token: string, data: ICreateOrderData): Promise<ICreateOrderResponse> => {
        try {
            const response = await axios.post(`${API_URL}/order/checkout`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating order in service:', error);
            throw error;
        }
    },


    getPreferenceId: async (token: string, data: ICreatePreferenceData): Promise<{ preferenceId: string } | null> => {
        try {
            const response = await axios.post(`${API_URL}/order/checkout/preference`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Asegúrate de que retorne un objeto con preferenceId
            return {
                preferenceId: response.data.preferenceId 
            };
        } catch (error) {
            console.error('Error creating preference in service:', error);
            throw error;
        }
    },



    /**
     * Confirmar pago manualmente (para UX mejorada)
     */
    confirmPayment: async (token: string, data: IConfirmPaymentData) => {
        try {
            const response = await axios.post(`${API_URL}/order/checkout/payment/confirm`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error confirming payment:', error);
            throw error;
        }
    },

    /**
     * Obtener detalles de una orden específica
     */
    getOrderDetails: async (token: string, orderId: string) => {
        try {
            const response = await axios.get(`${API_URL}/order/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    },

    /**
     * Obtener todas las órdenes de un usuario
     */
    getUserOrders: async (token: string) => {
        try {
            const { userId } = store.getState().auth;
            if (!userId || !token) {
                throw new Error('Faltan credenciales del usuario');
            }

            const response = await axios.get(`${API_URL}/order/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Cancelar una orden
     */
    cancelOrder: async (token: string, orderId: string) => {
        try {
            const response = await axios.delete(`${API_URL}/order/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error canceling order:', error);
            throw error;
        }
    },

    /**
     * Verificar estado de pago desde MercadoPago
     */
    checkPaymentStatus: async (token: string, orderId: string) => {
        try {
            const response = await axios.get(`${API_URL}/order/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return {
                success: true,
                order: response.data.data,
                isPaid: response.data.data.paymentStatus === 'approved',
                isProcessing: response.data.data.status === 'processing'
            };
        } catch (error) {
            console.error('Error checking payment status:', error);
            throw error;
        }
    },

    /**
     * Polling para verificar estado del pago
     */
    pollPaymentStatus: async (
        token: string,
        orderId: string,
        maxAttempts: number = 30,
        interval: number = 2000
    ): Promise<any> => {
        return new Promise((resolve, reject) => {
            let attempts = 0;

            const checkStatus = async () => {
                try {
                    attempts++;
                    const result = await OrderService.checkPaymentStatus(token, orderId);

                    // Si el pago fue aprobado o rechazado, terminar polling
                    if (result.order.paymentStatus === 'approved' ||
                        result.order.paymentStatus === 'rejected' ||
                        result.order.paymentStatus === 'cancelled') {
                        resolve(result);
                        return;
                    }

                    // Si alcanzamos el máximo de intentos
                    if (attempts >= maxAttempts) {
                        resolve({
                            success: false,
                            message: 'Timeout esperando confirmación de pago',
                            order: result.order
                        });
                        return;
                    }

                    setTimeout(checkStatus, interval);

                } catch (error) {
                    reject(error);
                }
            };

            checkStatus();
        });
    }
};

export default OrderService;