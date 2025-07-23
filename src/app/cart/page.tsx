'use client';
import MainCart from '@/page-sections/cart/pages/main/Main'
import FooterComponent from '@/components/FooterComponent'
import NavbarComponent from '@/components/NavbarComponent'
import React from 'react'
import { CartProvider } from '@/page-sections/cart/CartContext';

const CartPage = () => {
  return (
    <>
      <NavbarComponent/>
        <CartProvider>
          <MainCart/>
        </CartProvider>
      <FooterComponent/>
    </>
  )
}

export default CartPage
