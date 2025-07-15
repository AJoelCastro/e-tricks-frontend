import UserService from '@/services/UserService'
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import ProductCard from '../cards/Products';
import CartProgress from './Stepper';

const RightSideCart = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [etapa, setEtapa] = useState<number>(0);
    
    const getCartItems = async()=>{
        try {
            const dataCart = await UserService.getCartItems();
            console.log(dataCart)
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        getCartItems()
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
            <Grid container sx={{ marginX: 2, marginBottom: 4, marginTop:2, paddingY: 1 }} spacing={2}>
                <Grid size={{
                    xs:12,
                    sm:12,
                    md:7.5
                }}
                sx={{paddingX: 2, backgroundColor:'white',borderRadius: 2, paddingTop:2}}
                >
                    <CartProgress activeStep={etapa}/>
                </Grid>
                <Grid size={{
                    xs:12,
                    sm:12,
                    md:4.5
                }}
                sx={{ paddingX:2, backgroundColor:'white',borderRadius: 2, paddingTop:2 }}
                >
                    <Box sx={{display:'flex', justifyContent:'center'}}>
                        <Typography variant='h6'>
                            DETALLES DE LA COMPRA
                        </Typography>
                    </Box>
                    
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