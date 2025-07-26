// components/payment/AntiResetCardPayment.js
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { CardPayment } from '@mercadopago/sdk-react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';

// Interfaces para tipado
interface MPPaymentData {
    id: string;
    status: string;
    [key: string]: unknown; // Cambiado de 'any' a 'unknown'
}

interface MPError {
    message: string;
    type: string;
    [key: string]: unknown; // Cambiado de 'any' a 'unknown'
}

interface AntiResetCardPaymentProps {
    total: number;
    userEmail?: string;
    onSubmit: (param: MPPaymentData) => Promise<void> | void;
    onError?: (error: MPError) => void;
    onReady?: () => void;
    isProcessing?: boolean;
}

// Definir tipos específicos para los métodos de pago
interface PaymentMethods {
    creditCard?: string;
    debitCard?: string;
    mercadoPago?: string;
}

interface PaymentConfig {
    initialization: {
        amount: number;
        payer: {
            email: string;
        };
    };
    customization: {
        visual: {
            hidePaymentButton: boolean;
            style: {
                theme: string;
            };
        };
        paymentMethods: PaymentMethods; // Cambiado de {} a PaymentMethods
    };
}

// Tipo para los datos del formulario de MercadoPago
interface MPFormData {
    id?: string;
    status?: string;
    [key: string]: unknown;
}

const CustomCardPayment: React.FC<AntiResetCardPaymentProps> = ({
    total,
    userEmail,
    onSubmit,
    onError,
    onReady,
    isProcessing = false
}) => {
    const [isCardReady, setIsCardReady] = useState<boolean>(false);
    const cardPaymentRef = useRef<HTMLDivElement | null>(null);
    const configCreated = useRef<boolean>(false);
    const lastConfigRef = useRef<PaymentConfig | null>(null);

    // CONFIGURACIÓN FIJA - Se crea UNA SOLA VEZ y NO CAMBIA
    const createStableConfig = useCallback((): PaymentConfig => {
        if (configCreated.current && lastConfigRef.current) {
            // IMPORTANTE: Solo actualizar el monto SIN recrear el componente
            const currentAmount = lastConfigRef.current?.initialization?.amount || 0;
            if (currentAmount !== total) {
                console.log('Updating amount without resetting form:', total);
                lastConfigRef.current.initialization.amount = total;
            }

            // Actualizar email si cambió
            const currentEmail = lastConfigRef.current?.initialization?.payer?.email || '';
            const newEmail = userEmail || 'test@test.com';
            if (currentEmail !== newEmail) {
                console.log('Updating email without resetting form:', newEmail);
                lastConfigRef.current.initialization.payer.email = newEmail;
            }

            return lastConfigRef.current;
        }

        const config: PaymentConfig = {
            initialization: {
                amount: total,
                payer: {
                    email: userEmail || 'test@test.com',
                }
            },
            customization: {
                visual: {
                    hidePaymentButton: false,
                    style: {
                        theme: 'default'
                    }
                },
                paymentMethods: {
                    creditCard: 'all',
                    debitCard: 'all',
                    mercadoPago: 'all'
                }
            }
        };

        configCreated.current = true;
        lastConfigRef.current = config;
        return config;
    }, [total, userEmail]);

    const stableConfig = createStableConfig();

    const handleReady = useCallback((): void => {
        console.log('✅ CardPayment ready - Form will NEVER reset now');
        setIsCardReady(true);
        if (onReady) onReady();
    }, [onReady]);

    const handleSubmit = useCallback(
        async (
            formData: MPFormData, // Cambiado de 'any' a 'MPFormData'
            _additionalData?: unknown // Cambiado de 'any' a 'unknown'
        ): Promise<void> => {
            try {
                const paymentData: MPPaymentData = {
                    id: formData.id || '',
                    status: formData.status || '',
                    ...formData
                };
                await onSubmit?.(paymentData);
            } catch (error) {
                if (onError) onError(error as MPError);
            }
        },
        [onSubmit, onError]
    );

    const handleError = useCallback((error: MPError): void => {
        console.error('❌ CardPayment error:', error);
        if (onError) onError(error);
    }, [onError]);

    return (
        <Box sx={{ width: '100%', minHeight: '400px', position: 'relative' }}>
            {/* Indicador de carga inicial */}
            {!isCardReady && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        zIndex: 1,
                        borderRadius: 2
                    }}
                >
                    <CircularProgress size={40} sx={{ mb: 2, color: '#7950f2' }} />
                    <Typography variant="body2" color="text.secondary">
                        Inicializando formulario de pago...
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        El formulario mantendrá tus datos
                    </Typography>
                </Box>
            )}

            {/* Overlay de procesamiento */}
            {isProcessing && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(123, 80, 242, 0.1)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 2,
                        borderRadius: 2
                    }}
                >
                    <CircularProgress size={50} sx={{ mb: 2, color: '#7950f2' }} />
                    <Typography variant="h6" sx={{ color: '#7950f2', fontWeight: 'bold' }}>
                        Procesando pago...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        No cierres esta ventana
                    </Typography>
                </Box>
            )}

            <div
                ref={cardPaymentRef}
                id="ultra_stable_cardpayment_container"
                style={{
                    width: '100%',
                    minHeight: '400px',
                    opacity: isCardReady ? 1 : 0.1,
                    transition: 'opacity 0.5s ease',
                    borderRadius: '8px'
                }}
            >
                {/* arreglar aqui de acuerdo a la docu */}
                <CardPayment
                    key="ultra-stable-never-reset" // Key fijo que NUNCA cambia
                    initialization={stableConfig.initialization}
                    customization={undefined}
                    onSubmit={()=>handleSubmit({},{})}
                    onReady={handleReady}
                    onError={undefined}
                />

                <Button
                    type='submit'
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3, borderRadius: 2, mb: { xs: 4, sm: 2, md: 0 } }}
                >
                    Pagar
                </Button>
            </div>

            {/* Debug info (remover en producción) */}
            {process.env.NODE_ENV === 'development' && (
                <Box sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: 0,
                    fontSize: '10px',
                    color: 'gray',
                    display: 'flex',
                    gap: 1
                }}>
                    <span>💰 Total: ${total}</span>
                    <span>📧 Email: {userEmail}</span>
                    <span>✅ Ready: {isCardReady ? 'Yes' : 'No'}</span>
                    <span>⚡ Processing: {isProcessing ? 'Yes' : 'No'}</span>
                </Box>
            )}
        </Box>
    );
};

// Hook personalizado para usar con el componente
interface UseStableCardPaymentReturn {
    paymentData: MPPaymentData | null;
    isFormReady: boolean;
    handlePaymentReady: () => void;
    handlePaymentSubmit: (data: MPPaymentData) => Promise<MPPaymentData>;
}

export const useStableCardPayment = (): UseStableCardPaymentReturn => {
    const [paymentData, setPaymentData] = useState<MPPaymentData | null>(null);
    const [isFormReady, setIsFormReady] = useState<boolean>(false);

    const handlePaymentReady = useCallback((): void => {
        console.log('🎯 Payment form is stable and ready');
        setIsFormReady(true);
    }, []);

    const handlePaymentSubmit = useCallback(async (data: MPPaymentData): Promise<MPPaymentData> => {
        console.log('🚀 Submitting stable payment data:', data);
        setPaymentData(data);
        return data;
    }, []);

    return {
        paymentData,
        isFormReady,
        handlePaymentReady,
        handlePaymentSubmit
    };
};

export default CustomCardPayment;