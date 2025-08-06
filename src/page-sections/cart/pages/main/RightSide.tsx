'use client';
import { Backdrop, Box, Button, CircularProgress, Fade, Grid, IconButton, Menu, MenuItem, Modal, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CartProgress from '../../../../components/cart/Stepper';
import Image from 'next/image';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SelectableAddressard from '../../../../components/addresses/SelectableAddressCard';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { LucideArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import EmptyCartComponent from '@/components/not-found/EmptyCartComponent';
import ErrorNotification from '@/components/ErrorNotification';
import { useProductLogic } from '@/hooks/useProductLogic';
import { useCart } from '../../CartContext';
import ProtectionConsumer from '@/components/cart/ProtectionConsumer';
import UserService from '@/services/UserService';
import { useAuth } from '@clerk/nextjs';

const RightSideCart = () => {
    const {
        notification,
        closeNotification,
        showError,
        showSuccess,
        handleRemoveFromCart,
        loading: productLoading
    } = useProductLogic();

    const [menuAnchor, setMenuAnchor] = useState<{
        anchor: HTMLElement | null;
        itemId: string | null;
    }>({ anchor: null, itemId: null });
    const [isRemoving, setIsRemoving] = useState<boolean>(false);

    // Context del carrito con las nuevas funciones
    const { 
        carrito, 
        setCarrito, 
        refreshCartItems, // Usar refreshCartItems en lugar de getCartItems
        isLoading,
        dataLoaded 
    } = useCart();
    
    const router = useRouter();
    const pathname = usePathname();
    const { getToken } = useAuth();
    const open = Boolean(menuAnchor.anchor);

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
            setIsRemoving(true);
            if (!menuAnchor.itemId) return;
            
            await handleRemoveFromCart(menuAnchor.itemId);
            
            // Actualizar el estado local del carrito
            setCarrito(prev => prev.filter(item => item._id !== menuAnchor.itemId));
            
            showSuccess("Producto eliminado del carrito");
            handleClose();
        } catch (error) {
            showError(`Error al eliminar producto: ${error}`);
        } finally {
            setIsRemoving(false);
        }
    };

    const handleChangeQuantity = async(index: number, newQuantity: number, productId: string) => {
        if (newQuantity < 1 || newQuantity > 12) return;

        try {
            const token = await getToken();
            const quantityUpdated = await UserService.updateQuantityCartItem(token as string, productId, newQuantity);
            console.log(quantityUpdated);
        } catch (error) {
            throw error
        }

        setCarrito(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                quantity: newQuantity,
            };
            return updated;
        });
    };

    const handleChangeEtapa = async () => {
        try {
            if (carrito.length === 0) {
                showError("Tu carrito está vacío");
                return;
            }
            router.push('/carrito/delivery');
        } catch (error) {
            showError(`${error}`);
        }
    }

    // Efecto que se ejecuta solo en la ruta del carrito y solo si no se han cargado los datos
    useEffect(() => {
        if (pathname === '/carrito') {
            refreshCartItems();
        }
    }, []);

    // Mostrar loading solo si estamos cargando y no tenemos datos del carrito
    if (isLoading && !dataLoaded.cart) {
        return (
            <Grid size={{
                xs: 12, sm: 12, md: 12
            }}
                sx={{ textAlign: 'center', mt: 4 }}
            >
                <CircularProgress />
            </Grid>
        )
    }

    return (
        <Box>
            <Grid container sx={{ marginX: 2, marginBottom: 4, mt: { xs: 0, sm: 2, md: 2 }, paddingY: 1 }} spacing={2}>
                <>
                    <Grid
                        size={{
                            xs: 12,
                            sm: 12,
                            md: 8
                        }}
                        sx={{ paddingX: 2, backgroundColor: 'white', borderRadius: 2, paddingTop: 2, paddingBottom: 2 }}
                    >
                        <CartProgress activeStep={0} />
                        {
                            !carrito || carrito.length === 0 ? (
                                <EmptyCartComponent />
                            ) : (
                                carrito.map((item, index) => (
                                    <Grid
                                        container
                                        key={item._id}
                                        sx={{ marginY: 2 }}
                                    >
                                        <Grid size={{ xs: 3, sm: 4, md: 2 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image
                                                src={item.product.images[0]}
                                                alt="principal"
                                                width={80}
                                                height={80}
                                                style={{ objectFit: 'contain', borderRadius: 4 }}
                                            />
                                        </Grid>
                                        <Grid sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }} size={{ xs: 6, sm: 4, md: 4 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Link href={`/marcas/${item.product.brand.name.toLowerCase()}`}>
                                                    <Typography variant='marcaCard' sx={{ color: 'text.primary' }}>
                                                        {item.product.brand.name}
                                                    </Typography>
                                                </Link>
                                                <Link href={`/producto/${item.product._id}`}>
                                                    <Typography variant='nameCard' sx={{ color: 'text.primary' }}>
                                                        {item.product.name}
                                                    </Typography>
                                                </Link>
                                                <Typography fontSize={11} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                                    Talla: {item.size} US
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }} size={{ xs: 3, sm: 4, md: 3 }}>
                                            {item.product.descuento ? (
                                                <Box>
                                                    <Grid container spacing={1} alignItems="center">
                                                        <Grid>
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
                                                            mt: { xs: 1, sm: 0, md: 0 }
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
                                        <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ml: { xs: 2, sm: 6, md: 0 }, mt: { xs: 1, sm: 0, md: 0 } }} size={{ xs: 5, sm: 4, md: 3 }}>
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
                                                        onClick={() => handleChangeQuantity(index, item.quantity - 1, item._id)}
                                                    >
                                                        -
                                                    </Button>
                                                    <Typography sx={{ mx: 1 }}>
                                                        {item.quantity}
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        sx={{ minWidth: 0, padding: '2px 8px' }}
                                                        onClick={() => handleChangeQuantity(index, item.quantity + 1, item._id)}
                                                    >
                                                        +
                                                    </Button>
                                                </Box>
                                                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                                                    MÁXIMO 12 UNIDADES
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <IconButton
                                                    id="lock-button"
                                                    aria-haspopup="listbox"
                                                    aria-controls="lock-menu"
                                                    aria-label="when device is locked"
                                                    aria-expanded={open ? 'true' : undefined}
                                                    onClick={(e) => handleClickListItem(e, item._id)}
                                                    disabled={isRemoving}
                                                    sx={{
                                                        borderRadius: '50%',
                                                        padding: 1,
                                                        '&:hover': {
                                                            backgroundColor: '#e0e0e0',
                                                        },
                                                    }}
                                                >
                                                    {isRemoving && menuAnchor.itemId === item._id ? (
                                                        <CircularProgress size={20} />
                                                    ) : (
                                                        <MoreVertIcon
                                                            sx={{
                                                                color: menuAnchor.itemId === item._id && Boolean(menuAnchor.anchor) ? 'primary.main' : 'inherit',
                                                            }}
                                                        />
                                                    )}
                                                </IconButton>
                                                <Menu
                                                    anchorEl={menuAnchor.anchor}
                                                    open={menuAnchor.itemId === item._id}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem onClick={handleMenuItemClick} disabled={isRemoving}>
                                                        <Typography variant="body2">
                                                            {isRemoving ? 'Eliminando...' : 'Eliminar'}
                                                        </Typography>
                                                    </MenuItem>
                                                </Menu>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                ))
                            )
                        }
                    </Grid>
                    <Grid size={{
                        xs: 12,
                        sm: 12,
                        md: 4
                    }}
                        sx={{ paddingX: 2, backgroundColor: 'white', borderRadius: 2, paddingTop: 2 }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                            <Typography variant='h7'>
                                DETALLES DE LA COMPRA
                            </Typography>
                        </Box>
                        <Box sx={{ px: 1, marginBottom:3 }}>
                            {carrito.length > 0 && (
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h7">Productos ({carrito.length})</Typography>
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
                                        sx={{ mt: 3, borderRadius: 2, mb: { xs: 4, sm: 2, md: 0 } }}
                                        onClick={handleChangeEtapa}
                                    >
                                        <Typography variant="h7">
                                            Continuar compra
                                        </Typography>
                                    </Button>
                                    <ProtectionConsumer/>
                                </>
                            )}
                        </Box>
                    </Grid>
                </>
            </Grid>

            <ErrorNotification
                open={notification.open}
                onClose={closeNotification}
                message={notification.message}
                type={notification.type}
                autoHideDuration={3000}
            />
        </Box>
    )
}

export default RightSideCart