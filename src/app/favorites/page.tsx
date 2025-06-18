'use client';
import NavbarComponent from '@/page-sections/navbar/NavbarComponent'
import React from 'react'
import FooterComponent from '@/page-sections/footer/FooterComponent';
import MainFavorites from '@/page-sections/favorites/Main';
const FavoritesPage = () => {
  return (
    <>
      <NavbarComponent/>
      <MainFavorites/>
      <FooterComponent/>
    </>
  )
}

export default FavoritesPage
