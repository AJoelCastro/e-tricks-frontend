import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, IconButton, Fade, Slide } from '@mui/material';
import { Close as CloseIcon, ShoppingBag, CreditCard } from '@mui/icons-material';
import Link from 'next/link';
import { IProduct } from '@/interfaces/Product';

interface CartNotificationProps {
  open: boolean;
  onClose: () => void;
  product: IProduct | null;
  size?: string;
  quantity?: number;
  autoHideDuration?: number;
}

const CartNotificationModal: React.FC<CartNotificationProps> = ({
  open,
  onClose,
  product,
  size,
  quantity = 1,
  autoHideDuration = 5000
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
      
      
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 600); // Tiempo para la animación de salida
  };

  if (!open || !product) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 80, sm: 90 },
        right: { xs: 16, sm: 24 },
        zIndex: 9999,
        width: { xs: '90vw', sm: 380 },
        maxWidth: 380
      }}
    >
      <Slide direction="left" in={show} timeout={300}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #7950f2 0%, #6a40e0 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingBag sx={{ fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                ¡Agregado al carrito!
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{ 
                color: 'white', 
                padding: 0.5,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
       
              <Box sx={{ flexShrink: 0 }}>
                <CardMedia
                  component="img"
                  image={product.images[0]}
                  alt={product.name}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                />
              </Box>

              {/* Información del producto */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '0.85rem',
                    color: 'text.secondary',
                    mb: 0.5
                  }}
                >
                  {product.brand.name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    lineHeight: 1.2,
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  {size && (
                    <Typography variant="caption" sx={{ 
                      backgroundColor: '#f5f5f5', 
                      px: 1, 
                      py: 0.25, 
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      Talla: {size}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ 
                    backgroundColor: '#f5f5f5', 
                    px: 1, 
                    py: 0.25, 
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    Cant: {quantity}
                  </Typography>
                </Box>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#7950f2',
                    fontSize: '1rem'
                  }}
                >
                  S/ {product.price}
                </Typography>
              </Box>
            </Box>

       
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Link href="/carrito" style={{ flex: 1, textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ShoppingBag sx={{ fontSize: '16px' }} />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    py: 0.75,
                    borderColor: '#7950f2',
                    color: '#7950f2',
                    '&:hover': {
                      borderColor: '#6a40e0',
                      backgroundColor: 'rgba(121, 80, 242, 0.04)'
                    }
                  }}
                  onClick={handleClose}
                >
                  Ver carrito
                </Button>
              </Link>
              
              <Link href="/carrito/delivery" style={{ flex: 1, textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CreditCard sx={{ fontSize: '16px' }} />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    py: 0.75,
                    background: 'linear-gradient(135deg, #7950f2 0%, #6a40e0 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6a40e0 0%, #5b30ce 100%)'
                    }
                  }}
                  onClick={handleClose}
                >
                  Ir a pago
                </Button>
              </Link>
            </Box>
          </CardContent>

          {/* Barra de progreso para el auto-close */}
          <Box
            sx={{
              height: 3,
              background: 'linear-gradient(90deg, #7950f2 0%, #6a40e0 100%)',
              animation: `shrink ${autoHideDuration}ms linear`,
              '@keyframes shrink': {
                '0%': { width: '100%' },
                '100%': { width: '0%' }
              }
            }}
          />
        </Card>
      </Slide>
    </Box>
  );
};

export default CartNotificationModal;