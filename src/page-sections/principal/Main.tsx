import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from "@clerk/nextjs";
import MainCarouselComponent from '../../components/carousel/MainCarousel'
import { imagesPrueba } from '@/data/ThreeImagesPrueba'
import ProductCard from '../../components/cards/Products'
import ThreeImages from '../../components/sections/ThreeImages'
import ProductService from '@/services/ProductService'
import UserService from '@/services/UserService';
import { Box, Grid, Typography, Snackbar, Alert } from '@mui/material';
import NavbarComponent from '@/components/NavbarComponent';
import FooterComponent from '@/components/FooterComponent';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { useMediaQuery, useTheme } from '@mui/material';
import { primary } from '@/theme/colors';
import { IProduct } from '@/interfaces/Product';
import CartNotificationModal from '@/components/cart/CartNotificationModal';

const MainComponent = () => {
  const { isSignedIn, getToken } = useAuth();
  const [dataProducts, setDataProducts] = useState<Array<IProduct>>([]);
  const [favoriteIds, setFavoriteIds] = useState<Array<string>>([]);
  const [cartItems, setCartItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Estados para la notificación del carrito
  const [cartNotificationOpen, setCartNotificationOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<{
    product: IProduct;
    size: string;
    quantity: number;
  } | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Función para mostrar notificaciones
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getProducts = async () => {
    try{
      const data = await ProductService.GetProducts();
      setDataProducts(data);
    }catch(error){
      console.error('Error getting products:', error);
      showSnackbar('Error al cargar productos', 'error');
    }
  }

  const getFavorites = async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      if (!token) return;
      
      const data = await UserService.getFavoriteIds(token);
      setFavoriteIds(data || []);
    } catch (error) {
      console.error('Error getting favorites:', error);
    }
  }

  const getCartItems = async () => {
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
  }

  // Cargar datos iniciales
  useEffect(() => {
    getProducts();
    if (isSignedIn) {
      getFavorites();
      getCartItems();
    }
  }, [isSignedIn]);

  const handleRemoveFavorite = useCallback(
    async (id: string) => {
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
    },
    [getToken],
  )

  const handleAddFavorite = useCallback(
    async (id: string) => {
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
    },
    [getToken],
  )

  // Función para agregar al carrito
  const handleAddToCart = useCallback(
    async (productId: string, size: string, quantity: number) => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No token available');

        console.log('Adding to cart:', { productId, size, quantity });
        
        await UserService.addCartItem(token, productId, quantity, size);
        console.log("Product added to cart:", productId);
        
        // Recargar items del carrito
        await getCartItems();
        
        // Encontrar el producto agregado para la notificación
        const addedProduct = dataProducts.find(p => p._id === productId);
        if (addedProduct) {
          setLastAddedProduct({
            product: addedProduct,
            size,
            quantity
          });
          setCartNotificationOpen(true);
        }

        // Refrescar contador en navbar si existe la función global
        if (typeof window !== 'undefined' && (window as any).refreshNavbarCartCount) {
          (window as any).refreshNavbarCartCount();
        }
        
        // La notificación de éxito se mostrará desde el modal de notificación
      } catch (error) {
        console.error('Error adding to cart:', error);
        showSnackbar('Error al agregar al carrito', 'error');
        throw error; // Re-throw para que el ProductCard pueda manejarlo
      } finally {
        setLoading(false);
      }
    },
    [getToken, dataProducts],
  )

  // Función para remover del carrito
  const handleRemoveFromCart = useCallback(
    async (productId: string) => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No token available');

        // Encontrar el item del carrito por productId con verificaciones de seguridad
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
    },
    [getToken, cartItems],
  )

  // Función para verificar si un producto está en el carrito
  const isProductInCart = useCallback((productId: string): boolean => {
    if (!cartItems || cartItems.length === 0) return false;
    
    return cartItems.some(item => {
      // Verificar diferentes estructuras posibles
      if (item?.product?._id) {
        return item.product._id === productId;
      }
      // Si el item directamente tiene el productId
      if (item?._id) {
        return item._id === productId;
      }
      // Si tiene idProduct
      if (item?.idProduct) {
        return item.idProduct === productId;
      }
      return false;
    });
  }, [cartItems]);

  return (
    <>
      <NavbarComponent main={true} cartItemsCount={cartItems.length} />
      <Box sx={{height:{xs:64, sm:64, md:0}}}></Box>
      <Box>
        <Grid container size={12}>
            <Grid size={{xs:12, sm:0, md:0}} sx={{marginX:'auto' }}>
              <MainCarouselComponent images={['https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dw383b8e58/homepage/1.jpg?sw=2560&q=80', 'https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dw383b8e58/homepage/1.jpg?sw=2560&q=80']}/>
            </Grid>
            <Grid size={{xs:0, sm:12, md:12}} sx={{marginX:'auto'}}>
              <MainCarouselComponent images={['https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dwac99c941/homepage/BannerHero_Mobile_Campa%C3%B1aPapa2905.jpg?sw=2560&q=80', 'https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dwac99c941/homepage/BannerHero_Mobile_Campa%C3%B1aPapa2905.jpg?sw=2560&q=80']}/>
            </Grid>
        </Grid>
        <Box sx={{height: 16}}></Box>
        {
          isMobile ? (
            <Box>
              <Swiper
                spaceBetween={16}
                slidesPerView={1.2}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                style={{ paddingBottom: '2rem' }}
              >
                {imagesPrueba.map((image, index) => (
                  <SwiperSlide key={index}>
                    <ThreeImages image={image} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          ) : (
            <Grid container>
              {imagesPrueba.map((image, index) => (
                <Grid size={{xs:12, sm:6, md:4}} key={index}>
                  <ThreeImages image={image} />
                </Grid>
              ))}
            </Grid>
          )
        }
        <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginY:3}}>
          <Typography variant='subtitleMain' sx={{ marginY:2, color: primary.subtitleMain}}>
            Novedades
          </Typography>
        </Box>
        <Box>
          <Swiper
            spaceBetween={16}
            slidesPerView={isMobile ? 1.2 : 4}
            style={{ paddingBottom: '2rem' }}
            pagination={{ clickable: true }}
            modules={[Pagination]}
          >
            {dataProducts.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductCard
                  products={product}
                  show
                  markedFavorite={isSignedIn && favoriteIds.includes(product._id)}
                  handleRemoveFavorite={handleRemoveFavorite}
                  handleAddFavorite={handleAddFavorite}
                  handleAddToCart={handleAddToCart} 
                  handleRemoveFromCart={handleRemoveFromCart}
                  isInCart={isProductInCart(product._id)} 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
      <FooterComponent/>

      {/* Modal de notificación del carrito */}
      <CartNotificationModal
        open={cartNotificationOpen}
        onClose={() => {
          setCartNotificationOpen(false);
          setLastAddedProduct(null);
        }}
        product={lastAddedProduct?.product || null}
        size={lastAddedProduct?.size}
        quantity={lastAddedProduct?.quantity}
        autoHideDuration={5000}
      />

      {/* Snackbar para notificaciones generales */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default MainComponent