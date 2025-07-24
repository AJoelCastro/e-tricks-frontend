'use client';
import React from 'react'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';


const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

type Props = {
  id: string
}
const ProductCategoryPageSection: React.FC<Props> = ({id}) => {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split('/').filter(Boolean);

  const categoria = capitalize(segments[0] || '');
  const subcategoria = capitalize(segments[1] || '');
  const productcategoria = capitalize(segments[2] || '');
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
        </Box>
    </>
  )
}

export default ProductCategoryPageSection
