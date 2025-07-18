import UserService from '@/services/UserService'
import { Backdrop, Box, Button, CircularProgress, Fade, Grid, IconButton, Menu, MenuItem, Modal, Typography } from '@mui/material'
import React, {  useEffect, useState } from 'react'
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


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius:2,
  width: { xs: '90%', sm: '70%', md: '50%' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  display:'flex',
  flexDirection: 'column',
  p: 4,
};
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
            const token = await getToken()
            await UserService.removeCartItem(token as string,menuAnchor.itemId);
            await getCartItems();
            handleShowSnackbar("Producto eliminado del carrito", 'success');
            handleClose();
        } catch (error) {
            handleShowSnackbar("Error al eliminar el producto", 'error');
        }finally{
            setIsLoading(false);
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
    const [showModalWebPay, setShowModalWebPay] = useState<boolean>(false);
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

    const handleContinueByWebPay = () => {
        try {
            setShowModalWebPay(true);
        } catch (error) {
            
        }
    };

    const handleShowSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleUploadComprobante = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Aquí subes a tu backend o cloud yape
            console.log('Comprobante subido:', file.name);
        }
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
                                        <Grid sx={{mb:2}}>
                                            <Typography variant="leftside" sx={{ mb: 2 }}>
                                                Método de envío
                                            </Typography>
                                        </Grid>
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
                                                                isPickup={false}
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
                                                isPickup
                                            />
                                        </Grid>
                                    )}
                                </Grid>  
                            ):(
                                <Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="leftside" >Finalizar transacción</Typography>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        onClick={handleContinueByWhatsApp}
                                    >
                                        WhatsApp
                                    </Button>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color="primary"
                                        onClick={handleContinueByWebPay}
                                    >
                                        Web
                                    </Button>
                                </Box>
                            )
                        }
                        
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
                                            <Typography variant="h7" >Subtotal</Typography>
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
                                            <Typography variant="h7">Descuentos</Typography>
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
                                        {
                                            etapa!==2?(
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
                                            ):(
                                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:'center', alignItems:'center', gap: 2, mt:2 }}>
                                                    <Button onClick={handleContinueByWebPay}>
                                                        <Image
                                                            src={'https://imgs.search.brave.com/cIm__eRvkfQK61DHoU-3aq9ad9EArvbEjpIjw1z1_k4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRpbmctcGVydS5i/ZWdsb2JhbC5iaXov/d3AtY29udGVudC91/cGxvYWRzL2VsZW1l/bnRvci90aHVtYnMv/eWFwZS1sb2dvLWZv/bmRvLXRyYW5zcGFy/ZW50ZS1yMHl3aW9r/MXV6N2N3bXh6bWpp/bDdjbDdydWRpNHpp/Y2d1eHlwcWpubHcu/cG5n'}
                                                            alt='yapeLogo'
                                                            width={50}
                                                            height={50}
                                                            style={{ objectFit: 'contain', borderRadius:4, marginBottom: 10 }}
                                                        />
                                                        <Typography variant='marcaCard' sx={{ color: 'text.secondary' }}>
                                                            Ahora puedes pagar con Yape. Haz Click aquí!
                                                        </Typography>
                                                    </Button> 
                                                </Box>
                                            )
                                        }

                                        
                                    </>
                                )
                            }
                            
                        </Box>
                    </Grid>
                </>
            </Grid>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={showModalWebPay}
                onClose={()=>setShowModalWebPay(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={showModalWebPay}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="yapeTitle">
                            Pasos para realizar tu compra vía Yape
                        </Typography>

                        <Typography variant="yapeSteps" id="transition-modal-description" sx={{ mt: 2 }}>
                            1. Escanea el código QR con tu app de Yape.
                            <br />
                            2. Ingresa el monto exacto: <strong>S/ {carrito.reduce((sum, item) => {
                            const descuento = item.product.descuento
                                ? (item.product.price * item.product.descuento) / 100
                                : 0;
                            return sum + (item.product.price - descuento) * item.quantity;
                            }, 0).toFixed(2)}</strong>
                            <br />
                            3. En el mensaje de Yape, escribe tu nombre o número de pedido si lo tienes.
                            <br />
                            4. Realiza el pago y toma una captura del comprobante.
                            <br />
                            5. Luego de pagar, presiona el botón <strong>Subir Comprobante</strong> para cargar la imagen.
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Image
                                src={'https://sodastereobucket.s3.us-east-2.amazonaws.com/qryape.jpg'}
                                alt='Código QR de Yape'
                                width={300}
                                height={300}
                                style={{ borderRadius: 12 }}
                            />
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                Recuerda subir el comprobante para confirmar tu compra.
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                component="label"
                                sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                                Subir Comprobante
                                <input hidden accept="image/*" type="file" onChange={handleUploadComprobante} />
                            </Button>

                        </Box>
                    </Box>
                </Fade>
            </Modal>
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