import { IProduct } from "./Product";

export interface ICartItem {
    _id:string
    productId: string;
    product: IProduct,
    quantity: number;
    processed: boolean;
    size: string;
}