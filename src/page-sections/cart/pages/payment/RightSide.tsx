'use client';
import UserService from '@/services/UserService'
import OrderService from '@/services/OrderService'
import { Backdrop, Box, Button, CircularProgress, Fade, Grid, IconButton, Menu, MenuItem, Modal, Typography, TextField, FormControl, InputLabel, Select, Chip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CartProgress from '../../../../components/cart/Stepper';
import { ICartItem } from '@/interfaces/CartItem';
import ProductService from '@/services/ProductService';
import Image from 'next/image';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IAddress } from '@/interfaces/Address';
import { IPickUp } from '@/interfaces/PickUp';
import SelectableAddressCard from '../../../../components/addresses/SelectableAddressCard';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { LucideArrowLeft } from 'lucide-react';
import { Snackbar, Alert } from '@mui/material';
import { useAuth, useUser } from '@clerk/nextjs';
import SavedCard from '../../../../components/cart/SavedCard';
import YapeCard from '../../../../components/cart/YapeCard';
import { useCart } from '../../CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Payment, 
  StatusScreen,
  CardNumber, 
  CardPayment,
  Wallet,
  
} from '@mercadopago/sdk-react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 2,
  width: { xs: '90%', sm: '70%', md: '50%' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  p: 4,
  maxHeight: '90vh',
  overflow: 'auto'
};

const RightSidePayment = () => {
  // Estados existentes
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });
  const [showModalWebPay, setShowModalWebPay] = useState<boolean>(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'payment' | 'yape' | null>(null);

  // Estados para MercadoPago
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showMercadoPagoModal, setShowMercadoPagoModal] = useState(false);

  // Estados para formularios de pago
  const [cardFormData, setCardFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    cardholderName: '',
    cardholderEmail: '',
    identificationType: '',
    identificationNumber: ''
  });

  const { getToken } = useAuth();
  const { user } = useUser();
  const { carrito, isLoading,selectedAddressId,deliveryType,pickUps,addresses,selectedAddress,selectedPickup } = useCart();
  const router = useRouter();


  console.log('delivery', deliveryType)
  console.log('address', selectedAddress)


  // Calcular totales
  const calculateTotals = () => {

    const subtotal = carrito.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const discount = carrito.reduce((sum, item) => {
      if (item.product.descuento) {
        const descuento = (item.product.price * item.product.descuento) / 100;
        return sum + descuento * item.quantity;
      }
      return sum;
    }, 0);

    const total = subtotal - discount;

    return { subtotal, discount, total };
  };

  const { subtotal, discount, total } = calculateTotals();

  const handleContinueByWhatsApp = () => {
    const carritoTexto = carrito.map((item, index) => {
      const nombre = item.product.name;
      const cantidad = item.quantity;
      const talla = item.size;
      const precioFinal = (item.product.price - (item.product.price * (item.product.descuento || 0) / 100)).toFixed(2);
      const subtotal = (Number(precioFinal) * item.quantity).toFixed(2);
      const linkProducto = `https://tusitioweb.com/producto/${item.product._id}`;
      const imagen = item.product.images[0];

      return `🛍️ *${nombre}*\n🔗 ${linkProducto}\n📸 ${imagen}\n📏 Talla: ${talla} | Cant: ${cantidad}\n💵 Subtotal: S/ ${subtotal}\n`;
    }).join('\n');

    
    const metodoEntrega = deliveryType === 'pickup'
      ? `📦 Recojo en tienda: ${selectedPickup?.city} - ${selectedPickup?.cc} - ${selectedPickup?.stand} `
      : `📍 Entrega a: ${selectedAddress?.name} - ${selectedAddress?.street} ${selectedAddress?.number}, ${selectedAddress?.city}, ${selectedAddress?.state}`;

    const mensaje = `👋 ¡Hola! Quisiera hacer un pedido:\n\n${carritoTexto}\n${metodoEntrega}\n\n💰 *Total: S/ ${total.toFixed(2)}*\n\n🛒 Gracias, quedo atento(a).`;

    const urlWhatsApp = `https://wa.me/51969742589?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
  };

  const handleCreateOrder = async () => {
    if (!selectedAddress?._id) {
      handleShowSnackbar("No se encontró la dirección seleccionada", "error");
      return;
    }

    if (!user?.id) {
      handleShowSnackbar("Usuario no autenticado", "error");
      return;
    }

    try {
      setIsProcessingPayment(true);
      const token = await getToken();
      
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const orderData = {
        userId: user.id,
        addressId: selectedAddress._id,
      };

      const response = await OrderService.createOrder(token, orderData);
      
      if (response.success) {
        setOrderId(response.data.order._id);
        setPreferenceId(response.data.order.mercadoPagoPreferenceId || null);
        setShowMercadoPagoModal(true);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      handleShowSnackbar("Error al crear la orden", "error");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      const token = await getToken();
      if (token && orderId && paymentData.id) {
        await OrderService.confirmPayment(token, {
          orderId: orderId,
          paymentId: paymentData.id.toString()
        });
        
        handleShowSnackbar("¡Pago realizado con éxito!", "success");
        
        setTimeout(() => {
          router.push(`/order/success?orderId=${orderId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      handleShowSnackbar("Error al confirmar el pago", "error");
    }
  };

  const handlePaymentError = (error: BrickError) => {
    console.error('Payment error:', error);
    handleShowSnackbar(`Error en el pago: ${error.message}`, "error");
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
      console.log('Comprobante subido:', file.name);
      handleShowSnackbar("Comprobante subido. Procesaremos tu pago pronto.", "success");
      setShowModalWebPay(false);
    }
  };

  const renderPaymentMethodCard = (method: string, title: string, description: string, icon: string, selected: boolean) => (
    <Box
      sx={{
        border: selected ? '2px solid #7950f2' : '1px solid #e0e0e0',
        borderRadius: 2,
        p: 2,
        mb: 2,
        cursor: 'pointer',
        backgroundColor: selected ? '#f8f6ff' : 'white',
        transition: 'all 0.2s ease'
      }}
      onClick={() => setPaymentMethod(method as any)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Image
          src={icon}
          alt={title}
          width={40}
          height={40}
        />
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderPaymentForm = () => {
    if (!preferenceId) return null;

    switch (paymentMethod) {
      case 'card':
        return (
          <CardPayment
            initialization={{
              amount: total,
              preferenceId: preferenceId,
            }}
            customization={{
              paymentMethods: {
                creditCard: "all",
                debitCard: "all",
              },
            }}
            onSubmit={async (param) => {
              await handlePaymentSuccess(param);
            }}
            onReady={() => {
              console.log('Card payment ready');
            }}
            onError={handlePaymentError}
          />
        );

      case 'wallet':
        return (
          <Wallet
            initialization={{
              preferenceId: preferenceId,
            }}
            customization={{
              texts: {
                valueProp: 'smart_option',
              },
            }}
            onReady={() => {
              console.log('Wallet ready');
            }}
            onError={handlePaymentError}
          />
        );

      case 'payment':
        return (
          <Payment
            initialization={{
              amount: total,
              preferenceId: preferenceId,
            }}
            customization={{
              paymentMethods: {
                ticket: "all",
                creditCard: "all",
                debitCard: "all",
                mercadoPago: "all",
              },
            }}
            onSubmit={async (param) => {
              await handlePaymentSuccess(param);
            }}
            onReady={() => {
              console.log('Payment ready');
            }}
            onError={handlePaymentError}
          />
        );

      default:
        return null;
    }
  };

  if (isLoading) {
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
          <Grid size={{
            xs: 12,
            sm: 12,
            md: 8
          }}
            sx={{ paddingX: 2, backgroundColor: 'white', borderRadius: 2, paddingTop: 2 }}
          >
            <IconButton onClick={() => router.back()} sx={{ mb: 1 }}>
              <LucideArrowLeft color='#7950f2' />
            </IconButton>
            <CartProgress activeStep={2} />
            
            {/* Mostrar dirección seleccionada */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="leftside" sx={{ mb: 2 }}>
                Dirección de entrega seleccionada
              </Typography>
              {selectedAddress && (
                <Box sx={{ 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 2,
                  backgroundColor: '#f9f9f9'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip 
                      label={deliveryType === 'pickup' ? 'Recojo en tienda' : 'Envío a domicilio'}
                      size="small"
                      color="primary"
                    />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedAddress.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedAddress.street} {selectedAddress.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedAddress.city}, {selectedAddress.state}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tel: {selectedAddress.phone}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Métodos de pago */}
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="leftside">Métodos de pago</Typography>
              </Box>

              {renderPaymentMethodCard(
                'card',
                'Tarjeta de Crédito/Débito',
                'Paga con tu tarjeta de crédito o débito',
                'https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381a5889ec-m.svg',
                paymentMethod === 'card'
              )}

              {renderPaymentMethodCard(
                'wallet',
                'MercadoPago Wallet',
                'Paga con tu cuenta de MercadoPago',
                'https://http2.mlstatic.com/storage/logos-api-admin/51b446b0-571c-11e8-9a2d-4b2bd7b1bf77-m.svg',
                paymentMethod === 'wallet'
              )}

              {renderPaymentMethodCard(
                'payment',
                'Todos los métodos',
                'Tarjetas, efectivo, transferencias y más',
                'https://http2.mlstatic.com/storage/logos-api-admin/aa2b8f70-5c85-11ec-ae75-df2bef173be2-m.svg',
                paymentMethod === 'payment'
              )}

              {/* Yape Card */}
              <YapeCard
                selected={paymentMethod === 'yape'}
                onSelect={() => setPaymentMethod('yape')}
              />
            </Box>
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
            <Box sx={{ px: 1 }}>
              {carrito.length > 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h7">Productos ({carrito.length})</Typography>
                    <Typography variant="h7">S/ {subtotal.toFixed(2)}</Typography>
                  </Box>

                  {discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h7">Descuentos</Typography>
                      <Typography variant="h7" color="error">
                        - S/ {discount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, py: 1, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="h7">Total</Typography>
                    <Typography variant="h7">S/ {total.toFixed(2)}</Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3, borderRadius: 2, mb: { xs: 4, sm: 2, md: 0 } }}
                    onClick={() => {
                      if (paymentMethod === 'yape') {
                        setShowModalWebPay(true);
                      } else if (paymentMethod && ['card', 'wallet', 'payment'].includes(paymentMethod)) {
                        handleCreateOrder();
                      } else {
                        handleShowSnackbar("Selecciona un método de pago", "warning");
                      }
                    }}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <Typography variant="h7">Pagar</Typography>
                    )}
                  </Button>

                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
                    <Button onClick={handleContinueByWhatsApp}>
                      <Image
                        src={'https://imgs.search.brave.com/1tdHoO38OZcsoto1OsdOQfaJT5yvjTWjmNDMNjfcpis/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/cy13b3JsZC5uZXQv/d3AtY29udGVudC91/cGxvYWRzLzIwMjAv/MDUvTG9nby1XaGF0/c0FwcC03MDB4Mzk0/LnBuZw'}
                        alt='whatsappLogo'
                        width={50}
                        height={50}
                        style={{ objectFit: 'contain', borderRadius: 4, marginBottom: 10 }}
                      />
                      <Typography variant='marcaCard' sx={{ color: 'text.secondary' }}>
                        Continuar atención vía WhatsApp.
                      </Typography>
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </>
      </Grid>

      {/* Modal de MercadoPago */}
      <Modal
        open={showMercadoPagoModal}
        onClose={() => setShowMercadoPagoModal(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={showMercadoPagoModal}>
          <Box sx={style}>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
              Completa tu pago - S/ {total.toFixed(2)}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Método seleccionado:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {paymentMethod === 'card' && 'Tarjeta de Crédito/Débito'}
                {paymentMethod === 'wallet' && 'MercadoPago Wallet'}
                {paymentMethod === 'payment' && 'Todos los métodos de pago'}
              </Typography>
            </Box>

            <Box sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 2, 
              p: 2, 
              mb: 3,
              backgroundColor: '#f9f9f9'
            }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Dirección de entrega:</strong>
              </Typography>
              <Typography variant="body2">
                {selectedAddress?.name} - {selectedAddress?.street} {selectedAddress?.number}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedAddress?.city}, {selectedAddress?.state}
              </Typography>
            </Box>
            
            {renderPaymentForm()}
            
            <Button
              onClick={() => setShowMercadoPagoModal(false)}
              sx={{ mt: 2, width: '100%' }}
              variant="outlined"
            >
              Cancelar
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Modal de Yape */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={showModalWebPay}
        onClose={() => setShowModalWebPay(false)}
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
            <Typography id="transition-modal-title" variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Pasos para realizar tu compra vía Yape
            </Typography>

            <Box sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 2, 
              p: 2, 
              mb: 3,
              backgroundColor: '#f9f9f9'
            }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Total a pagar: S/ {total.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2">
                Dirección: {selectedAddress?.name} - {selectedAddress?.street}
              </Typography>
            </Box>

            <Typography variant="body2" id="transition-modal-description" sx={{ mt: 2, mb: 2 }}>
              1. Escanea el código QR con tu app de Yape.
              <br />
              2. Ingresa el monto exacto: <strong>S/ {total.toFixed(2)}</strong>
              <br />
              3. En el mensaje de Yape, escribe tu nombre o número de pedido si lo tienes.
              <br />
              4. Realiza el pago y toma una captura del comprobante.
              <br />
              5. Luego de pagar, presiona el botón <strong>Subir Comprobante</strong> para cargar la imagen.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 3 }}>
              <Image
                src={'https://sodastereobucket.s3.us-east-2.amazonaws.com/qryape.jpg'}
                alt='Código QR de Yape'
                width={300}
                height={300}
                style={{ borderRadius: 12 }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                Recuerda subir el comprobante para confirmar tu compra.
              </Typography>

              <Button
                variant="contained"
                color="primary"
                component="label"
                sx={{ borderRadius: 2, textTransform: 'none', width: '100%' }}
              >
                Subir Comprobante
                <input hidden accept="image/*" type="file" onChange={handleUploadComprobante} />
              </Button>

              <Button
                onClick={() => setShowModalWebPay(false)}
                sx={{ width: '100%' }}
                variant="outlined"
              >
                Cancelar
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