'use client';
import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import NavbarComponent from '@/components/principal/NavbarComponent';
import OrderEditStatusPageSection from '@/page-sections/order/edit/Main';
import OrderDetailPage from '@/page-sections/order/detail/Main';

const OrderDetailPageSection = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;


  return (
    <>
      <NavbarComponent/>
      <OrderDetailPage id={orderId} />
    </>
    
  );
}

export default OrderDetailPageSection
