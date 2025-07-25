'use client';
import MainCart from '@/page-sections/cart/pages/main/Main'
import FooterComponent from '@/components/FooterComponent'
import NavbarComponent from '@/components/NavbarComponent'
import React from 'react'

const CartPage = () => {
  return (
    <>
      <NavbarComponent/>
          <MainCart/>
      <FooterComponent/>
    </>
  )
}

export default CartPage
