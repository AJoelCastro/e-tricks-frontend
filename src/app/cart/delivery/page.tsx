'use client';
import { CartProvider } from '@/page-sections/cart/CartContext'
import MainDelivery from '@/page-sections/cart/pages/delivery/Delivery';
import NavbarComponent from '@/components/NavbarComponent';
import React from 'react'

const DeliveryPage = () => {
  return (
    <>
      <CartProvider>
        <MainDelivery/>
      </CartProvider>
    </>
  )
}

export default DeliveryPage
