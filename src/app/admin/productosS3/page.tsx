import React from 'react'
import { Metadata } from 'next';
import MainProductS3PageSection from '@/page-sections/admin/productS3/Main';

export const metadata: Metadata ={
  title: 'Admin | Productos S3 | Tricks',
}
const ProductosS3Page = () => {

    return (
        <>
            <MainProductS3PageSection/>
        </>
    )
}

export default ProductosS3Page
