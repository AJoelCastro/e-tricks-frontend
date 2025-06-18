import MainCart from '@/components/cart/Main'
import FooterComponent from '@/components/footer/FooterComponent'
import NavbarComponent from '@/components/navbar/NavbarComponent'
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
