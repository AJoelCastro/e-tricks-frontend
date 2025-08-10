'use client';
import React, { useState } from 'react';
import {Box, Grid} from '@mui/material';
import { useRouter } from 'next/navigation';
import ProductForm from '../../../../components/product/ProductForm';
import { IProduct } from '@/interfaces/Product';
import NavbarComponent from '@/components/principal/NavbarComponent';
import LeftSideAdmin from '@/components/admin/LeftSideAdmin';

const ProductRegisterPageSection = () => {
  const router = useRouter();
  const handleSuccess = (product: IProduct) => {
    // Redirigir a la lista de productos después de crear
    router.push('/admin/productos');
  };

  const handleCancel = () => {
    router.back();
  };
  return (
    <>
      <NavbarComponent/>
      <Box sx={{ height: { xs: 16, sm: 32, md: 64 } }} />
      <Grid container spacing={1} sx={{minHeight:'100vh'}}>
        <Grid size={{
          xs:12, sm:5, md:3
        }}>
          <LeftSideAdmin/>
        </Grid>
        <Grid size={{
          xs:12, sm:7, md:9
        }}>
          <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </Grid>
      </Grid>
    </>
  );
};

export default ProductRegisterPageSection;