'use client';
import React, { useState } from 'react';
import {Box} from '@mui/material';
import Product from './Product';
import { useRouter } from 'next/navigation';
import ProductForm from './Product';
import { IProduct } from '@/interfaces/Product';

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
      <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
};

export default ProductRegisterPageSection;