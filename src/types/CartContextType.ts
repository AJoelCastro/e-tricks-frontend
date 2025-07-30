// types/CartContextType.ts
import { ICartItem } from "@/interfaces/CartItem";
import { IAddress } from "@/interfaces/Address";
import { IPickUp } from "@/interfaces/PickUp";

export interface CartContextType {
  carrito: ICartItem[];
  setCarrito: React.Dispatch<React.SetStateAction<ICartItem[]>>;
  addresses: IAddress[];
  deliveryType: 'pickup' | 'address' | null;
  setDeliveryType: React.Dispatch<React.SetStateAction<'pickup' | 'address' | null>>;
  selectedCardId: string | null;
  setSelectedCardId: React.Dispatch<React.SetStateAction<string | null>>;
  paymentMethod: 'card' | 'yape' | null;
  setPaymentMethod: React.Dispatch<React.SetStateAction<'card' | 'yape' | null>>;
  getCartItems: () => Promise<void>;
  selectedAddress:IAddress | null;
  setSelectedAddress:React.Dispatch<React.SetStateAction<IAddress | null>>;
  selectedPickup:IPickUp | null;
  setSelectedPickup:React.Dispatch<React.SetStateAction<IPickUp | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  etapa: number;
  setEtapa: React.Dispatch<React.SetStateAction<number>>;
  pickUps: IPickUp[];
}
