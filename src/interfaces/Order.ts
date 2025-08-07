export interface ICreateOrderData {
    userId: string;
    addressId: string;
    couponCode?: string;
}

export interface ICreatePreferenceResponse {
    success: boolean; 
    data: {
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

// INTERFACES ACTUALIZADAS SEGÚN TU JSON:

export interface IProductDetails {
    _id: string;
    name: string;
    description: string;
    price: number;
    stockPorTalla: Array<{
        talla: number;
        stock: number;
    }>;
    material: string;
    category: string;
    subCategory: string;
    groupCategory: string;
    images: string[];
    descuento: number;
    caracteristicas: Array<{
        nombre: string;
        valor: string;
    }>;
    brand: string;
    resenias: any[];
    isNewProduct: boolean;
    isTrending: boolean;
    season: string;
    createdAt: string;
    __v: number;
}

export interface IOrderItem {
    _id: string;
    productId: IProductDetails; // Cambiado: ahora es el objeto completo del producto
    name: string;
    price: number;
    quantity: number;
    size: number;
    image: string;
    itemStatus: string;
}

// Nueva interface para detalles de pago
export interface IPaymentDetails {
    status_detail: string;
    transaction_amount: number;
    currency_id: string;
    payment_method_id: string;
    payment_type_id: string;
    processed_at: string;
}

// Nueva interface para metadata
export interface IOrderMetadata {
    stockReserved: boolean;
    reservedAt: string;
    stockConfirmed: boolean;
    confirmedAt: string;
    paymentConfirmed: boolean;
}

export interface IOrder {
    _id: string;
    userId: string;
    orderNumber: string;
    items: IOrderItem[];
    totalAmount: number; 
    discountAmount?: number; 
    couponCode?: string;
    addressId: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'payment_failed';
    orderType: 'standard' | 'pickup';
    paymentId?: string;
    paymentStatus: 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded';
    paymentMethod: string;
    deliveryStatus: 'pending' | 'shipped' | 'delivered' | 'returned';
    preferenceId?: string;
    preferenceCreatedAt?: Date;
    confirmedAt?: Date;
    failedAt?: string;
    createdAt: string;
    updatedAt: string;
    
    // Campos opcionales según el esquema:
    paymentDetails?: IPaymentDetails;
    metadata?: IOrderMetadata;
}

// Interface para actualizaciones de orden
export interface IUpdateOrderData {
    status?: IOrder['status'];
    paymentStatus?: IOrder['paymentStatus'];
    deliveryStatus?: IOrder['deliveryStatus'];
    paymentMethod?: string;
}

// Interface para actualizaciones de items
export interface IUpdateOrderItemData {
    itemStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested' | 'returned' | 'refunded';
}

export interface ICreatePreferenceData {
    userId: string;
    addressId: string;
    couponCode?: string; 
    orderType: string;
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