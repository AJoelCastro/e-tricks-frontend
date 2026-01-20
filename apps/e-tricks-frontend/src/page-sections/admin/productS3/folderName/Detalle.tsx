import FolderDetailComponent from '@/components/admin/AwsS3Productos/DetalleFolderS3'
import LeftSideAdmin from '@/components/admin/LeftSideAdmin'
import NavbarComponent from '@/components/principal/NavbarComponent'
import { Box, Grid } from '@mui/material'
import React from 'react'

const DetalleFolderS3PageSection = () => {
  return (
    <>
        <NavbarComponent />
        <Box sx={{ height: '64px' }} />
        <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 5, md: 3 }}>
            <LeftSideAdmin />
            </Grid>
            <Grid size={{ xs: 12, sm: 7, md: 9 }}>
                <FolderDetailComponent/>
            </Grid>
        </Grid>
    </>
  )
}

export default DetalleFolderS3PageSection
