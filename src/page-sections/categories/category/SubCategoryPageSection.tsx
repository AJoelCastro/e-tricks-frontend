'use client';
import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SubCategoryService from '@/services/SubCategoryService';
import { IProduct } from '@/interfaces/Product';
import { IProductCategory } from '@/interfaces/ProductCategory';
import { useDispatch } from 'react-redux';
import { setProductCategoryId } from '@/store/slices/categorySelectionSlice';
import ProductService from '@/services/ProductService';
import ProductCard from '@/components/product/Products';
import NoProductsFound from '@/components/not-found/NoProductsFound';
import NavbarComponent from '@/components/principal/NavbarComponent';
import FooterComponent from '@/components/principal/FooterComponent';
import ErrorNotification from '@/components/ErrorNotification';
import CartNotificationModal from '@/components/cart/CartNotificationModal';
import { useProductLogic } from '@/hooks/useProductLogic';
import { useAuth } from '@clerk/nextjs';
import BrandService from '@/services/BrandService';
import { IBrandWithCategories } from '@/interfaces/Brand';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

type Props = {
  groupId?: string;
  subId?: string;
  marcaId?: string;
  women?: boolean;
  marca?: boolean;
}
const SubCategoryPageSection: React.FC<Props> = ({groupId, subId, marcaId, women, marca}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productCategories, setProductCategories] = useState<IProductCategory[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split('/').filter(Boolean);
  const dispatch = useDispatch();
  const { isSignedIn } = useAuth();
  
  // Hook para la lógica de productos
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
  
  const categoria = capitalize(segments[0] || '');
  const subcategoria = capitalize(segments[1] || '');
  const getProductCategoriesMarca = async () => {
    try {
      setIsLoading(true);
      const data = await BrandService.getBrandsWithProductCategories();
      const prodCat = data.find((marca: IBrandWithCategories) => marca.brand._id === marcaId)?.categories;
      setProductCategories(prodCat);
    } catch (error) {
      throw error;
    }finally {
      setIsLoading(false);
    }
  }
  
  const getProductsMarca = async () => {
    try {
      setIsLoading(true);
      const data = await ProductService.GetProductsByIdMarca(marcaId!);
      setProducts(data);
    } catch (error) {
      throw error;
    }finally {
      setIsLoading(false);
    }
  }
  const getProductCategoriesWomen = async () => {
    try {
      setIsLoading(true);
      const data = await SubCategoryService.getCategoriesFromGroup(subId!);
      setProductCategories(data.data);
    } catch (error) {
      throw error;
    }finally {
      setIsLoading(false);
    }
  }
  
  const getProductsWomen = async () => {
    try {
      setIsLoading(true);
      const data = await ProductService.GetProductsByIdGroupAndIdSubCategory(groupId!, subId!);
      setProducts(data);
    } catch (error) {
      throw error;
    }finally {
      setIsLoading(false);
    }
  }

  // Funciones locales para manejar favoritos y carrito
  const handleAddFavoriteLocal = async (productId: string) => {
    await handleAddFavorite(productId);
  }
  
  const handleRemoveFavoriteLocal = async (productId: string) => {
    await handleRemoveFavorite(productId);
  };

  const handleAddToCartLocal = async (productId: string, size: string, quantity: number) => {
    try {
      // Encontrar el producto específico para pasarlo al hook
      const product = products.find(p => p._id === productId);
      
      if (!product) {
        console.error('Producto no encontrado');
        return;
      }
      
      // Llamar a la función del hook pasando el producto
      await handleAddToCart(productId, size, quantity, product);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };
  
  useEffect(() => {
    if (women) {
      getProductCategoriesWomen();
      getProductsWomen();
    } else if (marca) {
      getProductCategoriesMarca();
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
          <IconButton onClick={()=>router.push(`/${categoria.toLowerCase()}`)}>
            <KeyboardBackspaceIcon sx={{color: 'black', ":hover": {color: '#7c3aed'}}}/>
          </IconButton>
          <Link href={`/${categoria.toLowerCase()}`}>
            <Typography variant='sideBarSubCategories' sx={{color: '#424142ff', ":hover": {color: '#7c3aed'}}}>
              {categoria}
            </Typography>
          </Link>
          <Typography variant='marcaCard' sx={{color: '#7c3aed'}}>/</Typography>
          <Typography variant='sideBarSubCategories' sx={{color: '#7c3aed'}}>
            {subcategoria}
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
        <Box sx={{ paddingX: 3, paddingY: 4, backgroundColor: 'white'}}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
            <Typography variant='h5' sx={{color: '#3f3f40ff', fontWeight: 'bold'}}>
              {subcategoria}
            </Typography>
            <Typography variant='h6' sx={{color: '#3f3f40ff', fontWeight: 'bold'}}>
              [{products.length}]
            </Typography>
          </Box>
          <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2}}>
            {
              productCategories.map((productCategory: IProductCategory) => (
                <Button
                  key={productCategory._id}
                  onClick={() => {
                    dispatch(setProductCategoryId(productCategory._id));
                    router.push(`/${categoria.toLowerCase()}/${subcategoria.toLowerCase()}/${productCategory.routeLink}`)
                  }}
                  sx={{color: 'black', ":hover": {borderColor: '#7c3aed', color:'#7c3aed'}, borderColor:'black'}}
                  variant='outlined'
                >
                  {productCategory.name}
                </Button>
              ))
            }
          </Box>
        </Box>
        
        {
          products.length === 0 ? 
            <NoProductsFound/>:
          (
            <Grid container spacing={1} sx={{paddingX: 2, paddingY: 4}} >
              {
                products.map((product: IProduct) => (
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
      <FooterComponent/>
    </>
  )
}

export default SubCategoryPageSection