export interface ICreateOrderData {
    userId: string;
    addressId: string ;
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
    image:string;
}

export interface IOrder extends Document {
    _id: string;
    userId: string;
    orderNumber:string;
    items: IOrderItem[];
    subtotalAmount: number;
    totalAmount: number;
    discountAmount: number;
    couponCode?: string;
    addressId: string;
    status: string;
    orderType:string;
    paymentId: string;
    paymentStatus: string;
    paymentMethod: string;
    deliveryStatus?:string;
    createdAt: Date;
    updatedAt: Date;
}


export interface ICreatePreferenceData {
    userId: string;
    couponCode?: string; 
    total:number;
    subtotal:number;
}
