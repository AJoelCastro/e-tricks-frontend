import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@clerk/nextjs";
import UserService from '@/services/UserService';
import { IProduct } from '@/interfaces/Product';
import { useNotification } from '@/hooks/useNotification'; // Ajusta la ruta según tu estructura

interface ProductLogicState {
  favoriteIds: string[];
  cartItems: any[];
  loading: boolean;
  cartNotificationOpen: boolean;
  lastAddedProduct: {
    product: IProduct;
    size: string;
    quantity: number;
  } | null;
  // El estado de notificaciones ahora viene del hook useNotification
  notification: {
    open: boolean;
    message: string;
    type: 'error' | 'warning' | 'success' | 'info';
  };
}

interface ProductLogicActions {
  // Notificaciones - ahora usando useNotification
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
  closeNotification: () => void;
  
  // Favoritos
  handleAddFavorite: (id: string) => Promise<void>;
  handleRemoveFavorite: (id: string) => Promise<void>;
  
  // Carrito
  handleAddToCart: (productId: string, size: string, quantity: number, product?: IProduct) => Promise<void>;
  handleRemoveFromCart: (productId: string) => Promise<void>;
  isProductInCart: (productId: string) => boolean;
  
  // Cart notification
  closeCartNotification: () => void;
  
  // Data refresh
  refreshData: () => Promise<void>;
}

export const useProductLogic = (): ProductLogicState & ProductLogicActions => {
  const { isSignedIn, getToken } = useAuth();
  const { 
    notification, 
    showError, 
    showWarning, 
    showSuccess, 
    showInfo, 
    closeNotification 
  } = useNotification();
  
  // Estados
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartNotificationOpen, setCartNotificationOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<{
    product: IProduct;
    size: string;
    quantity: number;
  } | null>(null);

  // Cargar favoritos
  const getFavorites = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      if (!token) return;
      
      const data = await UserService.getFavoriteIds(token);
      setFavoriteIds(data || []);
    } catch (error) {
      console.error('Error getting favorites:', error);
    }
  }, [isSignedIn, getToken]);

  // Cargar items del carrito
  const getCartItems = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      if (!token) return;
      
      const data = await UserService.getCartItems(token);
      setCartItems(data || []);
    } catch (error) {
      console.error('Error getting cart items:', error);
      setCartItems([]); 
    }
  }, [isSignedIn, getToken]);

  // Cargar datos iniciales
  const refreshData = useCallback(async () => {
    if (isSignedIn) {
      await Promise.all([getFavorites(), getCartItems()]);
    }
  }, [isSignedIn, getFavorites, getCartItems]);

  // Efecto para cargar datos cuando cambia el estado de autenticación
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Manejar agregar favorito
  const handleAddFavorite = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) throw new Error('No token available');
      
      await UserService.addFavorite(token, id);
      console.log("Favorite added:", id);
      
      // Actualizar estado local
      setFavoriteIds(prev => [...prev, id]);
      showSuccess('Producto agregado a favoritos');
    } catch (error) {
      console.error('Error adding favorite:', error);
      showError('Error al agregar a favoritos');
    } finally {
      setLoading(false);
    }
  }, [getToken, showSuccess, showError]);

  // Manejar remover favorito
  const handleRemoveFavorite = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) throw new Error('No token available');
      
      await UserService.removeFavorite(token, id);
      console.log("Favorite removed:", id);
      
      // Actualizar estado local
      setFavoriteIds(prev => prev.filter(favId => favId !== id));
      showSuccess('Producto removido de favoritos');
    } catch (error) {
      console.error('Error removing favorite:', error);
      showError('Error al remover de favoritos');
    } finally {
      setLoading(false);
    }
  }, [getToken, showSuccess, showError]);

  // Manejar agregar al carrito
  const handleAddToCart = useCallback(async (
    productId: string, 
    size: string, 
    quantity: number, 
    product?: IProduct
  ) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) throw new Error('No token available');

      await UserService.addCartItem(token, productId, quantity, size);
      
      // Recargar items del carrito
      await getCartItems();
      
      // SIEMPRE mostrar el modal del carrito cuando se agrega un producto
      // Si no se proporciona el producto, podríamos buscarlo o usar un valor por defecto
      if (product) {
        setLastAddedProduct({
          product,
          size,
          quantity
        });
        setCartNotificationOpen(true);
        console.log('Cart notification should be open:', true);
        console.log('Last added product:', { product, size, quantity });
      } else {
        console.warn('No product provided to handleAddToCart - modal will not show');
      }

      // Refrescar contador en navbar si existe la función global
      if (typeof window !== 'undefined' && (window as any).refreshNavbarCartCount) {
        (window as any).refreshNavbarCartCount();
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Error al agregar al carrito');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getToken, getCartItems, showError]);

  // Manejar remover del carrito
  const handleRemoveFromCart = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) throw new Error('No token available');

      // Encontrar el item del carrito por productId
      const cartItem = cartItems.find(item => {
        if (item?.product?._id) {
          return item.product._id === productId;
        }
        if (item?._id) {
          return item._id === productId;
        }
        if (item?.idProduct) {
          return item.idProduct === productId;
        }
        return false;
      });

      if (!cartItem) {
        showError('Producto no encontrado en el carrito');
        return;
      }

      const cartItemId = cartItem._id || cartItem.id;
      
      await UserService.removeCartItem(token, cartItemId);
      console.log("Product removed from cart:", productId);
      
      // Actualizar estado local
      setCartItems(prev => prev.filter(item => {
        const itemId = item._id || item.id;
        return itemId !== cartItemId;
      }));
      
      showSuccess('Producto removido del carrito');

      // Refrescar contador en navbar
      if (typeof window !== 'undefined' && (window as any).refreshNavbarCartCount) {
        (window as any).refreshNavbarCartCount();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      showError('Error al remover del carrito');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getToken, cartItems, showSuccess, showError]);

  // Verificar si un producto está en el carrito
  const isProductInCart = useCallback((productId: string): boolean => {
    if (!cartItems || cartItems.length === 0) return false;
    
    return cartItems.some(item => {
      if (item?.product?._id) {
        return item.product._id === productId;
      }
      if (item?._id) {
        return item._id === productId;
      }
      if (item?.idProduct) {
        return item.idProduct === productId;
      }
      return false;
    });
  }, [cartItems]);

  // Cerrar notificación del carrito
  const closeCartNotification = useCallback(() => {
    setCartNotificationOpen(false);
    setLastAddedProduct(null);
  }, []);

  return {
    // Estado
    favoriteIds,
    cartItems,
    loading,
    cartNotificationOpen,
    lastAddedProduct,
    notification,
    
    // Acciones de notificaciones
    showError,
    showWarning,
    showSuccess,
    showInfo,
    closeNotification,
    
    // Otras acciones
    handleAddFavorite,
    handleRemoveFavorite,
    handleAddToCart,
    handleRemoveFromCart,
    isProductInCart,
    closeCartNotification,
    refreshData
  };
};