'use client';
import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import NavbarComponent from '@/components/principal/NavbarComponent';
import OrderEditStatusPageSection from '@/page-sections/admin/orders/actions/edit/Main';

const OrderEditPageSection = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;


  return (
    <>
      <NavbarComponent/>
      <OrderEditStatusPageSection id={orderId} />
    </>
    
  );
}

export default OrderEditPageSection
