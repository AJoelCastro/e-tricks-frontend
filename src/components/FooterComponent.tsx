'use client'
import React from 'react';
import { Box, Grid, Typography, Button, Divider, IconButton } from '@mui/material';
import Image from 'next/image';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const FooterComponent = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'white',
        color: 'text.primary',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 4 },
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <Grid container spacing={4}>

        <Grid  size={{xs:12, sm:6, md:4}}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    src="/tricks_logo_black.svg"
                    alt="Tricks Logo"
                    width={150}
                    height={30}
                    priority
                />
            </Box>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              ¡Te esperan muchos beneficios y sorpresas!
              Regístrate, acumula puntos y úsalos en todas tus compras.
            </Typography>
            <Button
              variant="outlined"
              sx={{
                mt: 2,
                borderColor: '#111',
                color: '#111',
                ':hover': {
                  backgroundColor: '#111',
                  color: '#fff',
                },
              }}
              fullWidth
            >
              Descubre más
            </Button>
          </Box>
        </Grid>
        <Grid size={{xs:12, sm:6, md:8}}>
          <Grid container spacing={4}>
            {[
              { title: 'ACERCA DE', items: ['About Us', 'Contact Us', 'Careers', 'Blog'] },
              { title: 'TÉRMINOS Y CONDICIONES', items: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Legal'] },
              { title: 'LEGAL', items: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Legal'] }
            ].map((section, index) => (
              <Grid size={{xs:12, sm:6, md:4}} key={index}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {section.title}
                </Typography>
                {section.items.map((item, idx) => (
                  <Typography
                    key={idx}
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 1,
                      transition: 'color 0.2s',
                      cursor: 'pointer',
                      ':hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Grid container justifyContent="space-between" alignItems="center">
        <Grid size={{xs:12, sm:6, md:6}}>
          <Typography variant="body2" sx={{ textAlign: { xs: 'center', md: 'left' }, color: 'text.secondary' }}>
            © {new Date().getFullYear()} Tricks. All rights reserved.
          </Typography>
        </Grid>
        <Grid size={{xs:12, sm:6, md:6}}>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
            {[Facebook, Instagram, Youtube].map((Icon, idx) => (
              <IconButton
                key={idx}
                sx={{
                  transition: 'all 0.3s ease',
                  ':hover': {
                    transform: 'scale(1.1)',
                    color: 'primary.main',
                  },
                }}
              >
                <Icon />
              </IconButton>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FooterComponent;
