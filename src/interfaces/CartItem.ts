import { IProduct } from "./Product";

export interface ICartItem {
    productId: string;
    product: IProduct,
    quantity: number;
    processed: boolean;
    size: string;
}