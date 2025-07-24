'use client';
import React, { useEffect, useState } from 'react'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/interfaces/Product';
import ProductService from '@/services/ProductService';
import ProductCard from '@/components/cards/Products';


const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

type Props = {
  idGroup: string;
  idSub: string;
  idProduct: string
}
const ProductCategoryPageSection: React.FC<Props> = ({idGroup, idSub, idProduct}) => {

  const [products, setProducts] = useState<IProduct[]>([])
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split('/').filter(Boolean);

  const categoria = capitalize(segments[0] || '');
  const subcategoria = capitalize(segments[1] || '');
  const productcategoria = capitalize(segments[2] || '');

  const getProducts = async () => {
    try {
      const data = await ProductService.GetProductsByIdGroupAndIdSubCategoryAndIdCategory(idGroup, idSub, idProduct);
      setProducts(data);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    getProducts();
  }, [])
  

  return (
    <>
        <div className='h-16'></div>
        <Box sx={{minHeight: '100vh'}}>
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
          <Grid container spacing={1} sx={{paddingX: 2, paddingY: 4}} >
            {
              products.map((product: IProduct) => (
                <Grid key={product._id} size={{xs:12, sm:6, md:3}}>
                  <ProductCard products={product} show/>
                </Grid>
              ))
            }
          </Grid>
          {
            products.length === 0 &&
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: 'white'}}>
              <Typography variant='h5' sx={{color: '#3f3f40ff', fontWeight: 'bold'}}>
                No se encontraron productos
              </Typography>
            </Box>
          }
        </Box>
    </>
  )
}

export default ProductCategoryPageSection
