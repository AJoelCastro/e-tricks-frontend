import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from "@clerk/nextjs";
import MainCarouselComponent from '../../components/carousel/MainCarousel'
import { imagesPrueba } from '@/data/ThreeImagesPrueba'
import ProductCard from '../../components/cards/Products'
import ThreeImages from '../../components/sections/ThreeImages'
import ProductService from '@/services/ProductService'
import UserService from '@/services/UserService';
import { Box, Grid } from '@mui/material';
import NavbarComponent from '@/components/NavbarComponent';
import FooterComponent from '@/components/FooterComponent';


const MainComponent = () => {
  const { isSignedIn } = useAuth();
  const [dataProducts, setDataProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const getProducts = async () => {
    try{
      const data = await ProductService.GetProducts();
      setDataProducts(data);
    }catch(error){
      throw error
    }
  }
  const getFavorites = async () => {
    if (!isSignedIn) return;
    const data = await UserService.getFavoriteIds();
    setFavoriteIds(data);
  }
  useEffect(() => {
    getFavorites();
    getProducts();
  }, [isSignedIn]);

  const handleRemoveFavorite = useCallback(
    async (id:string) => {
      try {
          const dataRemove = await UserService.removeFavorite(id)
          console.log("data r", dataRemove)
          getFavorites()
      } catch (error) {
          throw error
      }
    },
    [],
  )

  const handleAddFavorite = useCallback(
    async(id:string) => {
      try {
        const dataAdd = await UserService.addFavorite(id)
        console.log("data a", dataAdd)
        getFavorites()
      } catch (error) {
        throw error
      }
    },
    [],
  )
  

  return (
    <>
      <NavbarComponent/>
      <Box sx={{height:{xs:64, sm:64, md:0}}}></Box>
      <Box>
        <MainCarouselComponent />
        <Grid container size={12}>
          {
            imagesPrueba.map((image, index) => (
              <Grid key={index} size={{xs:12, sm:6, md:4}} sx={{marginX:'auto'}}>
                <ThreeImages image={image}/>
              </Grid>
            ))
          }
        </Grid>
        <Grid container size={12}>
            {dataProducts.map((product, index) => (
              <Grid key={index} size={{xs:6, sm:4, md:3}} sx={{marginX:'auto'}}>
                <ProductCard products={product} markedFavorite={isSignedIn && favoriteIds.includes(product._id)} handleRemoveFavorite={handleRemoveFavorite} handleAddFavorite={handleAddFavorite}/>
              </Grid>
            ))}
        </Grid>
      </Box>
      <FooterComponent/>
    </>
  )
}

export default MainComponent
