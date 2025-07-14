import UserService from '@/services/UserService'
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import ProductCard from '../cards/Products';

const RightSideCart = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    useEffect(() => {
    }, [])
   
    const handleRemoveFavorite = useCallback(
      async (id:string) => {
        try {
            
        } catch (error) {
            throw error
        }
      },
      [],
    )
    
    return (
        <Box>
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
            <Grid container sx={{ marginX: 4, marginBottom: 4 }} spacing={3}>
                {
                    isLoading?(
                        <Grid size={{
                            xs: 12, sm: 12, md: 12
                        }} 
                        sx={{ textAlign: 'center', mt: 4 }}
                        >
                            <CircularProgress/>
                        </Grid>
                    ):(
                        <></>
                    )
                }
                
            </Grid>
        </Box>
        
    )
}

export default RightSideCart