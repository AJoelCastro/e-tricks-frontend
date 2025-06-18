'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Button, Container, Grid, Typography, Link, Divider, Stack, IconButton } from '@mui/material';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const FooterComponent = () => {
  return (
    <Box sx={{ bgcolor: 'white', color: 'grey.800', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Sección izquierda con logo y descripción */}
          <Grid item xs={12} lg={4}>
            <Box display="flex" flexDirection="column" alignItems={{ xs: 'center', lg: 'flex-start' }}>
              <Image
                src="/tricks_logo_black.svg"
                alt="Tricks Logo"
                width={150}
                height={30}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2, textAlign: { xs: 'center', lg: 'left' } }}>
                ¡Te esperan muchos beneficios y sorpresas! Regístrate, acumula puntos y úsalos en todas tus compras.
              </Typography>
              <Button 
                variant="contained" 
                sx={{
                  backgroundColor: 'white',
                  color: 'black',
                  width: '100%',
                  '&:hover': { backgroundColor: '#f3f3f3' },
                }}
              >
                Descubre más
              </Button>
            </Box>
          </Grid>

          {/* Secciones de enlaces */}
          <Grid item xs={12} lg={8}>
            <Grid container spacing={4}>
              {[
                { title: 'ACERCA DE', links: ['About Us', 'Contact Us', 'Careers', 'Blog'] },
                { title: 'TÉRMINOS Y CONDICIONES', links: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Legal'] },
                { title: 'LEGAL', links: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Legal'] },
              ].map((section, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                    {section.title}
                  </Typography>
                  <Stack spacing={1} mt={2}>
                    {section.links.map((link, i) => (
                      <Link
                        key={i}
                        href="#"
                        underline="none"
                        color="text.secondary"
                        sx={{
                          '&:hover': { color: 'primary.main' },
                          cursor: 'pointer'
                        }}
                      >
                        {link}
                      </Link>
                    ))}
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Redes sociales */}
        <Box display="flex" justifyContent={{ xs: 'space-between', lg: 'flex-end' }} mt={6} mb={2} gap={2}>
          <IconButton>
            <Facebook color="black" />
          </IconButton>
          <IconButton>
            <Instagram color="black" />
          </IconButton>
          <IconButton>
            <Youtube color="black" />
          </IconButton>
        </Box>

        {/* Copyright */}
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © 2023 Tricks. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default FooterComponent;
