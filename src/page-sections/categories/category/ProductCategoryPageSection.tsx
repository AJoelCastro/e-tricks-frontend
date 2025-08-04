'use client';
import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Grid, IconButton, Typography } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/interfaces/Product';
import ProductService from '@/services/ProductService';
import ProductCard from '@/components/product/Products';
import NoProductsFound from '@/components/not-found/NoProductsFound';
import NavbarComponent from '@/components/principal/NavbarComponent';
import FooterComponent from '@/components/principal/FooterComponent';
import ErrorNotification from '@/components/ErrorNotification';
import CartNotificationModal from '@/components/cart/CartNotificationModal';
import { useProductLogic } from '@/hooks/useProductLogic';
import { useAuth } from '@clerk/nextjs';
import ProductFilter from '@/components/product/ProductFilter';
import { useProductFilter } from '@/hooks/useProductFilter';
import WhatsAppFloat from '@/components/whatsapp/WhatsAppFloat';


const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

type Props = {
  idGroup?: string;
  idSub?: string;
  idProduct?: string;
  marcaId?: string;
  marca?: boolean;
  women?: boolean;
}
const ProductCategoryPageSection: React.FC<Props> = ({idGroup, idSub, idProduct, marcaId, marca, women}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<IProduct[]>([])
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const {
    favoriteIds,
    cartItems,
    loading,
    cartNotificationOpen,
    lastAddedProduct,
    notification,
    closeNotification,
    handleAddFavorite,
    handleRemoveFavorite,
    handleAddToCart,
    handleRemoveFromCart,
    isProductInCart,
    closeCartNotification,
    } = useProductLogic();
  const segments = pathname.split('/').filter(Boolean);
  const {
    filter,
    filteredProducts,
    minPrice,
    maxPrice,
    handleFilterTypeChange,
    handlePriceRangeChange,
    handleSeasonChange,
    handleBrandChange,
    handleCategoryChange,
    clearFilters,
  } = useProductFilter({ products: products });
  const categoria = capitalize(segments[0] || '');
  const subcategoria = capitalize(segments[1] || '');
  const productcategoria = capitalize(segments[2] || '');

  const getProductsWomen = async () => {
    try {
      setIsLoading(true);
      const data = await ProductService.GetProductsByIdGroupAndIdSubCategoryAndIdCategory(idGroup!, idSub!, idProduct!);
      setProducts(data);
    } catch (error) {
      throw error;
    }finally {
      setIsLoading(false);
    }
  }
  const getProductsMarca = async () => {
    try {
      setIsLoading(true);
      const data = await ProductService.GetProductsByIdMarcaAndIdCategory(marcaId!, idProduct!);
      console.log('data', data)
      setProducts(data);
    } catch (error) {
      throw error;
    }finally {
      setIsLoading(false);
    }
  }
  const handleAddFavoriteLocal = async (productId: string) => {
    await handleAddFavorite(productId);
  }
  const handleRemoveFavoriteLocal = async (productId: string) => {
    await handleRemoveFavorite(productId);
  };

  const handleAddToCartLocal = async (productId: string, size: string, quantity: number) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      await handleAddToCart(productId, size, quantity, product);
    }
  };

  useEffect(() => {
    if (women) {
      getProductsWomen();
    }else if (marca) {
      getProductsMarca();
    }
  }, [])
  if (isLoading) {
    return (
      <>
        <div className='h-16'></div>
        <Box sx={{minHeight: '100vh'}}>
          <Grid size={12}
            sx={{ textAlign: 'center', mt: 4 }}
          >
            <CircularProgress/>
          </Grid>
        </Box>
      </>
    )
  }

  return (
    <>
      <NavbarComponent/>
      <div className='h-16'></div>
      <Box sx={{minHeight: '100vh'}}>
        {/* Notificaciones */}
        <ErrorNotification
            open={notification.open}
            onClose={closeNotification}
            message={notification.message}
            type={notification.type}
            autoHideDuration={3000}
        />
        <CartNotificationModal
            open={cartNotificationOpen}
            onClose={closeCartNotification}
            product={lastAddedProduct?.product || null}
            size={lastAddedProduct?.size}
            quantity={lastAddedProduct?.quantity}
            autoHideDuration={5000}
        />
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: 'white'}}>
          <IconButton onClick={()=>router.push(`/${categoria.toLowerCase()}/${subcategoria.toLowerCase()}`)}>
            <KeyboardBackspaceIcon sx={{color: 'black', ":hover": {color: '#7c3aed'}}}/>
          </IconButton>
          <Link href={`/${categoria.toLowerCase()}`}>
            <Typography variant='sideBarSubCategories' sx={{color: '#424142ff', ":hover": {color: '#7c3aed'}}}>
              {categoria}
            </Typography>
          </Link>
          <Typography variant='marcaCard' sx={{color: '#424142ff'}}>/</Typography>
          <Link href={`/${categoria.toLowerCase()}/${subcategoria.toLowerCase()}`}>
            <Typography variant='sideBarSubCategories' sx={{color: '#424142ff', ":hover": {color: '#7c3aed'}}}>
              {subcategoria}
            </Typography>
          </Link>
          <Typography variant='marcaCard' sx={{color: '#7c3aed'}}>/</Typography>
          <Typography variant='sideBarSubCategories' sx={{color: '#7c3aed'}}>
            {productcategoria}
          </Typography>
        </Box>
        {/* Banner section */}
        <Box sx={{width: '100%', height: {md:'225px', sm:'150px', xs:'100px'}, position: 'relative'}}>
          <Image
            src={'https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dw22bade2c/Menu/POWER06.05.jpg?sw=1777&q=80'}
            alt='banner'
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>
        
        {/* Productos */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2,paddingX: 3, paddingY: 4, backgroundColor: 'white'}}>
          <Typography variant='h5' sx={{color: '#3f3f40ff', fontWeight: 'bold'}}>
            {productcategoria}
          </Typography>
          <Typography variant='h6' sx={{color: '#3f3f40ff', fontWeight: 'bold'}}>
            [{products.length}]
          </Typography>
          
        </Box>
        <Box sx={{ width: '100%' }}>
          <ProductFilter
            filter={filter}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onFilterTypeChange={handleFilterTypeChange}
            onPriceRangeChange={handlePriceRangeChange}
            onSeasonChange={handleSeasonChange}
            onBrandChange={handleBrandChange}
            onCategoryChange={handleCategoryChange}
            onClearFilters={clearFilters}
          />
        </Box>
        {
          products.length === 0 ?
            <NoProductsFound/>:
          (
            <Grid container spacing={1} sx={{paddingX: 2, paddingY: 4}} >
              {
                filteredProducts.map((product: IProduct) => (
                  <Grid key={product._id} size={{xs:12, sm:6, md:3}}>
                    <ProductCard
                      products={product}
                      show
                      markedFavorite={isSignedIn && favoriteIds.includes(product._id)}
                      handleRemoveFavorite={handleRemoveFavoriteLocal}
                      handleAddToCart={handleAddToCartLocal}
                      handleRemoveFromCart={handleRemoveFromCart}
                      isInCart={isProductInCart(product._id)}
                      handleAddFavorite={handleAddFavoriteLocal}
                    />
                  </Grid>
                ))
              }
            </Grid>
          )
        }
      </Box>
      <WhatsAppFloat />
      <FooterComponent/>
    </>
  )
}

export default ProductCategoryPageSection
