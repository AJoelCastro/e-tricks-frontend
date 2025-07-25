import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreateOrderData {
    userId: string;
    addressId: string;
    couponCode?: string; 
}

export interface CreateOrderResponse {
    success: boolean;
    data: {
        init_point: string;
        sandbox_init_point: string;
        order: {
            _id: string;
            userId: string;
            items: Array<{
                productId: string;
                name: string;
                price: number;
                quantity: number;
                size: string;
            }>;
            subtotalAmount: number;
            totalAmount: number;
            discountAmount?: number;
            couponCode?: string;
            addressId: string;
            paymentMethod: string;
            status: string;
            paymentStatus: string;
            paymentId?: string;
            mercadoPagoPreferenceId?: string;
        }
    };
}

export interface ConfirmPaymentData {
    orderId: string;
    paymentId: string;
}

const OrderService = {
    /**
     * Crear nueva orden con MercadoPago
     */
    createOrder: async (token: string, data: CreateOrderData): Promise<CreateOrderResponse> => {
        try {
            const response = await axios.post(`${API_URL}/orders/checkout`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    /**
     * Confirmar pago manualmente (para UX mejorada)
     */
    confirmPayment: async (token: string, data: ConfirmPaymentData) => {
        try {
            const response = await axios.post(`${API_URL}/orders/checkout/payment/confirm`, 
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
            const response = await axios.get(`${API_URL}/orders/${orderId}`, {
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
    getUserOrders: async (token: string, userId: string) => {
        try {
            const response = await axios.get(`${API_URL}/orders/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    },

    /**
     * Cancelar una orden
     */
    cancelOrder: async (token: string, orderId: string) => {
        try {
            const response = await axios.delete(`${API_URL}/orders/${orderId}`, {
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
            const response = await axios.get(`${API_URL}/orders/${orderId}`, {
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