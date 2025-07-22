

export interface IOrder extends Document {
    userId: string;
    totalAmount: number;
    addressId: string;
    status: string;
    paymentId: string;
    paymentStatus: boolean;
    paymentMethod: string;
    createdAt?: Date;
    updatedAt?: Date;
}