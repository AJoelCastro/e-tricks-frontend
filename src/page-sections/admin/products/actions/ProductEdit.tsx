'use client';
import React from 'react'
import ProductForm from '../../../../components/product/ProductForm';
import { useParams, useRouter } from 'next/navigation';
import { IProduct } from '@/interfaces/Product';
import NavbarComponent from '@/components/principal/NavbarComponent';
import { Box, Grid } from '@mui/material';
import ProductDetailsEdit from '@/components/product/ProductDetailAndEdit';
import LeftSideAdmin from '@/components/admin/LeftSideAdmin';

const ProductEditPageSection = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const handleSuccess = (product: IProduct) => {
    // Mostrar mensaje de éxito o redirigir
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
          <ProductDetailsEdit
            productId={productId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </Grid>
      </Grid>
    </>
    
  );
}

export default ProductEditPageSection
