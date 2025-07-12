import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'

const RightSide = () => {

    return (
        <Grid container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 2, marginX: 4, marginBottom: 4, marginTop:2, paddingY: 1 }}>

            <Grid size={{
                sm:12,
                md: 3
            }}
            sx={{paddingX: 4}}
            >
                <Typography variant='h7'>
                    FILTRAR POR
                </Typography>
            </Grid>
            <Grid size={{
                sm:12,
                md: 9
            }}
            sx={{ display:'flex', flexDirection:'row', justifyContent: 'space-between', paddingX:4 }}
            >
                <Button >
                    <Typography variant='h7'>
                        NOMBRE
                    </Typography>
                </Button>
                <Button>
                    <Typography variant='h7'>
                        PRECIO
                    </Typography>
                </Button>
                <Button>
                    <Typography variant='h7'>
                        MARCA
                    </Typography>
                </Button>
                <Button>
                    <Typography variant='h7'>
                        CATEGORIA
                    </Typography>
                </Button>
                <Button>
                    <Typography variant='h7'>
                        TEMPORADA
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    )
}

export default RightSide