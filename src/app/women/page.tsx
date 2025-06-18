import FooterComponent from '@/page-sections/footer/FooterComponent'
import NavbarComponent from '@/page-sections/navbar/NavbarComponent'
import { MainWomenPageView } from '@/page-sections/women/page-view'
import React from 'react'

const WomenPage = () => {
  return (
    <>
      <NavbarComponent/>
      <MainWomenPageView/>
      <FooterComponent/>
    </>
  )
}

export default WomenPage
