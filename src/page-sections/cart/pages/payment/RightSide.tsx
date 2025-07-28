'use client';

import OrderService from '@/services/OrderService'
import CouponService from '@/services/CouponService'
import { Backdrop, Box, Button, CircularProgress, Fade, Grid, IconButton, Menu, MenuItem, Modal, Typography, TextField, FormControl, InputLabel, Select, Chip } from '@mui/material'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import CartProgress from '../../../../components/cart/Stepper';

import Image from 'next/image';

import { LucideArrowLeft } from 'lucide-react';
import { Snackbar, Alert } from '@mui/material';
import { useAuth, useUser } from '@clerk/nextjs';
import YapeCard from '../../../../components/cart/YapeCard';
import { useCart } from '../../CartContext';
import { useRouter } from 'next/navigation';
import {
  Payment,
  StatusScreen,
  CardNumber,
  CardPayment,
  Wallet, 
  initMercadoPago, 
  Brand
} from '@mercadopago/sdk-react';
import { ICreateOrderData } from '@/interfaces/Order';
import { ICoupon } from '@/interfaces/Coupon';
import CustomCardPayment from '@/components/cards/CustomCardPayment';
import ProtectionConsumer from '@/components/cart/ProtectionConsumer';
import { useNotification } from '@/hooks/useNotification';
import ErrorNotification from '@/components/ErrorNotification';

// Interfaz para errores de MercadoPago
interface MPError {
  message: string;
  type: string;
}

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
  const router = useRouter();
  const { notification, showError, closeNotification, showSuccess, showInfo, showWarning } = useNotification(); 
  
  // Estados existentes
  const modalRef = useRef(null)
  const [showModalWebPay, setShowModalWebPay] = useState<boolean>(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'payment' | 'yape' | null>(null);

  // Estados para MercadoPago
  const mpInitialized = useRef(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showMercadoPagoModal, setShowMercadoPagoModal] = useState(false);

  // Estados para cupón de descuento
  const [showCouponField, setShowCouponField] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ICoupon | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Estados para MercadoPago - NUEVOS ESTADOS PARA EVITAR RE-RENDERS
  const [cardPaymentKey, setCardPaymentKey] = useState(0);
  const [mpReady, setMpReady] = useState(false);

  const { getToken } = useAuth();
  const { user } = useUser();
  const { carrito, isLoading, selectedAddressId, deliveryType, pickUps, addresses, selectedAddress, selectedPickup } = useCart();
  console.log('User:', user);

  // Inicializar MercadoPago solo una vez
  useEffect(() => {
    if (typeof window !== 'undefined' && !mpInitialized.current) {
      try {
        initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '');
        mpInitialized.current = true;
        setMpReady(true);
      } catch (error) {
        console.error('Error initializing MercadoPago:', error);
        showError('Error al inicializar el sistema de pagos');
      }
    }
  }, []);

  // Calcular totales (mantenemos la misma lógica)
  const calculateTotals = useCallback(() => {
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

    let total = subtotal - discount;
    let couponDiscount = 0;

    if (appliedCoupon) {
      couponDiscount = total * (appliedCoupon.discountPercentage / 100);
      total = total - couponDiscount;
    }

    return { subtotal, discount, couponDiscount, total };
  }, [carrito, appliedCoupon]);

  const { subtotal, discount, couponDiscount, total } = calculateTotals();

  // CONFIGURACIÓN ESTABLE PARA MERCADOPAGO
  const cardPaymentConfig = useMemo(() => {
    if (!mpReady || !user?.emailAddresses?.[0]?.emailAddress) {
      return null;
    }

    return {
      initialization: {
        amount: total,
        payer: {
          email: user.emailAddresses[0].emailAddress,
        }
      },
      customization: {
        visual: {
          hidePaymentButton: true,
        },
        paymentMethods: {
          // Puedes agregar configuraciones específicas aquí
        }
      }
    };
  }, [total, user?.emailAddresses, mpReady]);

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

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      showError('Por favor, ingresa un código de cupón válido.');
      return;
    }

    try {
      setIsValidatingCoupon(true);
      const token = await getToken();

      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const couponData = await CouponService.validateCoupon(token, couponCode.trim());
      if (couponData.success) {
        setAppliedCoupon(couponData.data);
        showSuccess('Cupón aplicado correctamente');
        setShowCouponField(false);
      } else {
        showError(`${couponData.message}`);
      }
    } catch (error: any) {
      console.error('Error validating coupon:', error);
      showError('Error al validar el cupón');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showInfo('Cupón removido correctamente');
  };

  const handleCreateOrder = async () => {
    try {
      console.log('Creating order...');
       if (!user?.id) {
        showError('No se pudo obtener el ID del usuario');
        return null;
      }
      console.log("pasa por aqui")
      setIsProcessingPayment(true);
      const token = await getToken();

      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const orderData = {
        userId: user.id,
        addressId: selectedPickup ? selectedPickup._id : selectedAddress,
        couponCode: appliedCoupon?.code
      };
      console.log("order data",orderData)

      const response = await OrderService.createOrder(token, orderData as ICreateOrderData);

      if (response.success) {
        const createdOrderId = response.data.order._id;
        setOrderId(createdOrderId);
        showSuccess('Orden creada correctamente');
        return createdOrderId;
      }
      return null;
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Error al crear la orden');
      return null;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCardPaymentSubmit = async (paymentData: any) => {
    try {
      setIsProcessingPayment(true);
      
      // Crear orden primero
      let currentOrderId = orderId;
      if (!currentOrderId) {
        currentOrderId = await handleCreateOrder();
      }
      
      if (currentOrderId && paymentData?.id) {
        await handlePaymentSuccess(paymentData, currentOrderId);
      } else {
        throw new Error('No se pudo procesar el pago');
      }
    } catch (error) {
      console.error('Error in payment process:', error);
      handlePaymentError(error as MPError);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any, orderIdToUse: string) => {
    try {
      const token = await getToken();
      if (token && orderIdToUse && paymentData.id) {
        await OrderService.confirmPayment(token, {
          orderId: orderIdToUse,
          paymentId: paymentData.id.toString()
        });
        showSuccess('Pago confirmado correctamente');
        setTimeout(() => {
          router.push(`/order/success?orderId=${orderIdToUse}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      showError('Error al confirmar el pago');
    }
  };

  const handlePaymentError = (error: MPError) => {
    console.error('Payment error:', error);
    showError('Error en el pago: ' + (error.message || 'Error desconocido'));
  };

  const handleUploadComprobante = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Comprobante subido:', file.name);
      showSuccess('Comprobante subido correctamente');
      setShowModalWebPay(false);
    }
  };

  // Función para abrir modal de MercadoPago
  const openMercadoPagoModal = async () => {
    if (!mpReady) {
      showError('El sistema de pagos no está listo. Intenta nuevamente.');
      return;
    }

    try {
      console.log('Opening payment modal...');
      // Crear orden antes de abrir el modal
      const createdOrderId = await handleCreateOrder();
      if (createdOrderId) {
        console.log('Created order ID:', createdOrderId);
        // Forzar re-render del componente CardPayment
        setCardPaymentKey(prev => prev + 1);
        setShowMercadoPagoModal(true);
      }
    } catch (error) {
      console.error('Error opening payment modal:', error);
      showError('Error al abrir el modal de pagos');
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

  // Función para renderizar la información de entrega
  const renderDeliveryInfo = () => {
    if (deliveryType === 'pickup' && selectedPickup) {
      return (
        <Box sx={{
          p: 2,
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          backgroundColor: '#f9f9f9'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label="Recojo en tienda"
              size="small"
              color="primary"
            />
          </Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {selectedPickup.city}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedPickup.address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Centro Comercial: {selectedPickup.cc}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stand: {selectedPickup.stand}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tel: {selectedPickup.contactNumber}
          </Typography>
        </Box>
      );
    } else if (deliveryType === 'address' && selectedAddress) {
      return (
        <Box sx={{
          p: 2,
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          backgroundColor: '#f9f9f9'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label="Envío a domicilio"
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
      );
    }
    return null;
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

            {/* Mostrar información de entrega */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="leftside" sx={{ mb: 2 }}>
                {deliveryType === 'pickup' ? 'Punto de recojo seleccionado' : 'Dirección de entrega seleccionada'}
              </Typography>
              {renderDeliveryInfo()}
            </Box>

            {/* Métodos de pago */}
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="leftside">Métodos de pago</Typography>
              </Box>

              {renderPaymentMethodCard(
                'card',
                'Tarjeta de Crédito/Débito',
                'Paga con tu tarjeta de crédito o débito, Mastercard, American Express',
                'https://st2.depositphotos.com/1102480/10686/i/450/depositphotos_106860552-stock-photo-collection-of-popular-payment-system.jpg',
                paymentMethod === 'card'
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

                  {/* Sección de cupón de descuento */}
                  <Box sx={{ mb: 2, mt: 2 }}>
                    {!appliedCoupon && !showCouponField && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setShowCouponField(true)}
                        sx={{
                          textTransform: 'none',
                          color: '#7950f2',
                          fontSize: '0.875rem',
                          p: 0
                        }}
                      >
                        ¿Tienes un código de descuento?
                      </Button>
                    )}

                    {showCouponField && !appliedCoupon && (
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            size="small"
                            placeholder="Código de cupón"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            sx={{ flex: 1 }}
                            disabled={isValidatingCoupon}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleValidateCoupon}
                            disabled={isValidatingCoupon || !couponCode.trim()}
                            sx={{
                              minWidth: 'auto',
                              px: 2,
                              textTransform: 'none'
                            }}
                          >
                            {isValidatingCoupon ? (
                              <CircularProgress size={16} />
                            ) : (
                              'Aplicar'
                            )}
                          </Button>
                        </Box>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => {
                            setShowCouponField(false);
                            setCouponCode('');
                          }}
                          sx={{
                            textTransform: 'none',
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            p: 0
                          }}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    )}

                    {appliedCoupon && (
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                        p: 1,
                        backgroundColor: '#e8f5e8',
                        borderRadius: 1,
                        border: '1px solid #4caf50'
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                            Cupón: {appliedCoupon.code}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            -{appliedCoupon.discountPercentage}% de descuento
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                            -S/ {couponDiscount.toFixed(2)}
                          </Typography>
                          <Button
                            size="small"
                            onClick={handleRemoveCoupon}
                            sx={{
                              minWidth: 'auto',
                              p: 0.5,
                              color: 'text.secondary'
                            }}
                          >
                            ✕
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>

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
                      } else if (paymentMethod === 'card') {
                        openMercadoPagoModal();
                      } else {
                        showWarning('Seleccione un método de pago');
                      }
                    }}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <Typography variant="h7">Continuar</Typography>
                    )}
                  </Button>
                  
                  <ProtectionConsumer/>
                  
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

      {/* Modal de MercadoPago MEJORADO */}
      <Modal
        open={showMercadoPagoModal}
        onClose={() => {
          setShowMercadoPagoModal(false);
          // NO resetear orderId aquí para mantener la orden creada
        }}
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
              Confirmar pago - S/ {total.toFixed(2)}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Método seleccionado:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tarjeta de Crédito/Débito
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
                <strong>{deliveryType === 'pickup' ? 'Punto de recojo:' : 'Dirección de entrega:'}</strong>
              </Typography>
              {deliveryType === 'pickup' && selectedPickup ? (
                <>
                  <Typography variant="body2">
                    {selectedPickup.city} - {selectedPickup.cc}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stand: {selectedPickup.stand}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPickup.address}
                  </Typography>
                </>
              ) : selectedAddress ? (
                <>
                  <Typography variant="body2">
                    {selectedAddress.name} - {selectedAddress.street} {selectedAddress.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedAddress.city}, {selectedAddress.state}
                  </Typography>
                </>
              ) : null}
            </Box>

            {/* Brand de MercadoPago */}
            <Brand />

            {/* CardPayment con key estable */}
            {cardPaymentConfig && mpReady && (
              <CardPayment
                key={cardPaymentKey}
                initialization={cardPaymentConfig.initialization}
                customization={cardPaymentConfig.customization}
                onSubmit={handleCardPaymentSubmit}
                onReady={() => {
                  console.log('Card payment ready');
                }}
                onError={handlePaymentError}
              />
            )}

            <Button
              onClick={() => {
                setShowMercadoPagoModal(false);
                // Resetear estados si es necesario
                setOrderId(null);
                setCardPaymentKey(prev => prev + 1);
              }}
              sx={{ mt: 2, width: '100%' }}
              variant="outlined"
            >
              Cancelar
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Modal de Yape (sin cambios) */}
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
              border: '1px solid #e0e0e',
              borderRadius: 2,
              p: 2,
              mb: 3,
              backgroundColor: '#f9f9f9'
            }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Total a pagar: S/ {total.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2">
                {deliveryType === 'pickup' && selectedPickup ? (
                  `Recojo: ${selectedPickup.city} - ${selectedPickup.cc}`
                ) : selectedAddress ? (
                  `Dirección: ${selectedAddress.name} - ${selectedAddress.street}`
                ) : ''}
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
      <ErrorNotification
        open={notification.open}
        onClose={closeNotification}
        message={notification.message}
        type={notification.type}
        autoHideDuration={4000}
        position="top"
      />
    </Box>
  )
}

export default RightSidePayment