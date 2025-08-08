'use client';
import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import NavbarComponent from '@/components/principal/NavbarComponent';
import OrderDetailPageAdmin from './detail/Main';
import { Box } from '@mui/material';

const OrderDetailPageSection = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;


  return (
    <>
      <NavbarComponent/>
      <Box sx={{height: '64px'}}/>
      <OrderDetailPageAdmin id={orderId} />
    </>
    
  );
}

export default OrderDetailPageSection
