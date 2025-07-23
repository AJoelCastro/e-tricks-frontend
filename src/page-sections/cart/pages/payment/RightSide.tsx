'use client';
import UserService from '@/services/UserService'
import { Backdrop, Box, Button, CircularProgress, Fade, Grid, IconButton, Menu, MenuItem, Modal, Typography } from '@mui/material'
import React, {  useEffect, useState } from 'react'
import CartProgress from '../../../../components/cart/Stepper';
import { ICartItem } from '@/interfaces/CartItem';
import ProductService from '@/services/ProductService';
import Image from 'next/image';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IAddress } from '@/interfaces/Address';
import SelectableAddressCard from '../../../../components/addresses/SelectableAddressCard';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { LucideArrowLeft } from 'lucide-react';
import { Snackbar, Alert } from '@mui/material';
import { useAuth } from '@clerk/nextjs';
import SavedCard from '../../../../components/cart/SavedCard';
import YapeCard from '../../../../components/cart/YapeCard';
import { useCart } from '../../CartContext';
import { useRouter } from 'next/navigation';


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
const RightSidePayment = () => {


    //datos propios
    const [addresses, setAddresses] = useState<Array<IAddress>>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({ open: false, message: '', severity: 'info' });
    const [deliveryType, setDeliveryType] = useState<'pickup' | 'address' | null>(null);
    const [showModalWebPay, setShowModalWebPay] = useState<boolean>(false);
    const [selectedCardId, setSelectedCardId] = useState<string| null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'yape' | null>(null);

    const { getToken } = useAuth();
    const { carrito, isLoading } = useCart();
    const router = useRouter();
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
                    <Grid size={{
                        xs:12,
                        sm:12,
                        md:8
                    }}
                    sx={{ paddingX:2, backgroundColor:'white',borderRadius: 2, paddingTop:2 }}
                    >
                        <IconButton onClick={() => router.back()}  sx={{ mb: 1 }}>
                            <LucideArrowLeft color='#7950f2'/>
                        </IconButton>
                        <CartProgress activeStep={2} />
                        <Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="leftside" >Tarjetas guardadas</Typography>
                            </Box>
                            <SavedCard
                                last4="4406"
                                brandLogoUrl="https://img.icons8.com/color/48/000000/mastercard-logo.png"
                                selected={paymentMethod === 'card' && selectedCardId === 'card_4406'}
                                onSelect={() => {
                                    setSelectedCardId('card_4406');
                                    setPaymentMethod('card');
                                }}
                                onRemove={() => console.log("Eliminar tarjeta")}
                            />
                            <Box sx={{ textAlign: "center", mt: 2 }}>
                                <Button variant="outlined">Agregar tarjeta o Gift Card</Button>
                            </Box>
                            <Box sx={{ mt: 4, mb: 2 }}>
                                <Typography variant="leftside" >Otros medios de pago</Typography>
                            </Box>
                            
                            <YapeCard
                                selected={paymentMethod === 'yape'}
                                onSelect={() => setPaymentMethod('yape')}
                            />
                        </Box>
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
                                            onClick={() => {
                                                if (paymentMethod === 'card') {
                                                // lógica de pago con tarjeta
                                                } else if (paymentMethod === 'yape') {
                                                    setShowModalWebPay(true);
                                                } else {
                                                    handleShowSnackbar("Selecciona un método de pago", "warning");
                                                }
                                            }}
                                        >
                                            <Typography variant="h7">
                                                Pagar
                                            </Typography>
                                        </Button>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:'center', alignItems:'center', gap: 2, mt:2 }}>
                                            <Button onClick={handleContinueByWhatsApp}>
                                                <Image
                                                    src={'https://imgs.search.brave.com/1tdHoO38OZcsoto1OsdOQfaJT5yvjTWjmNDMNjfcpis/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/cy13b3JsZC5uZXQv/d3AtY29udGVudC91/cGxvYWRzLzIwMjAv/MDUvTG9nby1XaGF0/c0FwcC03MDB4Mzk0/LnBuZw'}
                                                    alt='whatsappLogo'
                                                    width={50}
                                                    height={50}
                                                    style={{ objectFit: 'contain', borderRadius:4, marginBottom: 10 }}
                                                />
                                                <Typography variant='marcaCard' sx={{ color: 'text.secondary' }}>
                                                    Continuar atención vía WhatsApp.
                                                </Typography>
                                            </Button> 
                                        </Box>
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

export default RightSidePayment