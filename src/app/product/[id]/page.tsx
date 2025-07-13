'use client';
import FooterComponent from '@/components/FooterComponent';
import NavbarComponent from '@/components/NavbarComponent';
import MainProductDetail from '@/page-sections/productDetail/Main';
import { useParams } from 'next/navigation';
import React from 'react'

const ProductDetailPage = () => {
    const { id } = useParams()
    return (
        <>
            <NavbarComponent/>
            <MainProductDetail id={id as string}/>
            <FooterComponent/>
        </>
    )
}

export default ProductDetailPage
