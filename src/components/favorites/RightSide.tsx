import UserService from '@/services/UserService'
import { Box, Button, CircularProgress, Grid, Typography, Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Select,
  useMediaQuery,
  ListItem,
  List, } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import ProductCard from '../cards/Products';
import { useAuth } from '@clerk/nextjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
const RightSide = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [favorites, setFavorites] = useState([]);
    const { getToken } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            await UserService.removeFavorite(token as string,id)
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
            <Grid container sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 2,
                marginX: 2,
                marginBottom: 4,
                mt:{xs:0, sm:1, md:3}
            }}>
                <Grid  size={{xs:12, sm:12, md:12}} >
                    {isMobile ? (
                        <Accordion elevation={1} sx={{ borderRadius: 2,paddingY: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="priceCard">Filtrar por</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List sx={{ width: '100%' }}>
                                    <ListItem><Button fullWidth><Typography variant="reseniasCard">NOMBRE</Typography></Button></ListItem>
                                    <ListItem><Button fullWidth><Typography variant="reseniasCard">PRECIO</Typography></Button></ListItem>
                                    <ListItem><Button fullWidth><Typography variant="reseniasCard">MARCA</Typography></Button></ListItem>
                                    <ListItem><Button fullWidth><Typography variant="reseniasCard">CATEGORÍA</Typography></Button></ListItem>
                                    <ListItem><Button fullWidth><Typography variant="reseniasCard">TEMPORADA</Typography></Button></ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            paddingX:2,
                            paddingY:1,
                        }}>
                                <Typography variant='reseniasCard'>FILTRAR POR</Typography>
                                <Button onClick={()=>{}}><Typography variant='reseniasCard'>NOMBRE</Typography></Button>
                                <Button onClick={()=>{}}><Typography variant='reseniasCard'>PRECIO</Typography></Button>
                                <Button onClick={()=>{}}><Typography variant='reseniasCard'>MARCA</Typography></Button>
                                <Button onClick={()=>{}}><Typography variant='reseniasCard'>CATEGORÍA</Typography></Button>
                                <Button onClick={()=>{}}><Typography variant='reseniasCard'>TEMPORADA</Typography></Button>
                        </Box>
                    )}
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