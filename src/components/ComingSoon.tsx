'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import FooterComponent from './FooterComponent';
import NavbarComponent from './NavbarComponent';

const ComingSoon = () => {
  return (
    <>
      <NavbarComponent/>
      <div className='h-16'></div>
      <Container
        maxWidth="md"
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 6,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: 300, sm: 330, md: 350 },
            height: { xs: 300, sm: 330, md: 350 },
            mb: 4,
          }}
        >
          <Image
            src="https://tricks-bucket.s3.us-east-2.amazonaws.com/relax.svg"
            alt="Coming Soon"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Esta página estará disponible pronto
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 500 }}
        >
          Estamos trabajando para habilitar esta sección lo antes posible.
          Gracias por tu paciencia y comprensión.
        </Typography>

        <Button
          component={Link}
          href="/"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            px: 4,
            borderRadius: 8,
            textTransform: 'none',
            boxShadow: 3,
          }}
        >
          Volver al inicio
        </Button>
      </Container>
      <FooterComponent/>
    </>
  );
};

export default ComingSoon;
