'use client';
import { CartProvider } from '@/page-sections/cart/CartContext'
import MainPayment from '@/page-sections/cart/pages/payment/Payment';
import React from 'react'

const PaymentPage = () => {
  return (
    <>
      <CartProvider>
        <MainPayment/>
      </CartProvider>
    </>
  )
}

export default PaymentPage
