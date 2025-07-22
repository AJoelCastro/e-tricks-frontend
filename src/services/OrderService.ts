import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

const OrderService = {

    createOrder: async (token: string, data: { userId: string; addressId: string }) => {
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

  
    confirmPayment: async (token: string, orderId: string) => {
        try {
            const response = await axios.post(`${API_URL}/orders/checkout/payment/confirm`, 
                { orderId }, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error confirming payment:', error);
            throw error;
        }
    },


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


    handleWebhook: async (payload: any) => {
        try {
            const response = await axios.post(`${API_URL}/orders/webhook`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error processing webhook:', error);
            throw error;
        }
    }
};

export default OrderService;