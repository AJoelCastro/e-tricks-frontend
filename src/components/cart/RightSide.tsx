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
import SelectableAddressCard from '../addresses/SelectableAddressCard';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { LucideArrowLeft } from 'lucide-react';
import { Snackbar, Alert } from '@mui/material';
import { useAuth } from '@clerk/nextjs';
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
            await getCartItems();
            setIsLoading(false);
            handleShowSnackbar("Producto eliminado del carrito", 'success');
            handleClose();
        } catch (error) {
            handleShowSnackbar("Error al eliminar el producto", 'error');
        }
    };


    //datos propios
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [etapa, setEtapa] = useState<number>(0);
    const [carrito, setCarrito] = useState<Array<ICartItem>>([]);
    const [addresses, setAddresses] = useState<Array<IAddress>>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({ open: false, message: '', severity: 'info' });
    const [deliveryType, setDeliveryType] = useState<'pickup' | 'address' | null>(null);
    const { getToken } = useAuth();

    const getCartItems = async()=>{
        try {
            setIsLoading(true)
            const token = await getToken();
            const rawCart = await UserService.getCartItems(token as string); // tu array original
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
        } finally {
            setIsLoading(false);
        }
    }
    const getAddresses = async()=>{
        try {
            const token = await getToken();
            const dataAddresses = await UserService.getAddresses(token as string)
            setAddresses(dataAddresses)
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        getCartItems()
        getAddresses()
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
            switch (etapa) {
                case 0:
                    if (carrito.length !== 0) {
                        setEtapa(etapa + 1);
                    } 
                    break;
                case 1:
                    if (selectedAddressId) {
                        setEtapa(etapa + 1);
                    }else{
                        handleShowSnackbar("Por favor, selecciona una dirección de entrega", 'warning');
                        return;
                    }
                    break;
                case 2:
                    // aqui va la logica de pago
                    break;
                default:
                    break;
            }
        } catch (error) {
            throw error
        }
    }

    const handleContinueByWhatsApp = () => {
        const carritoTexto = carrito.map((item, index) => {
            const nombre = item.product.name;
            const cantidad = item.quantity;
            const talla = item.size;
            const precioFinal = (item.product.price - (item.product.price * (item.product.descuento || 0) / 100)).toFixed(2);
            const subtotal = (Number(precioFinal) * item.quantity).toFixed(2);
            const linkProducto = `https://tusitioweb.com/product/${item.product._id}`;
            const imagen = item.product.images[0];

            return `🛍️ *${nombre}*\n🔗 ${linkProducto}\n📸 ${imagen}\n📏 Talla: ${talla} | Cant: ${cantidad}\n💵 Subtotal: S/ ${subtotal}\n`;
        }).join('\n');

        const total = carrito.reduce((sum, item) => {
            const descuento = item.product.descuento ? (item.product.price * item.product.descuento) / 100 : 0;
            return sum + (item.product.price - descuento) * item.quantity;
        }, 0).toFixed(2);

        const metodoEntrega = selectedAddressId === 'pickup'
            ? '📦 Recojo en tienda (Av. Principal 123, Trujillo)'
            : (() => {
                const selected = addresses.find(a => a._id === selectedAddressId);
                if (!selected) return '📍 Dirección no especificada';
                return `📍 Entrega a: ${selected.name} - ${selected.street} ${selected.number}, ${selected.city}, ${selected.state}`;
            })();

        const mensaje = `👋 ¡Hola! Quisiera hacer un pedido:\n\n${carritoTexto}\n${metodoEntrega}\n\n💰 *Total: S/ ${total}*\n\n🛒 Gracias, quedo atento(a).`;

        const urlWhatsApp = `https://wa.me/51969742589?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');
    };
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
                        <IconButton onClick={() => setEtapa(etapa - 1)} disabled={etapa === 0} sx={{ mb: 1 }}>
                            <LucideArrowLeft color='#7950f2'/>
                        </IconButton>
                        <CartProgress activeStep={etapa}/>
                        {
                            etapa===0?(
                                !carrito || carrito.length === 0 ?(
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  height: '100%' }}>
                                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                                <ShoppingCartOutlinedIcon sx={{ fontSize: 64, color: 'grey.500', mb: 2 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    ¡Tu carrito está vacío!
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Aún no has agregado ningún producto. Explora nuestras categorías y descubre lo que tenemos para ti.
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                component={Link}
                                                href="/"
                                            >
                                                Ir a comprar
                                            </Button>
                                        </Box>
                                ):(
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
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Link href={`/marcas/${item.product.marca.toLowerCase()}`}>
                                                        <Typography variant='marcaCard'  sx={{ color: 'text.primary'}}>
                                                            {item.product.marca}
                                                        </Typography>
                                                    </Link>
                                                    <Link href={`/product/${item.product._id}`}>
                                                        <Typography variant='nameCard' sx={{ color: 'text.primary'  }}>
                                                            {item.product.name }
                                                        </Typography>
                                                    </Link>
                                                    <Typography fontSize={11} sx={{ color: 'text.secondary', fontWeight:'bold',  }}>
                                                        Talla: {item.size} US
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid sx={{ display:'flex', justifyContent:'start', alignItems:'center' }} size={{xs:3, sm:4, md:3}}>
                                                {item.product.descuento ? (
                                                    <Box>
                                                        <Grid container spacing={1} alignItems="center">
                                                            <Grid >
                                                            <Typography variant="priceCard" sx={{ color: 'text.primary' }}>
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
                                                    <Typography variant="priceCard" sx={{ color: 'text.primary', mt: 2 }}>
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
                                )
                                
                            ):
                            etapa===1?(
                                <Grid container spacing={1}>
                                    <Grid size={{xs:12, sm:12, md:12}}>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                            ¿Cómo deseas recibir tu pedido?
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{xs:12, sm:12, md:6}}>
                                                <Button
                                                    fullWidth
                                                    variant={deliveryType === 'pickup' ? 'contained' : 'outlined'}
                                                    color="primary"
                                                    onClick={() => {
                                                        setDeliveryType('pickup');
                                                        setSelectedAddressId('pickup');
                                                    }}
                                                >
                                                    Recojo en tienda
                                                </Button>
                                            </Grid>
                                            <Grid size={{xs:12, sm:12, md:6}}>
                                                <Button
                                                    fullWidth
                                                    variant={deliveryType === 'address' ? 'contained' : 'outlined'}
                                                    color="primary"
                                                    onClick={() => {
                                                        setDeliveryType('address');
                                                        setSelectedAddressId(null); // reset para obligar selección
                                                    }}
                                                >
                                                    Entrega a domicilio
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {deliveryType === 'address' && (
                                        <>
                                            {addresses.length === 0 ? 
                                                (
                                                    <Grid size={12}>
                                                        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                                                            🙁 Aún no tienes direcciones guardadas.
                                                            <br />
                                                            Puedes agregar una desde tu{' '}
                                                            <Link href="/addresses" style={{ color: '#1976d2', textDecoration: 'underline' }}>
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
                                                                onSelect={() => setSelectedAddressId(address._id??null)}
                                                            />
                                                        </Grid>  
                                                    ))
                                                )
                                            }
                                        </>
                                    )}
                                    {/* Recojo en tienda */}
                                    {deliveryType === 'pickup' && (
                                        <Grid size={{xs:12, sm:12, md:6}}>
                                            <SelectableAddressCard
                                                address={{
                                                    _id: 'pickup',
                                                    name: 'Recojo en tienda',
                                                    street: 'Av. Principal',
                                                    number: '123',
                                                    city: 'Trujillo',
                                                    state: 'La Libertad',
                                                    zipCode: '13001',
                                                    country: 'Perú',
                                                    phone: '000000000',
                                                }}
                                                selected={selectedAddressId === 'pickup'}
                                                onSelect={() => setSelectedAddressId('pickup')}
                                            />
                                        </Grid>
                                    )}
                                </Grid>  
                            ):(
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 2 }}>¿Cómo deseas finalizar tu compra?</Typography>

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        onClick={handleContinueByWhatsApp}
                                    >
                                        Finalizar por WhatsApp
                                    </Button>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color="primary"
                                        onClick={() => {/* lógica de pago en la web */}}
                                    >
                                        Pagar con tarjeta (Web)
                                    </Button>
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
                            {
                                carrito.length > 0 && (
                                    <>
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

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            sx={{ mt: 3, borderRadius: 2, mb:{xs:4, sm:2, md:0} }}
                                            onClick={handleChangeEtapa}
                                        >
                                            Continuar compra
                                        </Button>
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

export default RightSideCart