'use client';
import NavbarComponent from '@/components/NavbarComponent'
import React from 'react'
import '../globals.css'
import FooterComponent from '@/components/FooterComponent';
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
