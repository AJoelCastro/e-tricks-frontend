'use client';
import React, { useState } from 'react';
import {Box} from '@mui/material';
import { useRouter } from 'next/navigation';
import ProductForm from './Product';
import { IProduct } from '@/interfaces/Product';
import NavbarComponent from '@/components/principal/NavbarComponent';

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
      <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
};

export default ProductRegisterPageSection;