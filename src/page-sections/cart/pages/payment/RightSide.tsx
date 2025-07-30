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
import { ICreateOrderData, ICreatePreferenceData } from '@/interfaces/Order';
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

// Declarar MercadoPago globalmente
declare global {
  interface Window {
    MercadoPago: any;
  }
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
  
  // Estados para MercadoPago
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [mpLoaded, setMpLoaded] = useState(false);

  // Estados para cupón de descuento
  const [showCouponField, setShowCouponField] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ICoupon | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const { getToken } = useAuth();
  const { user } = useUser();
  const { carrito, isLoading, deliveryType, selectedAddress, selectedPickup } = useCart();

  // Cargar el SDK de MercadoPago dinámicamente
  useEffect(() => {
    const loadMercadoPagoSDK = () => {
      return new Promise<void>((resolve, reject) => {
        // Si ya está cargado, resolver inmediatamente
        if (window.MercadoPago) {
          setMpLoaded(true);
          resolve();
          return;
        }

        // Crear el script tag
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.async = true;
        
        script.onload = () => {
          console.log('MercadoPago SDK loaded successfully');
          setMpLoaded(true);
          resolve();
        };
        
        script.onerror = () => {
          console.error('Failed to load MercadoPago SDK');
          showError('Error al cargar MercadoPago SDK');
          reject(new Error('Failed to load MercadoPago SDK'));
        };

        document.head.appendChild(script);
      });
    };

    loadMercadoPagoSDK().catch(console.error);

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Manejar el retorno de MercadoPago
  useEffect(() => {
    const handlePaymentResult = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentId = urlParams.get('payment_id');
      const status = urlParams.get('status');
      const merchantOrderId = urlParams.get('merchant_order_id');

      if (paymentId && status === 'approved') {
        console.log('Payment approved, creating order...', { paymentId, merchantOrderId });
        showSuccess('¡Pago aprobado! Creando tu orden...');
        await handleCreateOrder(paymentId);
      } else if (paymentId && status === 'rejected') {
        showError('El pago fue rechazado. Intenta con otro método de pago.');
        setIsProcessingPayment(false);
      } else if (paymentId && status === 'pending') {
        showWarning('El pago está pendiente de confirmación.');
        setIsProcessingPayment(false);
      }
    };

    // Solo ejecutar si hay parámetros de pago en la URL
    if (window.location.search.includes('payment_id')) {
      handlePaymentResult();
    }
  }, []);

  // Calcular totales
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

  // Crear preferencia de pago
  const createPreference = async () => {
    try {
      if (!user?.id) {
        showError('No se pudo obtener el ID del usuario');
        return null;
      }

      setIsCreatingPreference(true);
      const token = await getToken();

      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const preferenceData: ICreatePreferenceData = {
        userId: user.id,
        couponCode: appliedCoupon?.code,
        total:total,
        subtotal:subtotal
      };

      console.log('Creating preference with data:', preferenceData);

      const response = await OrderService.getPreferenceId(token, preferenceData);
      
      if (response) {
        console.log('Preference created successfully:', response);
        return response.preferenceId;
      } else {
        throw new Error('No se recibió el ID de preferencia');
      }
    } catch (error) {
      showError('Error al crear la preferencia de pago');
      return null;
    } finally {
      setIsCreatingPreference(false);
    }
  };

  // Manejar el botón continuar - crear preferencia y abrir checkout directo
  const handleContinuePayment = async () => {
    if (!mpLoaded) {
      showError('El sistema de pagos aún no está listo. Intenta nuevamente.');
      return;
    }

    if (!user?.id) {
      showError('No se pudo obtener el ID del usuario');
      return;
    }

    if (!selectedAddress && !selectedPickup) {
      showError('Debes seleccionar una dirección de entrega o punto de recojo');
      return;
    }

    // Crear la preferencia
    const preferenceIdCreated = await createPreference();
    console.log(" preferenceIdCreated", preferenceIdCreated)
    if (!preferenceIdCreated) {
      showError('No se pudo crear la preferencia de pago');
      return;
    }

    setPreferenceId(preferenceIdCreated);

    try {
      // Inicializar MercadoPago con tu public key
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, {
        locale: 'es-PE',
      });

      console.log("mercadopago",mp)
      console.log("Opening checkout with preference:", preferenceIdCreated);

      // Abrir el checkout directamente
      mp.checkout({
        preference: {
          id: preferenceIdCreated,
        },
        autoOpen: true, // Se abre automáticamente
        renderMode: 'modal', // o 'blank' para redirección completa
      });

      showInfo('Abriendo ventana de pago...');

    } catch (error) {
      console.error('Error opening checkout:', error);
      showError("Error al abrir el checkout de MercadoPago");
    }
  };

  // Crear orden después de confirmar el pago
  const handleCreateOrder = async (paymentId: string) => {
    try {
      if (!user?.id) {
        showError('No se pudo obtener el ID del usuario');
        return null;
      }

      console.log('Creating order...');
      setIsProcessingPayment(true);
      const token = await getToken();

      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const orderData: ICreateOrderData = {
        userId: user.id,
        addressId: selectedPickup
          ? selectedPickup._id
          : selectedAddress && selectedAddress._id
            ? selectedAddress._id
            : '', // fallback to empty string if undefined
        couponCode: appliedCoupon?.code,
      };

      console.log("Order data:", orderData);

      const response = await OrderService.createOrder(token, orderData);

      if (response.success) {
        const createdOrderId = response.data.order._id;
        setOrderId(createdOrderId);
        
        // Confirmar el pago con la orden creada
        await OrderService.confirmPayment(token, {
          orderId: createdOrderId,
          paymentId: paymentId
        });

        showSuccess('Orden creada y pago confirmado correctamente');
        
        // Redirigir a página de éxito
        setTimeout(() => {
          router.push(`/order/success?orderId=${createdOrderId}`);
        }, 2000);

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

            {/* Estado de MercadoPago */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Estado del sistema de pagos:</Typography>
                <Chip
                  label={mpLoaded ? 'Listo' : 'Cargando...'}
                  size="small"
                  color={mpLoaded ? 'success' : 'warning'}
                />
              </Box>
            </Box>

            {/* Información sobre el proceso */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                💳 Proceso de Pago
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Al hacer clic en "Pagar", se abrirá una ventana con las opciones de pago de MercadoPago. 
                Podrás pagar con tarjeta de crédito, débito, efectivo, o tu cuenta de MercadoPago.
              </Typography>
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
                    onClick={handleContinuePayment}
                    disabled={isCreatingPreference || !mpLoaded || isProcessingPayment}
                  >
                    {isCreatingPreference ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        <Typography variant="h7">Preparando pago...</Typography>
                      </Box>
                    ) : isProcessingPayment ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        <Typography variant="h7">Procesando...</Typography>
                      </Box>
                    ) : (
                      <Typography variant="h7">Pagar</Typography>
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