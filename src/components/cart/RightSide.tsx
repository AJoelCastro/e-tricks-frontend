import UserService from '@/services/UserService'
import { Box, Button, CircularProgress, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import CartProgress from './Stepper';
import { ICartItem } from '@/interfaces/CartItem';
import ProductService from '@/services/ProductService';
import Image from 'next/image';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IAddress } from '@/interfaces/Address';
import AddressCard from '../addresses/AddressCard';
import SelectableAddressCard from '../addresses/SelectableAddressCard';


const RightSideCart = () => {

    //datos del menu list 
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [menuAnchor, setMenuAnchor] = useState<{
        anchor: HTMLElement | null;
        itemId: string | null;
    }>({ anchor: null, itemId: null });
    const open = Boolean(anchorEl);
    const handleClickListItem = (event: React.MouseEvent<HTMLElement>, itemId: string) => {
        setMenuAnchor({
            anchor: event.currentTarget,
            itemId,
        });
    };

    const handleClose = () => {
        setMenuAnchor({ anchor: null, itemId: null });
    };

    const handleMenuItemClick = async () => {
        try {
            setIsLoading(true);
            if (!menuAnchor.itemId) return;
            const dataRemove = await UserService.removeCartItem(menuAnchor.itemId);
            console.log(dataRemove)
            await getCartItems();
            setIsLoading(false);
            handleClose();
        } catch (error) {
            throw error;
        }
    };

    //datos propios
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [etapa, setEtapa] = useState<number>(0);
    const [carrito, setCarrito] = useState<Array<ICartItem>>([]);
    const [addresses, setAddresses] = useState<Array<IAddress>>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const getCartItems = async()=>{
        try {
            const rawCart = await UserService.getCartItems(); // tu array original
            const cartWithProducts = await Promise.all(
            rawCart.map(async (item:ICartItem ) => {
                const product = await ProductService.GetProductById(item.productId);
                return {
                    ...item,
                    product,
                };
            })
            );
            setCarrito(cartWithProducts); // carrito con datos completos
        } catch (error) {
            throw error
        }
    }
    const getAddresses = async()=>{
        try {
            const dataAddresses = await UserService.getAddresses()
            setAddresses(dataAddresses)
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        setIsLoading(true)
        getCartItems()
        getAddresses()
        setIsLoading(false);
    }, [])
   
    // const handleRemoveFavorite = useCallback(
    //   async (id:string) => {
    //     try {
            
    //     } catch (error) {
    //         throw error
    //     }
    //   },
    //   [],
    // )
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
    const handleChangeEtapa = async()=>{
        try {
            setEtapa(etapa+1)
        } catch (error) {
            throw error
        }
    }

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
            <Grid container sx={{ marginX: 2, marginBottom: 4, marginTop:2, paddingY: 1 }} spacing={2}>
                <>
                    <Grid 
                        size={{
                            xs:12,
                            sm:12,
                            md:7.5
                        }}
                        sx={{paddingX: 2, backgroundColor:'white',borderRadius: 2, paddingTop:2, paddingBottom:2}}
                    >
                        <CartProgress activeStep={etapa}/>
                        {
                            etapa===0?(
                                carrito.map((item, index) => (
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
                                        <Grid sx={{ display:'flex', justifyContent:'start', alignItems:'center' }} size={{xs:6, sm:4, md:4}}>
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
                                        <Grid sx={{ display:'flex', justifyContent:'start', alignItems:'center' }} size={{xs:3, sm:4, md:3}}>
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
                                        <Grid sx={{ display:'flex', justifyContent:'center', alignItems:'center', ml:{xs:2, sm:6, md:0}, mt:{xs:1, sm:0, md:0} }} size={{xs:5, sm:4, md:3}}>
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
                                                    onClick={(e) => handleClickListItem(e, item._id)}
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
                                                            color: menuAnchor.itemId === item._id && Boolean(menuAnchor.anchor) ? 'primary.main' : 'inherit',
                                                        }}
                                                    />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={menuAnchor.anchor}
                                                    open={menuAnchor.itemId === item._id}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem onClick={handleMenuItemClick}>
                                                        <Typography variant="body2">Eliminar</Typography>
                                                    </MenuItem>
                                                </Menu>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                ))
                            ):
                            etapa===1?(
                                <Grid container spacing={1}>
                                    {addresses.map((address)=>(
                                        <Grid key={address._id} size={{xs:12, sm:12, md:6}}>
                                            <SelectableAddressCard
                                                address={address}
                                                selected={selectedAddressId === address._id}
                                                onSelect={() => setSelectedAddressId(address._id??null)}
                                            />
                                        </Grid>  
                                    ))}
                                </Grid>  
                            ):(
                                <Box>
                                    <Typography>B</Typography>
                                </Box>
                            )
                        }
                        
                    </Grid>
                    <Grid size={{
                        xs:12,
                        sm:12,
                        md:4.5
                    }}
                    sx={{ paddingX:2, backgroundColor:'white',borderRadius: 2, paddingTop:2 }}
                    >
                        <Box sx={{display:'flex', justifyContent:'center', mb: 4}}>
                            <Typography variant='h6'>
                                DETALLES DE LA COMPRA
                            </Typography>
                        </Box>
                        <Box sx={{ px: 1 }}>
                            {/* Subtotal */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1" fontWeight="medium">Subtotal</Typography>
                                <Typography variant="body1">
                                    S/ {
                                    carrito.reduce((sum, item) => {
                                        const precioUnitario = item.product.descuento
                                        ? item.product.price
                                        : item.product.price;
                                        return sum + precioUnitario * item.quantity;
                                    }, 0).toFixed(2)
                                    }
                                </Typography>
                            </Box>

                            {/* Descuento Total */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1" fontWeight="medium">Descuentos</Typography>
                                <Typography variant="body1" color="error">
                                    - S/ {
                                    carrito.reduce((sum, item) => {
                                        if (item.product.descuento) {
                                        const descuento = (item.product.price * item.product.descuento) / 100;
                                        return sum + descuento * item.quantity;
                                        }
                                        return sum;
                                    }, 0).toFixed(2)
                                    }
                                </Typography>
                            </Box>

                            {/* Total */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, py: 1, borderTop: '1px solid #e0e0e0' }}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6">
                                    S/ {
                                    carrito.reduce((sum, item) => {
                                        const descuento = item.product.descuento
                                        ? (item.product.price * item.product.descuento) / 100
                                        : 0;
                                        return sum + (item.product.price - descuento) * item.quantity;
                                    }, 0).toFixed(2)
                                    }
                                </Typography>
                            </Box>

                            {/* Botón de continuar */}
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 3, borderRadius: 2, mb:{xs:4, sm:2, md:0} }}
                                onClick={handleChangeEtapa}
                            >
                                Continuar compra
                            </Button>
                        </Box>
                    </Grid>
                </>
            </Grid>
        </Box>
        
    )
}

export default RightSideCart