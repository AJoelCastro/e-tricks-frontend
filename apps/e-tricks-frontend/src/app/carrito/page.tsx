import MainCart from '@/page-sections/cart/pages/main/Main'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrito | Tricks',
}
const CartPage = () => {
  return (
    <>
      <MainCart/>
    </>
  )
}

export default CartPage
