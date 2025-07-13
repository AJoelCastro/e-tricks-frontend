'use client';
import FooterComponent from '@/components/FooterComponent';
import NavbarComponent from '@/components/NavbarComponent';
import MainProductDetail from '@/page-sections/productDetail/Main';
import React from 'react'

const ProductDetailPage = () => {
  return (
    <>
        <NavbarComponent/>
        <MainProductDetail/>
        <FooterComponent/>
    </>
  )
}

export default ProductDetailPage
