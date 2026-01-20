export interface ICoupon extends Document {
    code: string;
    discountPercentage: number;
    validUntil: Date;
    used: boolean;
    usedBy?:  string; 
    usedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}