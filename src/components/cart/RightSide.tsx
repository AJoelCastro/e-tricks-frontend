import UserService from '@/services/UserService'
import { Box, Button, CircularProgress, Grid, IconButton, List, ListItemButton, ListItemText, Menu, MenuItem, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import CartProgress from './Stepper';
import { ICartItem } from '@/interfaces/CartItem';
import ProductService from '@/services/ProductService';
import Image from 'next/image';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
const options = [
  'Eliminar',
];

const RightSideCart = () => {

    //datos del menu list 
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const open = Boolean(anchorEl);
    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    //datos propios
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
    const handleChangeQuantity = (index: number, newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > 12) return;

        setCarrito(prev => {
            const updated = [...prev];
            updated[index] = {
            ...updated[index],
            quantity: newQuantity,
            };
            return updated;
        });

        // Si quieres persistirlo en la base de datos también:
        // await UserService.updateCartItemQuantity(itemId, newQuantity);
    };

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
                                {carrito.map((item, index) => (
                                    <Grid
                                        container
                                        key={item._id}
                                        sx={{marginY:2}}
                                    >
                                        <Grid size={{xs:3, sm:4, md:2}} sx={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                                            <Image
                                                src={item.product.images[0]}
                                                alt="principal"
                                                width={80}
                                                height={80}
                                                style={{ objectFit: 'contain', borderRadius:4 }}
                                            />
                                        </Grid>
                                        <Grid sx={{ display:'flex', justifyContent:'center', alignItems:'center' }} size={{xs:6, sm:4, md:4}}>
                                            <Box>
                                                <Link href={`/marcas/${item.product.marca.toLowerCase()}`}>
                                                    <Typography fontSize={13}  sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                                        {item.product.marca}
                                                    </Typography>
                                                </Link>
                                                <Link href={`/product/${item.product._id}`}>
                                                    <Typography fontSize={21} sx={{ color: 'text.primary', fontWeight:'bold',  }}>
                                                        {item.product.name }
                                                    </Typography>
                                                </Link>
                                                <Typography fontSize={12} sx={{ color: 'text.primary', fontWeight:'bold',  }}>
                                                    {item.size} US
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid sx={{ display:'flex', justifyContent:'center', alignItems:'center' }} size={{xs:3, sm:4, md:3}}>
                                            {item.product.descuento ? (
                                                <Box>
                                                    <Grid container spacing={1} alignItems="center">
                                                        <Grid >
                                                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                                            S/ {item.product.price}
                                                        </Typography>
                                                        </Grid>
                                                        <Grid sx={{ backgroundColor: 'red', borderRadius: '6px', px: 1 }}>
                                                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            -{item.product.descuento}%
                                                        </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            textDecoration: 'line-through',
                                                            fontSize: '12px',
                                                            mt:{xs:1, sm:0, md:0}
                                                        }}
                                                    >
                                                        S/ {item.product.price + (item.product.price * item.product.descuento) / 100}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="body1" sx={{ color: 'text.primary', mt: 2, fontWeight: 'bold' }}>
                                                S/ {item.product.price}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid sx={{ display:'flex', justifyContent:'center', alignItems:'center', ml:{xs:2, sm:0, md:0}, mt:{xs:1, sm:0, md:0} }} size={{xs:5, sm:4, md:3}}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    border: '1px solid #ccc',
                                                    borderRadius: 2,
                                                    backgroundColor: '#f9f9f9'
                                                }}>
                                                    <Button
                                                        size="small"
                                                        sx={{ minWidth: 0, padding: '4px 8px' }}
                                                        onClick={() => handleChangeQuantity(index, item.quantity - 1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <Typography sx={{ mx: 1 }}>
                                                        {item.quantity}
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        sx={{ minWidth: 0, padding: '2px 8px' }}
                                                        onClick={() => handleChangeQuantity(index, item.quantity + 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </Box>
                                                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                                                    MÁXIMO 12 UNIDADES
                                                </Typography>
                                            </Box>
                                            <Box >
                                                <IconButton
                                                    id="lock-button"
                                                    aria-haspopup="listbox"
                                                    aria-controls="lock-menu"
                                                    aria-label="when device is locked"
                                                    aria-expanded={open ? 'true' : undefined}
                                                    onClick={handleClickListItem}
                                                    sx={{
                                                        borderRadius: '50%',
                                                        padding: 1,
                                                        '&:hover': {
                                                            backgroundColor: '#e0e0e0',
                                                        },
                                                    }}
                                                >
                                                    <MoreVertIcon  
                                                        sx={{
                                                            color: open ? 'primary.main' : 'inherit',
                                                            '&:hover':{
                                                            color: 'primary.main'}
                                                        }}
                                                    />
                                                </IconButton>
                                                <Menu
                                                    id="lock-menu"
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleClose}
                                                    slotProps={{
                                                        list: {
                                                            'aria-labelledby': 'lock-button',
                                                            role: 'listbox',
                                                        },
                                                    }}
                                                >
                                                    {options.map((option, index) => (
                                                        <MenuItem
                                                            key={option}
                                                            selected={index === selectedIndex}
                                                            onClick={(event) => handleMenuItemClick(event, index)}
                                                        >
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </Menu>
                                            </Box>
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