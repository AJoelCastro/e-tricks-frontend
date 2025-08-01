export interface ICreateOrderData {
    userId: string;
    addressId: string ;
    couponCode?: string;
     
}

export interface ICreatePreferenceResponse {
    success: boolean; 
    data: {
        orderId: string;
        preferenceId: string;
        init_point: string;
        sandbox_init_point: string;
    };
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
                size: number;
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
    _id:string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: number;
    image:string;
    itemStatus: string;
}

export interface IOrder extends Document {
    _id: string;
    userId: string;
    orderNumber: string;
    items: IOrderItem[];
    subtotalAmount: number; 
    totalAmount: number;
    discountAmount?: number; 
    couponCode?: string;
    addressId: string;
    status: string;
    orderType: string;
    paymentId?: string; 
    paymentStatus: string;
    paymentMethod: string;
    deliveryStatus?: string;
    preferenceId?: string; 
    preferenceCreatedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreatePreferenceData {
    userId: string;
    addressId: string ;
    couponCode?: string; 
    orderType:string;
}

export interface IRequestRefundData {
    reason?: string;
}

export interface IRefundResponse {
    success: boolean;
    message: string;
    data: {
        orderId: string;
        itemId: string;
        itemStatus: string;
        reason: string | null;
        requestedAt: Date;
    };
}

export interface IRefundableItemsResponse {
    success: boolean;
    data: IOrder;
    refundableCount: number;
}

