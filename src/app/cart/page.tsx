'use client';
import MainCart from '@/components/cart/pages/main/Main'
import FooterComponent from '@/components/FooterComponent'
import NavbarComponent from '@/components/NavbarComponent'
import React from 'react'
import { CartProvider } from '@/components/cart/CartContext';

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
