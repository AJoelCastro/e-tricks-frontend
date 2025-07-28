import { Box, Typography } from '@mui/material'
import React from 'react'

const ProtectionConsumer = () => {
  return (
    <>
        <Box sx={{ mt: 3, mb: 2}}>
            <Box sx={{ marginBottom:1}}>
                <Typography variant="h7" sx={{ fontWeight: 'semibold' }}>
                    Paga con
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                {/* Visa */}
                <Box sx={{
                    width: 50,
                    height: 32,
                    backgroundColor: '#1A1F71',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Typography sx={{
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        fontStyle: 'italic'
                    }}>
                        VISA
                    </Typography>
                </Box>

                {/* Mastercard */}
                <Box sx={{
                    width: 50,
                    height: 32,
                    backgroundColor: '#EB001B',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <Box sx={{
                        width: 18,
                        height: 18,
                        backgroundColor: '#EB001B',
                        borderRadius: '50%',
                        position: 'absolute',
                        left: '8px'
                    }} />
                    <Box sx={{
                        width: 18,
                        height: 18,
                        backgroundColor: '#FF5F00',
                        borderRadius: '50%',
                        position: 'absolute',
                        left: '16px'
                    }} />
                    <Box sx={{
                        width: 18,
                        height: 18,
                        backgroundColor: '#F79E1B',
                        borderRadius: '50%',
                        position: 'absolute',
                        left: '24px'
                    }} />
                </Box>



                {/* American Express */}
                <Box sx={{
                    width: 50,
                    height: 32,
                    backgroundColor: '#006FCF',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Typography sx={{
                        color: 'white',
                        fontSize: '8px',
                        fontWeight: 'bold'
                    }}>
                        AMEX
                    </Typography>
                </Box>
            </Box>
        </Box>

        {/* Sección de Protección del Comprador */}
        <Box sx={{
            mt: 3,
            mb: { xs: 4, sm: 2, md: 0 },
            p: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            border: '1px solid #e9ecef'
        }}>
            <Typography variant='h7' sx={{ color:'#414142ff' }}>
                Protección del comprador
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: '#28a745',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.2,
                }}>
                    <Typography sx={{
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        ✓
                    </Typography>
                </Box>
                <Typography variant='marcaCard' color='text.secondary'>
                    Recibe un reembolso de tu dinero si el artículo no llega o es diferente al de la descripción.
                </Typography>
            </Box>
        </Box>
    </>
  )
}

export default ProtectionConsumer
