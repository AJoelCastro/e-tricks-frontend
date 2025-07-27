import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@clerk/nextjs";
import UserService from '@/services/UserService';
import { IProduct } from '@/interfaces/Product';

interface ProductLogicState {
  favoriteIds: string[];
  cartItems: any[];
  loading: boolean;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error';
  cartNotificationOpen: boolean;
  lastAddedProduct: {
    product: IProduct;
    size: string;
    quantity: number;
  } | null;
}

interface ProductLogicActions {
  // Snackbar
  showSnackbar: (message: string, severity: 'success' | 'error') => void;
  handleCloseSnackbar: () => void;
  
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
  
  // Estados
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [cartNotificationOpen, setCartNotificationOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<{
    product: IProduct;
    size: string;
    quantity: number;
  } | null>(null);

  // Función para mostrar notificaciones
  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

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
      showSnackbar('Producto agregado a favoritos', 'success');
    } catch (error) {
      console.error('Error adding favorite:', error);
      showSnackbar('Error al agregar a favoritos', 'error');
    } finally {
      setLoading(false);
    }
  }, [getToken, showSnackbar]);

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
      showSnackbar('Producto removido de favoritos', 'success');
    } catch (error) {
      console.error('Error removing favorite:', error);
      showSnackbar('Error al remover de favoritos', 'error');
    } finally {
      setLoading(false);
    }
  }, [getToken, showSnackbar]);

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
      
      // Mostrar notificación del carrito si se proporciona el producto
      if (product) {
        setLastAddedProduct({
          product,
          size,
          quantity
        });
        setCartNotificationOpen(true);
      }

      // Refrescar contador en navbar si existe la función global
      if (typeof window !== 'undefined' && (window as any).refreshNavbarCartCount) {
        (window as any).refreshNavbarCartCount();
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showSnackbar('Error al agregar al carrito', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getToken, getCartItems, showSnackbar]);

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
        showSnackbar('Producto no encontrado en el carrito', 'error');
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
      
      showSnackbar('Producto removido del carrito', 'success');

      // Refrescar contador en navbar
      if (typeof window !== 'undefined' && (window as any).refreshNavbarCartCount) {
        (window as any).refreshNavbarCartCount();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      showSnackbar('Error al remover del carrito', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getToken, cartItems, showSnackbar]);

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
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    cartNotificationOpen,
    lastAddedProduct,
    
    // Acciones
    showSnackbar,
    handleCloseSnackbar,
    handleAddFavorite,
    handleRemoveFavorite,
    handleAddToCart,
    handleRemoveFromCart,
    isProductInCart,
    closeCartNotification,
    refreshData
  };
};