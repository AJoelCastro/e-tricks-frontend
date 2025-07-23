// types/CartContextType.ts
import { ICartItem } from "@/interfaces/CartItem";
import { IAddress } from "@/interfaces/Address";
import { IPickUp } from "@/interfaces/PickUp";

export interface CartContextType {
  carrito: ICartItem[];
  setCarrito: React.Dispatch<React.SetStateAction<ICartItem[]>>;
  addresses: IAddress[];
  selectedAddressId: string | null;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string | null>>;
  deliveryType: 'pickup' | 'address' | null;
  setDeliveryType: React.Dispatch<React.SetStateAction<'pickup' | 'address' | null>>;
  selectedCardId: string | null;
  setSelectedCardId: React.Dispatch<React.SetStateAction<string | null>>;
  paymentMethod: 'card' | 'yape' | null;
  setPaymentMethod: React.Dispatch<React.SetStateAction<'card' | 'yape' | null>>;
  getCartItems: () => Promise<void>;
  isLoading: boolean;
  etapa: number;
  setEtapa: React.Dispatch<React.SetStateAction<number>>;
  pickUps: IPickUp[];
}
