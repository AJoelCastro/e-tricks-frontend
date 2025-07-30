'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, Button, CircularProgress, Card, CardContent } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { useAuth } from '@clerk/nextjs';
import OrderService from '@/services/OrderService';
import { useRouter } from 'next/navigation';

const OrderSuccessPage = () => {
  const [orderStatus, setOrderStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderData, setOrderData] = useState<any>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkOrderStatus = async () => {
      if (!orderId) {
        setOrderStatus('error');
        return;
      }

      try {
        const token = await getToken();
        if (!token) {
          setOrderStatus('error');
          return;
        }

        // Usar polling para verificar el estado del pago
        const result = await OrderService.pollPaymentStatus(token, orderId, 15, 3000);
        
        if (result.isPaid || result.isProcessing) {
          setOrderData(result.order);
          setOrderStatus('success');
        } else {
          setOrderStatus('error');
        }
      } catch (error) {
        console.error('Error checking order status:', error);
        setOrderStatus('error');
      }
    };

    checkOrderStatus();
  }, [orderId, getToken]);

  if (orderStatus === 'loading') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Verificando tu pago...</Typography>
        <Typography variant="body2" color="text.secondary">
          Esto puede tomar unos segundos
        </Typography>
      </Box>
    );
  }

  if (orderStatus === 'error') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        gap: 2,
        p: 3
      }}>
        <Error sx={{ fontSize: 80, color: 'error.main' }} />
        <Typography variant="h4" color="error">
          Hubo un problema
        </Typography>
        <Typography variant="body1" textAlign="center">
          No pudimos verificar tu pago. Por favor, contacta con soporte.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/')}
          sx={{ mt: 2 }}
        >
          Volver al inicio
        </Button>
      </Box>
    );
  }

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
      <CheckCircle sx={{ fontSize: 100, color: 'success.main' }} />
      
      <Typography variant="h3" color="success.main" textAlign="center">
        ¡Pago exitoso!
      </Typography>
      
      <Typography variant="h6" textAlign="center">
        Tu orden ha sido procesada correctamente
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
              <Typography>Total pagado:</Typography>
              <Typography fontWeight="bold">S/ {orderData.totalAmount?.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Estado:</Typography>
              <Typography 
                fontWeight="bold" 
                color={orderData.status === 'processing' ? 'success.main' : 'primary.main'}
              >
                {orderData.status === 'processing' ? 'Procesando' : orderData.status}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => router.push('/compras')}
          sx={{
            backgroundColor: '#7950f2',
            '&:hover': {
              backgroundColor: '#6a40e0'
            }
          }}
        >
          Ver mis órdenes
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={() => router.push('/')}
          sx={{
            borderColor: '#7950f2',
            color: '#7950f2',
            '&:hover': {
              borderColor: '#6a40e0',
              backgroundColor: 'rgba(121, 80, 242, 0.04)'
            }
          }}
        >
          Seguir comprando
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 3 }}>
        Recibirás un correo de confirmación en breve con todos los detalles de tu compra.
      </Typography>
    </Box>
  );
};

export default OrderSuccessPage;