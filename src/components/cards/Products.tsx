import * as React from 'react';
import {
  Box, Card, CardContent, CardMedia, Typography, IconButton,
  Grid, Rating
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

type Resenia = {
  cliente: string;
  valoracion: number;
  comentario: string;
};

type Product = {
  name: string;
  description: string;
  images: string[];
  price: number;
  marca: string;
  descuento?: number;
  resenias?: Resenia[];
};

type Props = {
  products: Product;
};

const ProductCard: React.FC<Props> = ({ products }) => {
  console.log("pr",products)
  const promedio =
    products.resenias && products.resenias.length
      ? products.resenias.map(r => r.valoracion).reduce((a, b) => a + b, 0) / products.resenias.length
      : 0;
  React.useEffect(() => {
    
  }, [])
  
  return (
    <Box sx={{ height: '100%' }} className='h-80'> 
      <Card
        sx={{
          position: 'relative',
          height: '100%',
          '&:hover .add-to-cart-container': {
            opacity: 1,
            bottom: 0,
          },
        }}
      >
        <CardMedia
          component="img"
          height="194"
          image={products.images[0]}
          alt={products.name}
          sx={{ objectFit: 'contain' }}
        />

        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <IconButton aria-label="add to favorites" onClick={()=>{}}>
            <FavoriteBorderIcon
              sx={{
                color: 'inherit',
                '&:hover': {
                  color: 'red',
                  cursor: 'pointer',
                },
              }}
            />
          </IconButton>
        </Box>

        <CardContent sx={{ paddingBottom: '60px' }}> 
          <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            {products.marca}
          </Typography>
          
          <Grid container spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Grid item>
              <Typography variant="h4" sx={{ color: 'text.primary' }}>
                {products.name}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
            <Grid item>
              <Rating precision={0.5} value={promedio} readOnly />
            </Grid>
            <Grid item>
              <Typography variant="body2" color="text.secondary" fontSize="14px">
                {products.resenias?.length ?? 0} reseñas
              </Typography>
            </Grid>
          </Grid>

          {products.descuento ? (
            <Box mt={2}>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    S/ {products.price}
                  </Typography>
                </Grid>
                <Grid item sx={{ backgroundColor: 'red', borderRadius: '6px', px: 1 }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {products.descuento}%
                  </Typography>
                </Grid>
              </Grid>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'line-through',
                  fontSize: '12px',
                }}
              >
                S/ {products.price + (products.price * products.descuento) / 100}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: 'text.primary', mt: 2 }}>
              S/ {products.price}
            </Typography>
          )}
        </CardContent>

        <Box
          className="add-to-cart-container"
          sx={{
            position: 'absolute',
            bottom: '-50px',
            left: 0,
            right: 0,
            opacity: 0,
            transition: 'all 0.3s ease',
            p: 1,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center'
          }}
        >
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3d8b40';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4CAF50';
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ marginRight: '8px' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Añadir al carro
          </button>
        </Box>
      </Card>
    </Box>
  );
};

export default ProductCard;