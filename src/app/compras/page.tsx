import MainOrder from '@/page-sections/order/Main'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mis compras | Tricks',
}
const ComprasPage = () => {
  return (
    <>
      <MainOrder/>
    </>
  )
}

export default ComprasPage
