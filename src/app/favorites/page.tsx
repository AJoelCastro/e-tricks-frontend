'use client';
import NavbarComponent from '@/components/navbar/NavbarComponent'
import React from 'react'
import FooterComponent from '@/components/footer/FooterComponent';
import MainFavorites from '@/components/favorites/Main';
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
