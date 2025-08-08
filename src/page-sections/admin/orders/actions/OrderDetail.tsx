'use client';
import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import NavbarComponent from '@/components/principal/NavbarComponent';
import OrderDetailPageAdmin from './detail/Main';

const OrderDetailPageSection = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;


  return (
    <>
      <NavbarComponent/>
      <OrderDetailPageAdmin id={orderId} />
    </>
    
  );
}

export default OrderDetailPageSection
