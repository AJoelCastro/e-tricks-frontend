import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Slide, Fade } from '@mui/material';
import { Close, Error, Warning, CheckCircle, Info } from '@mui/icons-material';

interface ErrorNotificationProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  autoHideDuration?: number;
  position?: 'top' | 'bottom';
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  open,
  onClose,
  message,
  type = 'error',
  autoHideDuration = 5000,
  position = 'top'
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      if (autoHideDuration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoHideDuration);
        return () => clearTimeout(timer);
      }
    }
  }, [open, autoHideDuration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Tiempo de la animación de salida
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: <Error sx={{ fontSize: 24 }} />,
          backgroundColor: '#ffebee',
          borderColor: '#f44336',
          iconColor: '#f44336',
          textColor: '#c62828'
        };
      case 'warning':
        return {
          icon: <Warning sx={{ fontSize: 24 }} />,
          backgroundColor: '#fff8e1',
          borderColor: '#ff9800',
          iconColor: '#ff9800',
          textColor: '#e65100'
        };
      case 'success':
        return {
          icon: <CheckCircle sx={{ fontSize: 24 }} />,
          backgroundColor: '#e8f5e8',
          borderColor: '#4caf50',
          iconColor: '#4caf50',
          textColor: '#2e7d32'
        };
      case 'info':
        return {
          icon: <Info sx={{ fontSize: 24 }} />,
          backgroundColor: '#e3f2fd',
          borderColor: '#2196f3',
          iconColor: '#2196f3',
          textColor: '#1565c0'
        };
      default:
        return {
          icon: <Error sx={{ fontSize: 24 }} />,
          backgroundColor: '#ffebee',
          borderColor: '#f44336',
          iconColor: '#f44336',
          textColor: '#c62828'
        };
    }
  };

  const config = getTypeConfig();

  if (!open) return null;

  return (
    <Slide direction={position === 'top' ? 'down' : 'up'} in={visible} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: position === 'top' ? 20 : 'auto',
          bottom: position === 'bottom' ? 20 : 'auto',
          // Centrado responsive mejorado
          left: { xs: 16, sm: '50%' }, // En móvil usar margen fijo, en desktop centrar
          right: { xs: 16, sm: 'auto' }, // En móvil usar margen fijo en ambos lados
          transform: { xs: 'none', sm: 'translateX(-50%)' }, // Solo transformar en desktop
          zIndex: 9999,
          // Ancho responsive
          width: { xs: 'auto', sm: 'auto' },
          maxWidth: { xs: 'none', sm: '500px' },
          minWidth: { xs: 'auto', sm: '300px' },
        }}
      >
        <Fade in={visible}>
          <Box
            sx={{
              backgroundColor: config.backgroundColor,
              border: `2px solid ${config.borderColor}`,
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              backdropFilter: 'blur(8px)',
              position: 'relative',
              overflow: 'hidden',
              // Ancho completo en móvil
              width: '100%',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: config.borderColor,
              }
            }}
          >
            {/* Icono */}
            <Box
              sx={{
                color: config.iconColor,
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              {config.icon}
            </Box>

            {/* Mensaje */}
            <Typography
              variant="body1"
              sx={{
                color: config.textColor,
                fontWeight: 500,
                flex: 1,
                lineHeight: 1.4,
                fontSize: { xs: '0.875rem', sm: '1rem' }, // Texto más pequeño en móvil
                wordBreak: 'break-word', // Evitar overflow del texto
              }}
            >
              {message}
            </Typography>

            {/* Botón de cerrar */}
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                color: config.iconColor,
                flexShrink: 0,
                padding: { xs: 0.25, sm: 0.5 }, // Botón más pequeño en móvil
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Close sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>

            {/* Barra de progreso para auto-hide */}
            {autoHideDuration > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '3px',
                  backgroundColor: config.borderColor,
                  animation: `progressBar ${autoHideDuration}ms linear`,
                  '@keyframes progressBar': {
                    from: {
                      width: '100%',
                    },
                    to: {
                      width: '0%',
                    },
                  },
                }}
              />
            )}
          </Box>
        </Fade>
      </Box>
    </Slide>
  );
};

export default ErrorNotification;