import FooterComponent from '@/components/principal/FooterComponent'
import NavbarComponent from '@/components/principal/NavbarComponent'
import { Box } from '@mui/material'
import React from 'react'

const MainMarcasPageSection = () => {
  return (
    <>
      <NavbarComponent/>
      <div className='h-16'></div>
      <Box sx={{minHeight: '100vh'}}>

      </Box>
      <FooterComponent/>
    </>
  )
}

export default MainMarcasPageSection
