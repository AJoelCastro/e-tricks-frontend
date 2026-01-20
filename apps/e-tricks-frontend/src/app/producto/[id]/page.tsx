'use client';
import MainProductDetail from '@/page-sections/productDetail/Main';
import { useParams } from 'next/navigation';
import React from 'react'

const ProductDetailPage = () => {
    const { id } = useParams()
    return (
        <>
            <MainProductDetail id={id as string}/>
        </>
    )
}

export default ProductDetailPage
