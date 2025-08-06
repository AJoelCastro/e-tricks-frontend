import FooterComponent from '@/components/principal/FooterComponent'
import NavbarComponent from '@/components/principal/NavbarComponent'
import { Box } from '@mui/material'
import React from 'react'

const MainAdminPageSection = () => {
  return (
    <>
      <NavbarComponent/>
      <Box sx={{height: '64px'}}/>
      <Box minHeight={'100vh'} >

      </Box>
      <FooterComponent/>
    </>
  )
}

export default MainAdminPageSection
