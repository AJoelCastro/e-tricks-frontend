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
import { Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import { useMediaQuery, useTheme } from '@mui/material';
import { primary } from '@/theme/colors';
import { IProduct } from '@/interfaces/Product';
import CartNotificationModal from '@/components/cart/CartNotificationModal';
import { IBrandWithCategories } from '@/interfaces/Brand';
import BrandService from '@/services/BrandService';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useProductLogic } from '@/hooks/useProductLogic';
import ErrorNotification from '@/components/ErrorNotification';
import { useNotification } from '@/hooks/useNotification';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import BannerPrincipalService from '@/services/BannerPrincipalService';
import { IBannerPrincipal } from '@/interfaces/BannerPrincipal';
import BannerPrincipal from '@/components/BannerPrincipal';

const MainComponent = () => {
  const { isSignedIn } = useAuth();
  const [dataProducts, setDataProducts] = useState<Array<IProduct>>([]);
  const [dataBannersPr, setDataBannersPr] = useState<Array<IBannerPrincipal>>([]);
  const [brandsWithCategories, setBrandsWithCategories] = useState<IBrandWithCategories[]>([]);
  const { 
    notification, 
    closeNotification, 
    showError, 
  } = useNotification();
  
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Usar el hook personalizado para toda la l?gica de productos
  const {
    favoriteIds,
    cartItems,
    cartNotificationOpen,
    lastAddedProduct,
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
      showError('Error al cargar las categor?as de marcas');
    }
  }

  const getAllBannersPrincipales = async () => {
    try {
      const data = await BannerPrincipalService.getAllBanners();
      setDataBannersPr(data);
    } catch (error) {
      showError(`${error}`)
    }
  }
  const getProducts = async () => {
    try{
      const data = await ProductService.GetProducts();
      setDataProducts(data);
    }catch(error){
      console.error('Error getting products:', error);
      showError('Error al cargar las categor?as de marcas');
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    getAllBannersPrincipales();
    fetchBrandsWithCategories();
    getProducts();
  }, []);

  // Funcion mejorada para agregar al carrito con producto completo
  const handleAddToCartWithProduct = async (productId: string, size: string, quantity: number) => {
    const product = dataProducts.find(p => p._id === productId);
    await handleAddToCart(productId, size, quantity, product);
  };

  return (
    <>
      <NavbarComponent main={true} cartItemsCount={cartItems.length} />
      <Box sx={{height:{xs:64, sm:64, md:0}}}></Box>
      <Box sx={{marginBottom:4}}>
        {dataBannersPr.length > 0 && (
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            loop={dataBannersPr.length > 1}
            slidesPerView={1}
            allowTouchMove={true}
          >
            {dataBannersPr.map((banner, index) => (
              <SwiperSlide key={index}>
                <BannerPrincipal banner={banner} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
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
            style={{ paddingBottom: '2rem' }}
          >
            {brandsWithCategories
              .find((brand) => brand.brand.name === 'Tricks')
              ?.categories.map((category) => (
                <SwiperSlide key={category._id} onClick={()=>router.push(`/mujer/calzados/${category.routeLink}`)}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { xs: '400px', sm: '450px', md: '500px' }, // Altura fija responsiva
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        transition: 'transform 0.3s ease'
                      }
                    }}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill // Usar fill en lugar de width/height específicos
                      style={{
                        objectFit: 'cover', // Esto mantendrá las proporciones y llenará el contenedor
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
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          transition: 'background-color 0.3s ease'
                        }
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          color: '#fff',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          px: 1,
                          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } // Tamaño responsivo del texto
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
            style={{ paddingBottom: '2rem' }} 
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
      <WhatsAppFloat />
      {/* Modal de notificaci?n del carrito */}
      <CartNotificationModal
        open={cartNotificationOpen}
        onClose={closeCartNotification}
        product={lastAddedProduct?.product || null}
        size={lastAddedProduct?.size}
        quantity={lastAddedProduct?.quantity}
        autoHideDuration={5000}
      />

      {/* Notifaciones de error generales */}
      <ErrorNotification
        open={notification.open}
        onClose={closeNotification}
        message={notification.message}
        type={notification.type}
        autoHideDuration={4000}
        position="top"
      />
    </>
  )
}

export default MainComponent