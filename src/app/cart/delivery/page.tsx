'use client';
import { CartProvider } from '@/components/cart/CartContext'
import MainDelivery from '@/components/cart/pages/delivery/Delivery';
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
