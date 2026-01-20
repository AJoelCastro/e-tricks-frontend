import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const ProtectionConsumer = () => {
  return (
    <>
        <Box sx={{ mt: 3, mb: 2}}>
            <Box sx={{ marginBottom:1}}>
                <Typography variant="h7" sx={{ fontWeight: 'semibold' }}>
                    Ahora puedes pagar con <strong>Yape</strong>
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 1,
                marginBottom: 1,
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
                <Box>
                    <Image
                        src="https://imgs.search.brave.com/cIm__eRvkfQK61DHoU-3aq9ad9EArvbEjpIjw1z1_k4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRpbmctcGVydS5i/ZWdsb2JhbC5iaXov/d3AtY29udGVudC91/cGxvYWRzL2VsZW1l/bnRvci90aHVtYnMv/eWFwZS1sb2dvLWZv/bmRvLXRyYW5zcGFy/ZW50ZS1yMHl3aW9r/MXV6N2N3bXh6bWpp/bDdjbDdydWRpNHpp/Y2d1eHlwcWpubHcu/cG5n"
                        alt="Yape"
                        width={45}
                        height={45}
                    />
                </Box>
            </Box>
        </Box>
    </>
  )
}

export default ProtectionConsumer
