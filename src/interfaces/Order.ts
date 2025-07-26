export interface ICreateOrderData {
    userId: string;
    addressId: string;
    couponCode?: string; 
}

export interface ICreateOrderResponse {
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

        }
    };
}

export interface IConfirmPaymentData {
    orderId: string;
    paymentId: string;
}

export interface IOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
}

export interface IOrder extends Document {
    userId: string;
    items: IOrderItem[];
    subtotalAmount: number;
    totalAmount: number;
    discountAmount: number;
    couponCode?: string;
    addressId?: string | null;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'payment_failed' | 'rejected' | 'refunded';
    paymentId: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
}