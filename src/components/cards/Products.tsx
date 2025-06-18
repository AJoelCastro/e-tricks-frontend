import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, CardHeader } from '@mui/material';

type Product = {
  title: string;
  description: string;
  image: string;
  price: number;
}
type Props = {
  products: Product;
}
const ProductCard: React.FC<Props> =({products})=> {
  return (
    <Card style={{position: "relative"}}>
      <CardMedia
        component="img"
        height="194"
        image={products.images[0]}
        alt="Paella dish"
      />
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
        <IconButton aria-label="add to favorites">
          <FavoriteBorderIcon sx={{ 
            color: 'inherit',
            '&:hover': { 
              color: 'red',
              cursor: 'pointer'
            }
          }}
            fontSize='small'
          />
        </IconButton>
      </Box>
      <CardHeader title={products.name}/>
      <CardContent sx={{backgroundColor: "white"}}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {products.description}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          S/ {products.price}
        </Typography>
      </CardContent>
      
    </Card>
  );
}
export default ProductCard;