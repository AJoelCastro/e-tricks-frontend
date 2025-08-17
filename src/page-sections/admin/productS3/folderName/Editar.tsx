import EditFolderComponent from '@/components/admin/AwsS3Productos/EditarFolderS3'
import LeftSideAdmin from '@/components/admin/LeftSideAdmin'
import NavbarComponent from '@/components/principal/NavbarComponent'
import { Box, Grid } from '@mui/material'
import React from 'react'

const EditarFolderS3PageSection = () => {
  return (
    <>
        <NavbarComponent />
        <Box sx={{ height: '64px' }} />
        <Grid container spacing={1} sx={{ minHeight: '100vh' }}>
            <Grid size={{ xs: 12, sm: 5, md: 3 }}>
            <LeftSideAdmin />
            </Grid>
            <Grid size={{ xs: 12, sm: 7, md: 9 }}>
                <EditFolderComponent/>
            </Grid>
        </Grid>
    </>
  )
}

export default EditarFolderS3PageSection
