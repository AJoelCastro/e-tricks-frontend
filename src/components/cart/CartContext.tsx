// components/cart/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartContextType } from '@/types/CartContextType';
import { ICartItem } from '@/interfaces/CartItem';
import { IAddress } from '@/interfaces/Address';
import UserService from '@/services/UserService';
import ProductService from '@/services/ProductService';
import { useAuth } from '@clerk/nextjs';

export const CartContext = createContext<CartContextType | null>(null); // ✅ con tipo

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [carrito, setCarrito] = useState<ICartItem[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'address' | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'yape' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { getToken } = useAuth();

  const getCartItems = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const rawCart = await UserService.getCartItems(token as string);
      const cartWithProducts = await Promise.all(
        rawCart.map(async item => {
          const product = await ProductService.GetProductById(item.productId);
          return { ...item, product };
        })
      );
      setCarrito(cartWithProducts);
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false); // ⬅️ termina la carga
    }
  };

  const getAddresses = async () => {
    try {
      const token = await getToken();
      const data = await UserService.getAddresses(token as string);
      setAddresses(data);
    } catch (error) {
      throw error
    }
  };

  useEffect(() => {
    getCartItems();
    getAddresses();
  }, []);

  return (
    <CartContext.Provider
      value={{
        carrito,
        setCarrito,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        deliveryType,
        setDeliveryType,
        selectedCardId,
        setSelectedCardId,
        paymentMethod,
        setPaymentMethod,
        getCartItems,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};
