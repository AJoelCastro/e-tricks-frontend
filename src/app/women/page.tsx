import FooterComponent from '@/page-sections/footer/FooterComponent'
import NavbarComponent from '@/page-sections/navbar/NavbarComponent'
import MainWomen from '@/page-sections/women/Main'
import React from 'react'

const WomenPage = () => {
  return (
    <>
      <NavbarComponent/>
      <MainWomen/>
      <FooterComponent/>
    </>
  )
}

export default WomenPage
