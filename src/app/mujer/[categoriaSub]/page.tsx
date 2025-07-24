import FooterComponent from '@/components/FooterComponent'
import NavbarComponent from '@/components/NavbarComponent'
import SubCategoryPageSection from '@/page-sections/category/SubCategoryPageSection'
import React from 'react'

const SubCategoryPage = () => {
  return (
    <>
      <NavbarComponent/>
      <SubCategoryPageSection/>
      <FooterComponent/>
    </>
  )
}

export default SubCategoryPage
