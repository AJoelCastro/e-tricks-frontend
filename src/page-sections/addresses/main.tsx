import RightSideAddress from '@/components/addresses/RightSide'
import LeftSide from '@/components/favorites/LeftSide'
import FooterComponent from '@/components/FooterComponent'
import NavbarComponent from '@/components/NavbarComponent'
import { Grid } from '@mui/material'
import React from 'react'

const MainAddresses = () => {
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
        <Grid size={{
          xs:12, sm:7, md:9
        }}>
            <RightSideAddress/>
        </Grid>
      </Grid>
      <FooterComponent/>
    </>
  )
}

export default MainAddresses
