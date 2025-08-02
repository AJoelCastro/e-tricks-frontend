'use client';
import FooterComponent from '@/components/principal/FooterComponent'
import NavbarComponent from '@/components/principal/NavbarComponent'
import { IBrand } from '@/interfaces/Brand'
import BrandService from '@/services/BrandService'
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  Container,
  Skeleton,
  Alert
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link';

const MainMarcasPageSection = () => {
  const [brands, setBrands] = useState<Array<IBrand>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getBrands = async () => {
    try {
      setLoading(true);
      const data = await BrandService.getBrands();
      setBrands(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setError('Error al cargar las marcas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBrands();
  }, []);

  const BrandCard = ({ brand }: { brand: IBrand }) => (
    <Link href={`/marcas/${brand.name.toLocaleLowerCase()}`}>
      <Box 
        sx={{ 
          position: 'relative',
          height: { xs: 500, sm: 550, md: 600 },
          borderRadius: 1,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          },
          '& .brand-name': {
            transform: 'translateY(20px)',
            opacity: 0,
            transition: 'all 0.4s ease-in-out',
          },
          '&:hover .brand-name': {
            transform: 'translateY(0px)',
            opacity: 1,
          }
        }}
      > 
        {/* Imagen de fondo completa */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <Image
            src={brand.image}
            alt={`Marca ${brand.name}`}
            fill
            style={{
              objectFit: 'cover',
              transition: 'transform 0.4s ease-in-out'
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay gradiente */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)',
              transition: 'background 0.3s ease-in-out',
            }}
          />
          
          {/* Overlay hover más intenso */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.2)',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
              '.card:hover &': {
                opacity: 1
              }
            }}
          />
        </Box>

        {/* Nombre de la marca superpuesto */}
        <Box 
          className="brand-name"
          sx={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 4,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            minHeight: 120,
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 900,
              color: 'white',
              textAlign: 'center',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              lineHeight: 1,
            }}
          >
            {brand.name}
          </Typography>
        </Box>
      </Box>
    </Link>
    
  );


  return (
    <>
      <NavbarComponent/>
      <div className='h-16'></div>
      
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', py: 3, px: { xs: 2, md: 4 }}}>
          
          {/* Stats Section */}
          {!loading && brands.length > 0 && (
            <Box sx={{ textAlign: 'center', mb: 4, pb: 4, borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#2d3748' }}>
                {brands.length}+ Marcas
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Trabajamos con las mejores marcas para ofrecerte la mayor variedad y calidad
              </Typography>
            </Box>
          )}
          <Grid container spacing={{ xs: 3, md: 2 }}>
            {
              brands.map((brand) => (
                <Grid 
                  size={{ xs: 12, sm: 6, md: 4 }}
                  key={brand._id}
                  className="card"
                >
                  <BrandCard brand={brand} />
                </Grid>
              ))
            }
          </Grid>

          
      </Box>
      <FooterComponent/>
    </>
  )
}

export default MainMarcasPageSection
