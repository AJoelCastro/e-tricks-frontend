import React, { useEffect, useState } from 'react'
import { useAuth } from "@clerk/nextjs";
import MainCarouselComponent from './carousel/MainCarousel'
import { imagesPrueba } from '@/data/ThreeImagesPrueba'
import ProductCard from './cards/Products'
import { productCardPrueba } from '@/data/ProductCardPrueba'
import ThreeImages from './sections/ThreeImages'
import ProductService from '@/services/ProductService'


const MainComponent = () => {
  const { getToken } = useAuth();
  const [dataProducts, setDataProducts] = useState<Array<any>>([]);

  useEffect(() => {
    const getProducts = async() =>{
      const data = await ProductService.GetProducts();
      setDataProducts(data);
    }
    getProducts();
  }, [])
  

  return (
    <div>
      <MainCarouselComponent/>
      <div className='mt-4 grid grid-cols-3'>
        {
          imagesPrueba.map((image, index) => (
              <div className='col-span-1 relative' key={index}>
                <ThreeImages image={image}/>
              </div>
          ))
        }
      </div>
      <div className='grid grid-cols-4'>
        {
          dataProducts.map((product, index) => (
            <div key={index} className='col-span-1'>
              <ProductCard products={product}/>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MainComponent
