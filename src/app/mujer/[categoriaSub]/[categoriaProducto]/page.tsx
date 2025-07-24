import FooterComponent from '@/components/FooterComponent'
import NavbarComponent from '@/components/NavbarComponent'
import ProductCategoryPageSection from '@/page-sections/category/ProductCategoryPageSection'
import React from 'react'

const ProductCategoryPage = () => {
  return (
    <>
      <NavbarComponent/>
      <ProductCategoryPageSection/>
      <FooterComponent/>
    </>
  )
}

export default ProductCategoryPage
