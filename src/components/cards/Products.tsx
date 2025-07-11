import * as React from 'react';
import {
  Box, Card, CardContent, CardMedia, Typography, IconButton,
  Grid, Rating
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

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
  const promedio =
    products.resenias && products.resenias.length
      ? products.resenias.map(r => r.valoracion).reduce((a, b) => a + b, 0) / products.resenias.length
      : 0;

  return (
    <Box sx={{ height: '100%' }}>
      <Card
        sx={{
          position: 'relative',
          '&:hover .cart-icon': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        }}
      >
        <CardMedia
          component="img"
          height="194"
          image={products.images[0]}
          alt={products.name}
        />

        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <IconButton aria-label="add to favorites">
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

        <CardContent>
          <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            {products.marca}
          </Typography>
            <Grid container spacing={1} sx={{ alignItems: 'center', justifyContent:'space-between', mt: 1 }}>
              <Grid>
                <Typography variant="h4" sx={{ color: 'text.primary' }}>
                  {products.name}
                </Typography>
              </Grid>
              <Grid>
                <Box
                  className="cart-icon"
                  sx={{
                    opacity: 0,
                    transform: 'translateX(-10px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <IconButton aria-label="add-to-cart">
                    <AddShoppingCartIcon
                      sx={{
                        color: 'green',
                      }}
                    />
                  </IconButton>
                </Box>
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
      </Card>
    </Box>
  );
};

export default ProductCard;
