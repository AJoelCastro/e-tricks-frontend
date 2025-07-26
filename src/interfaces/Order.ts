

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