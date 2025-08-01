import { IConfirmPaymentData, ICreateOrderData, ICreateOrderResponse, ICreatePreferenceData, ICreatePreferenceResponse } from '@/interfaces/Order';
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


    getPreferenceId: async (token: string, data: ICreatePreferenceData): Promise<ICreatePreferenceResponse> => {
        try {
            const response = await axios.post(`${API_URL}/order/checkout/preference`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("service", response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating preference in service:', error);
            if (error.response) {
                console.error('📋 Full Error Details:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data, // This is the key - shows server error message
                    headers: error.response.headers,
                    url: error.config?.url,
                    method: error.config?.method,
                    requestData: error.config?.data ? JSON.parse(error.config.data) : null
                });

                // Log the specific error message from your backend
                if (error.response.data?.message) {
                    console.error('🚨 Backend Error Message:', error.response.data.message);
                }

                if (error.response.data?.error) {
                    console.error('🚨 Backend Error Details:', error.response.data.error);
                }
            } else if (error.request) {
                console.error('📡 Network Error - No response received:', error.request);
            } else {
                console.error('⚙️ Request Setup Error:', error.message);
            }
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
     * Solicitar reembolso de un item específico
     */
    requestItemRefund: async (token: string, orderId: string, itemId: string, reason?: string) => {
        try {
            const response = await axios.post(
                `${API_URL}/order/refund/${orderId}/${itemId}`,
                { reason },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error requesting refund:', error);

            // Manejo específico de errores
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    /**
     * Obtener items elegibles para reembolso
     */
    getRefundableItems: async (token: string, orderId: string) => {
        try {
            const response = await axios.get(
                `${API_URL}/order/refundable/${orderId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching refundable items:', error);
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