import { MainCartPageView } from '@/page-sections/cart/page-view'
import FooterComponent from '@/page-sections/footer/FooterComponent'
import NavbarComponent from '@/page-sections/navbar/NavbarComponent'
import React from 'react'

const CartPage = () => {
  return (
    <>
      <NavbarComponent/>
      <MainCartPageView/>
      <FooterComponent/>
    </>
  )
}

export default CartPage
