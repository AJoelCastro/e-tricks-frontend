import React from 'react'
import MainCarouselComponent from './carousel/MainCarousel'
import { imagesPrueba } from '@/data/ThreeImagesPrueba'
import ProductCard from './cards/Products'
import { productCardPrueba } from '@/data/ProductCardPrueba'
import ThreeImages from './sections/ThreeImages'


const MainComponent = () => {
  return (
    <div className='bg-white'>
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
          productCardPrueba.map((product, index) => (
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
