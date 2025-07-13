import UserService from '@/services/UserService'
import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ProductCard from '../cards/Products';

const RightSide = () => {
    const [favorites, setFavorites] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]);
    useEffect(() => {
        const getFavoriteIds = async() =>{
            try {
                const dataFavoriteIds = await UserService.getFavoriteIds()
                setFavoriteIds(dataFavoriteIds)
            } catch (error) {
                throw error
            }
        }
        getFavoriteIds()
    }, [])
    useEffect(() => {
        const getFavorites = async() =>{
            try {
                const dataFavorites = await UserService.getFavorites()
                setFavorites(dataFavorites)

            } catch (error) {
                throw error
            }
        }
        getFavorites()
    }, [])
   

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
            <Grid container sx={{marginX: 4, marginBottom: 4,}} spacing={3}>
                {
                    favorites.map((favorite) => (
                        <Grid key={favorite._id} size={{
                            sm: 6,
                            md: 4
                        }}>
                            {favoriteIds.includes(favorite._id) ? (
                                <ProductCard products={favorite} markedFavorite={true}></ProductCard>
                            ):(
                                <ProductCard products={favorite} markedFavorite={false}></ProductCard>
                            )
                            }
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
        
    )
}

export default RightSide