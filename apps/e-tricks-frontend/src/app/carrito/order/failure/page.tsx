'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Error, Refresh } from '@mui/icons-material';
import { useAuth } from '@clerk/nextjs';
import OrderService from '@/services/OrderService';

const OrderFailurePage = () => {
  const [orderData, setOrderData] = useState<any>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadOrderData = async () => {
      if (!orderId) return;

      try {
        const token = await getToken();
        if (token) {
          const response = await OrderService.getOrderDetails(token, orderId);
          setOrderData(response.data);
        }
      } catch (error) {
        console.error('Error loading order:', error);
      }
    };

    loadOrderData();
  }, [orderId, getToken]);

  const handleRetryPayment = () => {
    // Redirigir de vuelta al checkout con la misma orden
    router.push(`/checkout/payment?orderId=${orderId}`);
  };

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
      <Error sx={{ fontSize: 100, color: 'error.main' }} />
      
      <Typography variant="h3" color="error.main" textAlign="center">
        Pago no completado
      </Typography>
      
      <Typography variant="h6" textAlign="center" color="text.secondary">
        Hubo un problema procesando tu pago
      </Typography>

      <Typography variant="body1" textAlign="center" sx={{ maxWidth: 500 }}>
        No te preocupes, tu orden está guardada y puedes intentar pagar nuevamente.
        No se realizó ningún cargo a tu método de pago.
      </Typography>

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
              <Typography>Total a pagar:</Typography>
              <Typography fontWeight="bold">S/ {orderData.totalAmount?.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Estado:</Typography>
              <Typography fontWeight="bold" color="error.main">
                Pago fallido
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<Refresh />}
          onClick={handleRetryPayment}
        >
          Intentar nuevamente
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={() => router.push('/')}
        >
          Volver al inicio
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 3 }}>
        Si el problema persiste, contacta con nuestro soporte al: 
        <br />
        📧 soporte@tricks.com | 📱 +51 969 742 589
      </Typography>
    </Box>
  );
};

export default OrderFailurePage;