'use client';
import FooterComponent from '@/components/FooterComponent'
import NavbarComponent from '@/components/NavbarComponent'
import { SplashScreen } from '@/components/splash-screen';
import ProductCategoryPageSection from '@/page-sections/category/ProductCategoryPageSection'
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import React from 'react'

const ProductCategoryPage = () => {

  const id = useSelector((state: RootState) => state.category.productCategoryId);
  console.log("categoria",id);
  if(!id) return <SplashScreen/>
  return (
    <>
      <NavbarComponent/>
      <ProductCategoryPageSection id={id!}/>
      <FooterComponent/>
    </>
  )
}

export default ProductCategoryPage
