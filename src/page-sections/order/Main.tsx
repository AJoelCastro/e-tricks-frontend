import { Grid } from '@mui/material'
import React from 'react'
import RightSideOrder from '../../components/order/RightSide'
import NavbarComponent from '@/components/principal/NavbarComponent'
import FooterComponent from '@/components/principal/FooterComponent'
import LeftSide from '@/components/favorites/LeftSide'

const MainOrder= () => {
  return (
    <>
      <NavbarComponent/>
      <div className='h-16'></div>
      <Grid container spacing={1} sx={{minHeight:'100vh'}}>
        <Grid size={{
          xs:12, sm:5, md:3
        }}>
          <LeftSide />
        </Grid>
        <Grid size={{xs:12, sm:7, md:7 }}>
            <RightSideOrder/>
        </Grid>
         <Grid  size={{ xs:0 ,sm:0, md:3 }} sx={{
          display: { xs: 'none', sm: 'none', md: 'block' }
        }}>
         </Grid>
     
      </Grid>
      <FooterComponent/>
    </>
  )
}

export default  MainOrder
