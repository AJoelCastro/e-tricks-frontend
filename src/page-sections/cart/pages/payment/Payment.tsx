import { Grid } from '@mui/material'
import React from 'react'
import RightSidePayment from './RightSide'
import NavBarCart from '../../../../components/cart/NavBarCart'
const MainPayment = () => {
  return (
    <>
      <NavBarCart/>
      <Grid container sx={{minHeight:'100vh', display:'flex', justifyContent:'center'}}>
        <Grid size={{
          xs:12, sm:11, md:10
        }}>
          <RightSidePayment/>
        </Grid>
      </Grid>
    </>
  )
}

export default MainPayment
