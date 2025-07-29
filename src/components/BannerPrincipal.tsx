'use client';

import { Box, Button } from '@mui/material';
import Image from 'next/image';
import { IBannerPrincipal } from '@/interfaces/BannerPrincipal';
import { useRouter } from 'next/navigation';
import { useMediaQuery, useTheme } from '@mui/material';

interface BannerPrincipalProps {
  banner: IBannerPrincipal;
}

const BannerPrincipal = ({ banner }: BannerPrincipalProps) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!banner) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh', // ocupa toda la pantalla
        overflow: 'hidden',
      }}
    >
      {/* Imagen de fondo según dispositivo */}
      <Image
        src={isMobile ? banner.imageMobile : banner.image}
        alt="Banner Principal"
        fill
        style={{
          objectFit: 'cover',
          zIndex: -1,
        }}
        priority
      />

      {/* Overlay oscuro */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }}
      />

      {/* Botones */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {banner.links.map((link, index) => (
          <Button
            key={index}
            variant="contained"
            sx={{
              backgroundColor: '#7950f2',
              color: '#fff',
              px: 3,
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#6741d9',
              },
              width: isMobile ? '200px' : 'auto',
            }}
            onClick={() => router.push(link.link)}
          >
            {link.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default BannerPrincipal;
