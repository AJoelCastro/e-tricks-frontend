'use client';
import { usePathname } from 'next/navigation'
import React from 'react'

const EditarProductoPage = () => {
    const pathname = usePathname();
    console.log('paht', pathname)
    return (
        <>
        
        </>
    )
}

export default EditarProductoPage
