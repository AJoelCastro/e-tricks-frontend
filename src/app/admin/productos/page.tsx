import MainProductsPageSection from '@/page-sections/admin/products/Main'
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata ={
  title: 'Admin | Productos | Tricks',
}
const ProductosPage = () => {
    
    return (
        <>
            <MainProductsPageSection/>
        </>
    )
}

export default ProductosPage
