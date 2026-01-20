import LeftSideAdmin from '@/components/admin/LeftSideAdmin'
import FooterComponent from '@/components/principal/FooterComponent'
import NavbarComponent from '@/components/principal/NavbarComponent'
import { Box, Grid } from '@mui/material'
import React from 'react'

const MainAdminPageSection = () => {
  return (
    <>
      <NavbarComponent/>
      <Box sx={{height: '64px'}}/>
      <Grid container spacing={1} sx={{minHeight:'100vh'}}>
        <Grid size={{
          xs:12, sm:5, md:3
        }}>
          <LeftSideAdmin/>
        </Grid>
        <Grid size={{
          xs:12, sm:7, md:9
        }}>
        </Grid>
      </Grid>
      <FooterComponent/>
    </>
  )
}

export default MainAdminPageSection
