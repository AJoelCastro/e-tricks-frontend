import React, { useEffect, useState } from 'react'
import { useAuth } from "@clerk/nextjs";
import MainCarouselComponent from '../../components/carousel/MainCarousel'
import { imagesPrueba } from '@/data/ThreeImagesPrueba'
import ProductCard from '../../components/cards/Products'
import ThreeImages from '../../components/sections/ThreeImages'
import ProductService from '@/services/ProductService'


const MainComponent = () => {
  const { getToken } = useAuth();
  const [dataProducts, setDataProducts] = useState<Array<any>>([]);

  useEffect(() => {
    const getProducts = async () => {
      const data = await ProductService.GetProducts();
      setDataProducts(data);
    }
    getProducts();
  }, [])


  return (
    <div>
      <MainCarouselComponent />
      <div className='mt-4 grid grid-cols-3'>
        {
          imagesPrueba.map((image, index) => (
            <div className='col-span-1 relative' key={index}>
              <ThreeImages image={image} />
            </div>
          ))
        }
      </div>
      <div className='grid xs:grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
        {dataProducts.map((product, index) => (
          <div key={index} className='col-span-1'>
            <ProductCard products={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainComponent
