'use client';
import { CartProvider } from '@/components/cart/CartContext'
import MainPayment from '@/components/cart/pages/payment/Payment';
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
