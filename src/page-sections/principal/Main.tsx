import React, { useEffect, useState } from 'react'
import { useAuth } from "@clerk/nextjs";
import MainCarouselComponent from '../../components/carousel/MainCarousel'
import { imagesPrueba } from '@/data/ThreeImagesPrueba'
import ProductCard from '../../components/product/Products'
import ThreeImages from '../../components/sections/ThreeImages'
import ProductService from '@/services/ProductService'
import { Box, Grid, Typography, Snackbar, Alert } from '@mui/material';
import NavbarComponent from '@/components/principal/NavbarComponent';
import FooterComponent from '@/components/principal/FooterComponent';
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
import WhatsAppFloat from '@/components/whatsapp/WhatsAppFloat';
import BannerPrincipalService from '@/services/BannerPrincipalService';
import { IBannerPrincipal } from '@/interfaces/BannerPrincipal';
import BannerPrincipal from '@/components/principal/BannerPrincipal';
import ProductCategoryService from '@/services/ProductCategoryService';
import { IProductCategory } from '@/interfaces/ProductCategory';
import { SplashScreen } from '@/components/splash-screen';

const MainComponent = () => {
  const { isSignedIn } = useAuth();
  const [dataProducts, setDataProducts] = useState<Array<IProduct>>([]);
  const [dataBannersPr, setDataBannersPr] = useState<Array<IBannerPrincipal>>([]);
  const [brandsWithCategories, setBrandsWithCategories] = useState<IBrandWithCategories[]>([]);
  const [categoriesWithDescuento, setCategoriesWithDescuento] = useState<Array<IProductCategory>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { 
    notification, 
    closeNotification, 
    showError, 
  } = useNotification();
  
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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
      setIsLoading(true);
      const data = await ProductService.GetProducts();
      setDataProducts(data);
    }catch(error){
      console.error('Error getting products:', error);
      showError('Error al cargar las categor?as de marcas');
    }finally{
      setIsLoading(false);
    }
  }

  const getAllCategoriesWithDescuentos = async()=>{
    try {
      const data = await ProductCategoryService.getAllCategoryWithDescuentos();
      setCategoriesWithDescuento(data);
    } catch (error) {
      showError(`${error}`)
    }

  }

  // Cargar datos iniciales
  useEffect(() => {
    getAllBannersPrincipales();
    fetchBrandsWithCategories();
    getAllCategoriesWithDescuentos();
    getProducts();
  }, []);
  if(isLoading){
    return <SplashScreen/>
  }
  // Agregar esta función dentro del componente MainComponent
  const getAllUniqueCategories = () => {
    // Obtener categorías de marcas
    const categoriesFromBrands = brandsWithCategories.flatMap(item => item.categories);
    
    // Combinar con categorías con descuento
    const allCategories = [...categoriesFromBrands, ...categoriesWithDescuento];
    
    // Filtrar categorías únicas por routeLink (que parece ser único)
    const uniqueCategories = allCategories.filter((category, index, self) => 
      index === self.findIndex(c => c.routeLink === category.routeLink)
    );
    
    return uniqueCategories;
  };

  // Usar en el componente
  const uniqueCategories = getAllUniqueCategories();

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
        {/* DESCUENTOS TRICKS */}
        <Box>
          <Swiper
            spaceBetween={4}
            scrollbar={{
              hide: false,
            }}
            slidesPerView={isMobile ? 1.2 : isTablet ? 2 : 4}
            modules={[Scrollbar]}
            className="mySwiper"
            style={{ paddingBottom: '2rem' }}
          >
            {categoriesWithDescuento.map((category) => (
                <SwiperSlide key={category._id} onClick={()=>router.push(`/mujer/calzados/${category.routeLink}`)}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { xs: '450px', sm: '500px', md: '550px', lg: '600px' },
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
                      fill
                      style={{
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
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          transition: 'background-color 0.3s ease'
                        }
                      }}
                    >
                      {/* Texto de descuento encima del nombre */}
                      {category.maxDescuento && (
                        <Box
                          sx={{
                            top: 16,
                            right: 16,
                            backgroundColor: '#f81c1cff',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '5px',
                            fontSize: { xs: '0.75rem', sm: '0.75rem' },
                            fontWeight: 'bold',
                            zIndex: 2,
                            marginBottom:'0.4rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                          }}
                        >
                          HASTA {category.maxDescuento}% OFF
                        </Box>
                      )}
                      
                      <Typography
                        sx={{
                          color: '#fff',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          px: 1,
                          fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.25rem' },
                        }}
                      >
                        {category.name.toUpperCase()}
                      </Typography>
                      
                      {/* Botón transparente */}
                      <Box
                        sx={{
                          border: '2px solid rgba(255, 255, 255, 0.8)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          padding: '8px 24px',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            border: '2px solid rgba(255, 255, 255, 1)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)'
                          }
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: { xs: '0.875rem', sm: '0.8rem' },
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          Ver Descuentos
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
          </Swiper>
        </Box>
        <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginY:3}}>
          <Typography variant='subtitleMain' sx={{ marginY:2, color: primary.subtitleMain}}>
            Descuentos
          </Typography>
        </Box>
        <Box>
          <Swiper
            spaceBetween={16}
            slidesPerView={isMobile ? 1.2 : isTablet ? 2 : 4}
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
            slidesPerView={isMobile ? 1.2 : isTablet ? 2 : 4}
            modules={[Scrollbar]}
            className="mySwiper"
            style={{ paddingBottom: '2rem' }}
          >
            {getAllUniqueCategories().map((category) => (
                <SwiperSlide key={category._id} onClick={()=>router.push(`/mujer/calzados/${category.routeLink}`)}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { xs: '450px', sm: '500px', md: '550px', lg: '600px' }, // Altura fija responsiva
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
        <Box >
          <Swiper
            spaceBetween={16}
            slidesPerView={isMobile ? 1.2 : isTablet ? 2 : 4}
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