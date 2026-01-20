import React from 'react'
import { Metadata } from 'next';
import MainOrdersPageSection from '@/page-sections/admin/orders/Main';

export const metadata: Metadata ={
  title: 'Admin | Ordenes | Tricks',
}
const OrdenesPage = () => {
  return (
    <MainOrdersPageSection/>
  )
}

export default OrdenesPage
