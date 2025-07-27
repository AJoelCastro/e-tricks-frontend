import React, { useEffect, useState } from 'react'
import { useAuth } from "@clerk/nextjs";
import MainCarouselComponent from '../../components/carousel/MainCarousel'
import { imagesPrueba } from '@/data/ThreeImagesPrueba'
import ProductCard from '../../components/cards/Products'
import ThreeImages from '../../components/sections/ThreeImages'
import ProductService from '@/services/ProductService'
import { Box, Grid, Typography, Snackbar, Alert } from '@mui/material';
import NavbarComponent from '@/components/NavbarComponent';
import FooterComponent from '@/components/FooterComponent';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Scrollbar } from 'swiper/modules';
import { useMediaQuery, useTheme } from '@mui/material';
import { primary } from '@/theme/colors';
import { IProduct } from '@/interfaces/Product';
import CartNotificationModal from '@/components/cart/CartNotificationModal';
import { IBrandWithCategories } from '@/interfaces/Brand';
import BrandService from '@/services/BrandService';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useProductLogic } from '@/hooks/useProductLogic';

const MainComponent = () => {
  const { isSignedIn } = useAuth();
  const [dataProducts, setDataProducts] = useState<Array<IProduct>>([]);
  const [brandsWithCategories, setBrandsWithCategories] = useState<IBrandWithCategories[]>([]);
  const router = useRouter();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Usar el hook personalizado para toda la l?gica de productos
  const {
    favoriteIds,
    cartItems,
    loading,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    cartNotificationOpen,
    lastAddedProduct,
    showSnackbar,
    handleCloseSnackbar,
    handleAddFavorite,
    handleRemoveFavorite,
    handleAddToCart,
    handleRemoveFromCart,
    isProductInCart,
    closeCartNotification,
  } = useProductLogic();

  const fetchBrandsWithCategories = async () => {
    try {
      const data = await BrandService.getBrandsWithProductCategories();
      setBrandsWithCategories(data);
    } catch (error) {
      console.error('Error fetching brands with categories:', error);
    }
  }

  const getProducts = async () => {
    try{
      const data = await ProductService.GetProducts();
      setDataProducts(data);
    }catch(error){
      console.error('Error getting products:', error);
      showSnackbar('Error al cargar productos', 'error');
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    fetchBrandsWithCategories();
    getProducts();
  }, []);

  // Funci?n mejorada para agregar al carrito con producto completo
  const handleAddToCartWithProduct = async (productId: string, size: string, quantity: number) => {
    const product = dataProducts.find(p => p._id === productId);
    await handleAddToCart(productId, size, quantity, product);
  };

  return (
    <>
      <NavbarComponent main={true} cartItemsCount={cartItems.length} />
      <Box sx={{height:{xs:64, sm:64, md:0}}}></Box>
      <Box sx={{marginBottom:4}}>
        {
          isMobile ? (
            <MainCarouselComponent images={['https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dw383b8e58/homepage/1.jpg?sw=2560&q=80', 'https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dw383b8e58/homepage/1.jpg?sw=2560&q=80']}/>
            
          ) : (
            <MainCarouselComponent images={['https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dwac99c941/homepage/BannerHero_Mobile_Campa%C3%B1aPapa2905.jpg?sw=2560&q=80', 'https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dwac99c941/homepage/BannerHero_Mobile_Campa%C3%B1aPapa2905.jpg?sw=2560&q=80']}/>
          )
        }
        <Box sx={{height: 16}}></Box>
        {
          isMobile ? (
            <Box>
              <Swiper
                spaceBetween={4}
                scrollbar={{
                  hide: false,
                }}
                slidesPerView={isMobile ? 1.2 : 4}
                modules={[Scrollbar]}
                className="mySwiper"
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
            Descuentos
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
            {dataProducts
              .filter((product) => product.descuento!==0)
              .map((product) => (
                <SwiperSlide key={product._id}>
                  <ProductCard
                    products={product}
                    show
                    markedFavorite={isSignedIn && favoriteIds.includes(product._id)}
                    handleRemoveFavorite={handleRemoveFavorite}
                    handleAddFavorite={handleAddFavorite}
                    handleAddToCart={handleAddToCartWithProduct}
                    handleRemoveFromCart={handleRemoveFromCart}
                    isInCart={isProductInCart(product._id)}
                  />
                </SwiperSlide>
            ))}
          </Swiper>
        </Box>
        {/* NOVEDADES TRICKS */}

        <Box>
          <Swiper
            spaceBetween={4}
            scrollbar={{
              hide: false,
            }}
            slidesPerView={isMobile ? 1.2 : 4}
            modules={[Scrollbar]}
            className="mySwiper"
          >
            {brandsWithCategories
              .find((brand) => brand.brand.name === 'Tricks')
              ?.categories.map((category) => (
                <SwiperSlide key={category._id} onClick={()=>router.push(`/mujer/calzados/${category.routeLink}`)}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      maxHeight: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={200}
                      height={200}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          color: '#fff',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          px: 1,
                        }}
                      >
                        {category.name.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
          </Swiper>
        </Box>
        <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginY:3}}>
          <Typography variant='subtitleMain' sx={{ marginY:2, color: primary.subtitleMain}}>
            Novedades
          </Typography>
        </Box>
        <Box>
          <Swiper
            spaceBetween={16}
            slidesPerView={isMobile ? 1.2 : 4}
            pagination={{ clickable: true }}
            modules={[Pagination]}
          >
            {dataProducts
              .filter((product) => product.isNewProduct)
              .map((product) => (
                <SwiperSlide key={product._id}>
                  <ProductCard
                    products={product}
                    show
                    markedFavorite={isSignedIn && favoriteIds.includes(product._id)}
                    handleRemoveFavorite={handleRemoveFavorite}
                    handleAddFavorite={handleAddFavorite}
                    handleAddToCart={handleAddToCartWithProduct}
                    handleRemoveFromCart={handleRemoveFromCart}
                    isInCart={isProductInCart(product._id)}
                  />
                </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
      <FooterComponent/>

      {/* Modal de notificaci?n del carrito */}
      <CartNotificationModal
        open={cartNotificationOpen}
        onClose={closeCartNotification}
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