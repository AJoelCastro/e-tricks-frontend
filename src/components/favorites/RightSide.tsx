import UserService from '@/services/UserService'
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import ProductCard from '../cards/Products';
import { useAuth } from '@clerk/nextjs';

const RightSide = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [favorites, setFavorites] = useState([]);
    const { getToken } = useAuth();

    const getFavorites = async() =>{
        try {
            setIsLoading(true)
            const token = await getToken();
            const dataFavorites = await UserService.getFavorites(token as string)
            setFavorites(dataFavorites)
        } catch (error) {
            throw error
        }finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        getFavorites()
    }, [])
   
    const handleRemoveFavorite = useCallback(
      async (id:string) => {
        try {
            const token = await getToken();
            const dataRemove = await UserService.removeFavorite(token as string,id)
            console.log("data r", dataRemove)
            getFavorites()
        } catch (error) {
            throw error
        }
      },
      [],
    )
    if(isLoading){
        return(
            <Grid size={{
                xs: 12, sm: 12, md: 12
            }} 
            sx={{ textAlign: 'center', mt: 4 }}
            >
                <CircularProgress/>
            </Grid>
        )
    }    
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
                sx={{ display:'flex', flexDirection:'row', justifyContent: 'space-between', paddingX:4,flexWrap: 'wrap', }}
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
                    favorites.length === 0 ? (
                        <Grid size={{
                                    xs: 12, sm: 12, md: 12
                            }} 
                            sx={{ textAlign: 'center', mt: 4 }}
                        >
                            <Typography variant="h4" sx={{ color: 'text.secondary' }}>
                                Tu lista de favoritos está vacía 💔
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                                Agrega productos a favoritos y aparecerán aquí.
                            </Typography>
                        </Grid>
                    ) : (
                        favorites.map((favorite, idx) => (
                            <Grid
                                key={idx}
                                size={{
                                    xs: 12, sm: 6, md: 4
                                }}
                            >
                                <ProductCard
                                    products={favorite}
                                    markedFavorite={true}
                                    handleRemoveFavorite={handleRemoveFavorite}
                                    show
                                />
                            </Grid>
                        ))
                    )
                }
            </Grid>
        </Box>
        
    )
}

export default RightSide