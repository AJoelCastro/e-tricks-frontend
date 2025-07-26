import React from 'react'
import { Grid } from '@mui/material'
import LeftSide from '@/components/favorites/LeftSide'
import RightSide from '@/components/favorites/RightSide'
import NavbarComponent from '@/components/NavbarComponent'
import FooterComponent from '@/components/FooterComponent'

const MainFavorites = () => {

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
          <RightSide/>
        </Grid>
      </Grid>
      <FooterComponent/>
    </>
    
  )
}

export default MainFavorites
