'use client';
import NextImage from 'next/image';
import NextLink from 'next/link';
import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';

type ImageData = {
  title: string;
  url: string;
  to: string;
};

type Props = {
  image: ImageData;
};

const ThreeImages: React.FC<Props> = ({ image }) => {
  return (
    <MuiLink
      component={NextLink}
      href={image.to}
      underline="none"
      sx={{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: { xs: 300, md: 400 },
        overflow: 'hidden',
        borderRadius: 1,
      }}
    >
      <NextImage
        src={image.url}
        alt={image.title}
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
        priority
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.35)',
          },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          color: '#fff',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            backgroundColor: 'rgba(220, 38, 38, 0.8)', // red-600
            px: 2,
            py: 0.5,
            borderRadius: 0.5,
            fontWeight: 600,
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(220, 38, 38, 1)',
            },
          }}
        >
          HASTA 40% OFF
        </Typography>
        <Typography variant="h3" fontWeight="bold" fontSize={{ xs: '2rem', md: '3rem' }}>
          {image.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textDecoration: 'underline',
            fontWeight: 300,
          }}
        >
          Ver más
        </Typography>
      </Box>
    </MuiLink>
  );
};

export default ThreeImages;
