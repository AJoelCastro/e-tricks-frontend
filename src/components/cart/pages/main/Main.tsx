import RightSideCart from '@/components/cart/pages/main/RightSide'
import LeftSide from '@/components/favorites/LeftSide'
import { Grid } from '@mui/material'
import React from 'react'

const MainCart = () => {
  return (
    <>
      <div className='h-16'></div>
      <Grid container spacing={1} sx={{minHeight:'100vh'}}>
        <Grid size={{
          xs:12, sm:5, md:3
        }}>
          <LeftSide/>
        </Grid>
        <Grid size={{
          xs:12, sm:7, md:9
        }}>
          <RightSideCart/>
        </Grid>
      </Grid>
    </>
  )
}

export default MainCart
