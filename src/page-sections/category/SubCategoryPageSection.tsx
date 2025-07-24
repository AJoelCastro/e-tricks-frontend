'use client';
import React from 'react'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';


const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const SubCategoryPageSection = () => {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split('/').filter(Boolean);

  const categoria = capitalize(segments[0] || '');
  const subcategoria = capitalize(segments[1] || '');
  return (
    <>
        <div className='h-16'></div>
        <Box sx={{minHeight: '100vh'}}>
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
        </Box>
    </>
  )
}

export default SubCategoryPageSection
