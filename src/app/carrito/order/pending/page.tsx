'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, Card, CardContent, LinearProgress } from '@mui/material';
import { HourglassEmpty, Refresh } from '@mui/icons-material';
import { useAuth } from '@clerk/nextjs';
import OrderService from '@/services/OrderService';

const OrderPendingPage = () => {
  const [orderData, setOrderData] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [pollAttempts, setPollAttempts] = useState(0);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const pollPaymentStatus = async () => {
      if (!orderId || !isPolling) return;

      try {
        const token = await getToken();
        if (!token) return;

        const result = await OrderService.checkPaymentStatus(token, orderId);
        setOrderData(result.order);

        // Si el pago fue aprobado, redirigir a success
        if (result.isPaid) {
          router.push(`/order/success?orderId=${orderId}`);
          return;
        }

        // Si fue rechazado, redirigir a failure
        if (result.order.paymentStatus === 'rejected' || 
            result.order.paymentStatus === 'cancelled') {
          router.push(`/order/failure?orderId=${orderId}`);
          return;
        }

        // Continuar polling hasta 30 intentos (5 minutos)
        if (pollAttempts < 30) {
          setPollAttempts(prev => prev + 1);
          setTimeout(() => {
            if (isPolling) {
              pollPaymentStatus();
            }
          }, 10000); // cada 10 segundos
        } else {
          setIsPolling(false);
        }

      } catch (error) {
        console.error('Error polling payment status:', error);
        setIsPolling(false);
      }
    };

    if (orderId) {
      pollPaymentStatus();
    }

    // Cleanup
    return () => {
      setIsPolling(false);
    };
  }, [orderId, pollAttempts, isPolling, getToken, router]);

  const handleCheckStatus = async () => {
    setIsPolling(true);
    setPollAttempts(0);
  };

  const progressValue = Math.min((pollAttempts / 30) * 100, 100);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      gap: 3,
      p: 3
    }}>
      <HourglassEmpty 
        sx={{ 
          fontSize: 100, 
          color: 'warning.main',
          animation: 'pulse 2s infinite'
        }} 
      />
      
      <Typography variant="h3" color="warning.main" textAlign="center">
        Pago pendiente
      </Typography>
      
      <Typography variant="h6" textAlign="center" color="text.secondary">
        Estamos esperando la confirmación de tu pago
      </Typography>

      <Typography variant="body1" textAlign="center" sx={{ maxWidth: 600 }}>
        Tu pago está siendo procesado. Esto puede tomar unos minutos dependiendo 
        del método de pago seleccionado. No cierres esta ventana, te notificaremos 
        cuando se complete.
      </Typography>

      {isPolling && (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="body2" textAlign="center" sx={{ mb: 1 }}>
            Verificando estado del pago... ({pollAttempts}/30)
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progressValue}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      )}

      {orderData && (
        <Card sx={{ maxWidth: 500, width: '100%', mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Detalles de la orden
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Número de orden:</Typography>
              <Typography fontWeight="bold">{orderData._id}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Total:</Typography>
              <Typography fontWeight="bold">S/ {orderData.totalAmount?.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Estado del pago:</Typography>
              <Typography fontWeight="bold" color="warning.main">
                Pendiente
              </Typography>
            </Box>
            {orderData.paymentMethod && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Método de pago:</Typography>
                <Typography fontWeight="bold">
                  {orderData.paymentMethod === 'mercado_pago' ? 'MercadoPago' : orderData.paymentMethod}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          startIcon={<Refresh />}
          onClick={handleCheckStatus}
          disabled={isPolling}
        >
          {isPolling ? 'Verificando...' : 'Verificar ahora'}
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={() => router.push('/orders')}
        >
          Ver mis órdenes
        </Button>
        
        <Button 
          variant="text" 
          onClick={() => router.push('/')}
        >
          Volver al inicio
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          💡 <strong>Consejo:</strong> Si realizaste el pago por transferencia bancaria 
          o método offline, puede tomar hasta 24 horas en confirmarse.
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          ¿Necesitas ayuda? Contacta con soporte: 
          <br />
          📧 soporte@tutienda.com | 📱 +51 969 742 589
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderPendingPage;