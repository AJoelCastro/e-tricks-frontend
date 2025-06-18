import React, { useEffect, useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import { Container, Grid, Box } from '@mui/material';

import MainCarouselComponent from '../carousel/MainCarousel';
import { imagesPrueba } from '@/data/ThreeImagesPrueba';
import ProductCard from '../cards/Products';
import ThreeImages from '../sections/ThreeImages';
import ProductService from '@/services/ProductService';

const MainComponent = () => {
  const { getToken } = useAuth();
  const [dataProducts, setDataProducts] = useState<Array<any>>([]);

  useEffect(() => {
    const getProducts = async () => {
      const data = await ProductService.GetProducts();
      setDataProducts(data);
    };
    getProducts();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: 'white', width: '100%' }} >
      {/* Carrusel principal */}
      <Box mb={4}>
        <MainCarouselComponent />
      </Box>

      {/* Tres imágenes en columnas */}
      <Grid container spacing={2} mb={4}>
        {imagesPrueba.map((image, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <ThreeImages image={image} />
          </Grid>
        ))}
      </Grid>

      {/* Lista de productos */}
      <Grid container spacing={2}>
        {dataProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ProductCard products={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MainComponent;
