'use client';
import { Box, Button, CircularProgress, Fade, Grid, IconButton, Menu, MenuItem, Modal, Radio, Typography } from '@mui/material'
import React, {  useEffect, useState } from 'react'
import CartProgress from '../../../../components/cart/Stepper';
import { ICartItem } from '@/interfaces/CartItem';
import Link from 'next/link';
import { IAddress } from '@/interfaces/Address';
import SelectableAddressCard from '../../../../components/addresses/SelectableAddressCard';
import { LucideArrowLeft } from 'lucide-react';
import { Snackbar, Alert } from '@mui/material';
import { useAuth } from '@clerk/nextjs';
import { useCart } from '../../CartContext';
import { useRouter } from 'next/navigation';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SelectablePickUpCard from '@/components/addresses/SelectablePickUpCard';
import ProtectionConsumer from '@/components/cart/ProtectionConsumer';

const RightSideDelivery = () => {
    //datos propios
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({ open: false, message: '', severity: 'info' });
   // const [deliveryType, setDeliveryType] = useState<'pickup' | 'address' | null>(null);

    const { getToken } = useAuth();
    const { carrito, addresses, isLoading, etapa,pickUps, setEtapa, setSelectedAddress,selectedAddress,setSelectedPickup,selectedPickup, deliveryType,setDeliveryType} = useCart();
    const router = useRouter();

    const handleChangeEtapa = async()=>{
        try {
            if (selectedAddressId) {
                router.push('/carrito/pagos');
            }else{
                handleShowSnackbar("Por favor, selecciona una dirección de entrega", 'warning');
                return;
            }
        } catch (error) {
            throw error
        }
    }

    const handleShowSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

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
        <Box >
            <Grid container sx={{ marginX: 2, marginBottom: 4, mt:{ xs: 0, sm: 2, md: 2 }, paddingY: 1 }} spacing={2}>
                <>
                    <Grid 
                        size={{
                            xs:12,
                            sm:12,
                            md:8
                        }}
                        sx={{paddingX: 2, backgroundColor:'white',borderRadius: 2, paddingTop:2, paddingBottom:2}}
                    >
                        <IconButton onClick={() => router.back()}  sx={{ mb: 1 }}>
                            <LucideArrowLeft color='#7950f2'/>
                        </IconButton>
                        <CartProgress activeStep={1}/>
                        <Grid container spacing={1}>
                            <Grid size={{xs:12, sm:12, md:12}}>
                                <Grid sx={{mb:2}}>
                                    <Typography variant="leftside" sx={{ mb: 2 }}>
                                        Método de envío
                                    </Typography>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid size={{xs:12, sm:12, md:12}}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, border: deliveryType === 'pickup' ? '2px solid #7950f2' : '1px solid #e0e0e0',borderRadius: 2,p: 2,cursor: 'pointer', }}
                                        onClick={() => setDeliveryType('pickup')}
                                        >
                                            <Radio
                                                checked={deliveryType === 'pickup'}
                                                onChange={() => setDeliveryType('pickup')}
                                                color="primary"
                                            />
                                            <StoreIcon sx={{ color: '#7c3aed', fontSize: 32 }} />
                                            <Typography
                                            >
                                                Recojo en tienda
                                            </Typography>
                                        </Box>
                                        {deliveryType === 'pickup' && (
                                            <Grid container spacing={1} sx={{ mt: 1 }}>
                                                {pickUps.map((pickup) => (
                                                    <Grid key={pickup._id} size={{xs:12, sm:12, md:6}}>
                                                        <SelectablePickUpCard
                                                            address={pickup}
                                                            selected={selectedAddressId === pickup._id}
                                                            onSelect={() => {
                                                                setSelectedPickup(pickup)
                                                                setSelectedAddressId(pickup._id??null)}}
                                                            isPickup
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        )}
                                    </Grid>
                                    <Grid size={{xs:12, sm:12, md:12}}>
                                        <Box 
                                            sx={{ display: 'flex', alignItems: 'center', gap: 2, border: deliveryType === 'address' ? '2px solid #7950f2' : '1px solid #e0e0e0',borderRadius: 2,p: 2,cursor: 'pointer', }}
                                            onClick={() => setDeliveryType('address')}
                                        >
                                            <Radio
                                                checked={deliveryType === 'address'}
                                                onChange={() => setDeliveryType('address')}
                                                color="primary"
                                            />
                                            <LocalShippingIcon sx={{ color: '#7c3aed', fontSize: 32 }} />
                                            <Typography>
                                                Enviar a domicilio
                                            </Typography>
                                        </Box>
                                        {deliveryType === 'address' && (
                                            <Grid container spacing={1} sx={{ mt: 1 }}>
                                                {addresses.length === 0 ? 
                                                    (
                                                        <Grid size={12}>
                                                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                                                                🙁 Aún no tienes direcciones guardadas.
                                                                <br />
                                                                Puedes agregar una desde tu{' '}
                                                                <Link href="/direcciones" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                                                                    sección de direcciones
                                                                </Link>{' '}
                                                                en tu perfil.
                                                            </Typography>
                                                        </Grid>
                                                    ) : (
                                                        addresses.map((address)=>(
                                                            <Grid key={address._id} size={{xs:12, sm:12, md:6}}>
                                                                <SelectableAddressCard
                                                                    address={address}
                                                                    selected={selectedAddressId === address._id}
                                                                    onSelect={() => {
                                                                        setSelectedAddress(address)
                                                                        setSelectedAddressId(address._id??null)}}
                                                                    isPickup={false}
                                                                />
                                                            </Grid>  
                                                        ))
                                                    )
                                                }
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>  
                            
                    </Grid>
                    <Grid size={{
                        xs:12,
                        sm:12,
                        md:4
                    }}
                    sx={{ paddingX:2, backgroundColor:'white',borderRadius: 2, paddingTop:2 }}
                    >
                        <Box sx={{display:'flex', justifyContent:'center', mb: 4}}>
                            <Typography variant='h7'>
                                DETALLES DE LA COMPRA
                            </Typography>
                        </Box>
                        <Box sx={{ px: 1 }}>
                            {/* Subtotal */}
                            {
                                carrito.length > 0 && (
                                    <>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="h7" >Productos ({carrito.length})</Typography>
                                            <Typography variant="h7">
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

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="h7">Descuentos ({carrito.length})</Typography>
                                            <Typography variant="h7" color="error">
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

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, py: 1, borderTop: '1px solid #e0e0e0' }}>
                                            <Typography variant="h7">Total</Typography>
                                            <Typography variant="h7">
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
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            sx={{ mt: 3, borderRadius: 2, mb:{xs:4, sm:2, md:0} }}
                                            onClick={handleChangeEtapa}
                                        >
                                            <Typography variant="h7">
                                                Continuar compra
                                            </Typography>
                                        </Button>
                                        <ProtectionConsumer/>
                                    </>
                                )
                            }
                            
                        </Box>
                    </Grid>
                </>
            </Grid>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
        
    )
}

export default RightSideDelivery