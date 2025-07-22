import { Grid } from '@mui/material'
import React from 'react'
import RightSideDelivery from './RightSide'
import NavBarCart from '../../NavBarCart'

const MainDelivery = () => {
  return (
    <>
      <NavBarCart/>
      <Grid container sx={{minHeight:'100vh', display:'flex', justifyContent:'center'}}>
        <Grid size={{
          xs:12, sm:11, md:10
        }}>
          <RightSideDelivery/>
        </Grid>
      </Grid>
    </>
  )
}

export default MainDelivery
