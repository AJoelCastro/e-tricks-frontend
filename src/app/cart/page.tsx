import MainCart from '@/page-sections/cart/Main'
import FooterComponent from '@/page-sections/footer/FooterComponent'
import NavbarComponent from '@/page-sections/navbar/NavbarComponent'
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
