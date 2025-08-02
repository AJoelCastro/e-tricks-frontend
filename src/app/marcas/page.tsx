import React from 'react'
import { Metadata } from 'next'
import MainMarcasPageSection from '@/page-sections/categories/MainMarca'

export const metadata: Metadata = {
    title: 'Marcas | Tricks',
}
const MarcasPage = () => {
  return (
    <>
      <MainMarcasPageSection/>
    </>
  )
}

export default MarcasPage
