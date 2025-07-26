import React from 'react'
import MainFavorites from '@/page-sections/favorites/Main';
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favoritos | Tricks',
}
const FavoritesPage = () => {
  return (
    <>
      <MainFavorites/>
    </>
  )
}

export default FavoritesPage
