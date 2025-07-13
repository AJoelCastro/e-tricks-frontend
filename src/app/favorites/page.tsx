'use client';
import React from 'react'
import NavbarComponent from '@/components/NavbarComponent'
import FooterComponent from '@/components/FooterComponent';
import MainFavorites from '@/page-sections/favorites/Main';
import '../globals.css'

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
