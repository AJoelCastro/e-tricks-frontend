import UserService from '@/services/UserService'
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import ProductCard from '../cards/Products';
import CartProgress from './Stepper';
import { ICartItem } from '@/interfaces/CartItem';
import ProductService from '@/services/ProductService';
import Image from 'next/image';

const RightSideCart = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [etapa, setEtapa] = useState<number>(0);
    const [carrito, setCarrito] = useState<Array<ICartItem>>([]);
    
    const getCartItems = async()=>{
        try {
            setIsLoading(true)
            const rawCart = await UserService.getCartItems(); // tu array original
            const cartWithProducts = await Promise.all(
            rawCart.map(async (item ) => {
                const product = await ProductService.GetProductById(item.productId);
                return {
                    ...item,
                    product,
                };
            })
            );
            console.log(cartWithProducts)
            setCarrito(cartWithProducts); // carrito con datos completos
            setIsLoading(false);
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
                        <>
                            <Grid 
                                size={{
                                    xs:12,
                                    sm:12,
                                    md:7.5
                                }}
                                sx={{paddingX: 2, backgroundColor:'white',borderRadius: 2, paddingTop:2}}
                            >
                                <CartProgress activeStep={etapa}/>
                                {carrito.map((item) => (
                                    <Grid
                                        container
                                        key={item._id}
                                        sx={{marginY:2}}
                                    >
                                        <Grid size={{xs:3, sm:4, md:2}} sx={{ boxShadow:4, display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'blue'}}>
                                            <Image
                                                src={item.product.images[0]}
                                                alt="principal"
                                                width={80}
                                                height={80}
                                                style={{ objectFit: 'contain', borderRadius:4 }}
                                            />
                                        </Grid>
                                        <Grid sx={{ backgroundColor:'red' }} size={{xs:6, sm:4, md:4}}>
                                            <Typography variant="h6" fontFamily="cursive">
                                                {item.product.name }
                                            </Typography>
                                            <Typography fontSize={14} fontFamily="cursive">
                                                Talla: {item.size} US
                                            </Typography>
                                        </Grid>
                                        <Grid sx={{ backgroundColor:'green' }} size={{xs:3, sm:4, md:3}}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography sx={{ fontWeight: 'bold', fontSize: 18 }}>
                                                S/. {item.product.price}
                                                </Typography>
                                                {item.product.descuento && (
                                                <Box
                                                    sx={{
                                                    backgroundColor: 'red',
                                                    color: 'white',
                                                    px: 1,
                                                    borderRadius: 1,
                                                    fontSize: 12,
                                                    fontWeight: 'bold',
                                                    }}
                                                >
                                                    {item.product.discount}%
                                                </Box>
                                                )}
                                            </Box>
                                            {item.product.discount && (
                                                <Typography
                                                sx={{
                                                    textDecoration: 'line-through',
                                                    color: 'gray',
                                                    fontSize: 14,
                                                    mt: 0.5,
                                                }}
                                                >
                                                S/. {(item.product.price + (item.product.price * item.product.discount) / 100).toFixed(2)}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid sx={{ backgroundColor:'yellow' }} size={{xs:3, sm:4, md:3}}>
                                            <Box
                                                sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                border: '1px solid #dee2e6',
                                                borderRadius: 1,
                                                px: 1,
                                                py: 0.5,
                                                gap: 1,
                                                }}
                                            >
                                                <Button size="small" onClick={() => {/* restar */}}>-</Button>
                                                <Typography>{item.quantity}</Typography>
                                                <Button size="small" onClick={() => {/* aumentar */}}>+</Button>
                                            </Box>
                                            <Typography fontSize={10} sx={{ mt: 0.5 }} color="gray">
                                                MÁXIMO 12 UNIDADES
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))}
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
                        </>
                    )
                }
            </Grid>
        </Box>
        
    )
}

export default RightSideCart