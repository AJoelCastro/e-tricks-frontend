// components/cart/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { CartContextType } from '@/types/CartContextType';
import { ICartItem } from '@/interfaces/CartItem';
import { IAddress } from '@/interfaces/Address';
import UserService from '@/services/UserService';
import ProductService from '@/services/ProductService';
import { useAuth } from '@clerk/nextjs';
import { IPickUp } from '@/interfaces/PickUp';
import PickUpService from '@/services/PickUpService';

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [carrito, setCarrito] = useState<ICartItem[]>([]);
  const [pickUps, setPickUps] = useState<IPickUp[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'address' | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'yape' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [etapa, setEtapa] = useState<number>(0);
  const { getToken } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [selectedPickup, setSelectedPickup] = useState<IPickUp | null>(null);
  
  // Estados para trackear qué datos ya se han cargado
  const [dataLoaded, setDataLoaded] = useState({
    cart: false,
    addresses: false,
    pickups: false
  });

  const pathname = usePathname();

  const getCartItems = useCallback(async () => {
    if (dataLoaded.cart) return; // Si ya se cargó, no volver a cargar
    
    setIsLoading(true);
    try {
      const token = await getToken();
      const rawCart = await UserService.getCartItems(token as string);
      const cartWithProducts = await Promise.all(
        rawCart.map(async (item: any) => {
          const product = await ProductService.GetProductById(item.productId);
          return { ...item, product };
        })
      );
      setCarrito(cartWithProducts);
      setDataLoaded(prev => ({ ...prev, cart: true }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, dataLoaded.cart]);

  const getPickUps = useCallback(async () => {
    if (dataLoaded.pickups) return; // Si ya se cargó, no volver a cargar
    
    try {
      const data = await PickUpService.getPickUps();
      setPickUps(data);
      setDataLoaded(prev => ({ ...prev, pickups: true }));
    } catch (error) {
      throw error;
    }
  }, [dataLoaded.pickups]);

  const getAddresses = useCallback(async () => {
    if (dataLoaded.addresses) return; // Si ya se cargó, no volver a cargar
    
    try {
      const token = await getToken();
      const data = await UserService.getAddresses(token as string);
      setAddresses(data);
      setDataLoaded(prev => ({ ...prev, addresses: true }));
    } catch (error) {
      throw error;
    }
  }, [getToken, dataLoaded.addresses]);

  // Función para forzar recarga de datos específicos
  const refreshCartItems = useCallback(async () => {
    setDataLoaded(prev => ({ ...prev, cart: false }));
    await getCartItems();
  }, [getCartItems]);

  const refreshAddresses = useCallback(async () => {
    setDataLoaded(prev => ({ ...prev, addresses: false }));
    await getAddresses();
  }, [getAddresses]);

  const refreshPickups = useCallback(async () => {
    setDataLoaded(prev => ({ ...prev, pickups: false }));
    await getPickUps();
  }, [getPickUps]);

  // Función para determinar qué datos cargar según la ruta
  const loadDataByRoute = useCallback(async () => {
    // Rutas que necesitan carrito
    const cartRoutes = ['/carrito', '/carrito/delivery', '/carrito/pagos'];
    
    // Rutas que necesitan direcciones
    const addressRoutes = ['/carrito/delivery', '/carrito/pagos', '/direcciones'];
    
    // Rutas que necesitan puntos de recojo
    const pickupRoutes = ['/carrito/delivery', '/carrito/pagos'];

    // Cargar carrito si es necesario
    if (cartRoutes.some(route => pathname?.startsWith(route))) {
      await getCartItems();
    }

    // Cargar direcciones si es necesario
    if (addressRoutes.some(route => pathname?.startsWith(route))) {
      await getAddresses();
    }

    // Cargar pickups si es necesario
    if (pickupRoutes.some(route => pathname?.startsWith(route))) {
      await getPickUps();
    }
  }, [pathname, getCartItems, getAddresses, getPickUps]);

  // Efecto que se ejecuta cuando cambia la ruta
  useEffect(() => {
    if (pathname) {
      loadDataByRoute();
    }
  }, [pathname, loadDataByRoute]);

  return (
    <CartContext.Provider
      value={{
        carrito,
        setCarrito,
        addresses,
        deliveryType,
        setDeliveryType,
        selectedCardId,
        setSelectedCardId,
        paymentMethod,
        setPaymentMethod,
        getCartItems,
        selectedAddress,
        setSelectedAddress,
        selectedPickup,
        setSelectedPickup,
        isLoading,
        setIsLoading,
        etapa,
        setEtapa,
        pickUps,
        // Nuevas funciones para refrescar datos específicos
        refreshCartItems,
        refreshAddresses,
        refreshPickups,
        // Estados de carga para cada tipo de dato
        dataLoaded,
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