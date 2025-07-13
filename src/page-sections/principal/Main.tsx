import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from "@clerk/nextjs";
import MainCarouselComponent from '../../components/carousel/MainCarousel'
import { imagesPrueba } from '@/data/ThreeImagesPrueba'
import ProductCard from '../../components/cards/Products'
import ThreeImages from '../../components/sections/ThreeImages'
import ProductService from '@/services/ProductService'
import UserService from '@/services/UserService';


const MainComponent = () => {
  const { isSignedIn } = useAuth();
  const [dataProducts, setDataProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const getProducts = async () => {
    const data = await ProductService.GetProducts();
    setDataProducts(data);
  }
  const getFavorites = async () => {
    const data = await UserService.getFavoriteIds();
    console.log("data main", data)
    setFavoriteIds(data);
  }
  useEffect(() => {
    getFavorites();
    getProducts();
  }, []);

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
    <div>
      <MainCarouselComponent />
      <div className='mt-4 grid grid-cols-3'>
        {
          imagesPrueba.map((image, index) => (
            <div className='col-span-1 relative' key={index}>
              <ThreeImages image={image}/>
            </div>
          ))
        }
      </div>
      <div className='grid xs:grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
        {dataProducts.map((product, index) => (
          <div key={index} className='col-span-1'>
            <ProductCard products={product} markedFavorite={isSignedIn && favoriteIds.includes(product._id)} handleRemoveFavorite={handleRemoveFavorite} handleAddFavorite={handleAddFavorite}/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainComponent
