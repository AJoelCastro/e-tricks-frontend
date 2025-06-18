'use client';
import NavbarComponent from '@/page-sections/navbar/NavbarComponent'
import React from 'react'
import FooterComponent from '@/page-sections/footer/FooterComponent';
import { MainFavoritesPageView } from '@/page-sections/favorites/page-view';
const FavoritesPage = () => {
  return (
    <>
      <NavbarComponent/>
      <MainFavoritesPageView/>
      <FooterComponent/>
    </>
  )
}

export default FavoritesPage
