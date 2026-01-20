'use client';
import { Grid } from '@mui/material'
import React from 'react'
import OrderDetailPage from '@/page-sections/order/detail/Main';
import { useParams } from 'next/navigation';
import LeftSide from '@/components/favorites/LeftSide';

import NavbarComponent from '@/components/principal/NavbarComponent';
import FooterComponent from '@/components/principal/FooterComponent';

const MainOrderDetailPage = () => {
    const { id } = useParams()
    return (
        <>

            <NavbarComponent />
            <div className='h-16'></div>
            <Grid container spacing={1} sx={{ minHeight: '100vh' }}>
                <Grid size={{
                    xs: 12, sm: 5, md: 3
                }}>
                    <LeftSide />
                </Grid>
                <Grid size={{
                    xs: 12, sm: 7, md: 9
                }}>
                    <OrderDetailPage id={id as string} />
                </Grid>
            </Grid>
            <FooterComponent />

        </>
    )
}

export default MainOrderDetailPage
