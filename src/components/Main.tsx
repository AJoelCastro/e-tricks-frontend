import React from 'react'
import MainCarouselComponent from './carousel/MainCarousel'
import Image from 'next/image'
import Link from 'next/link'
import { imagesPrueba } from '@/data/ImagesPrueba'

const MainComponent = () => {
  return (
    <div className='bg-white'>
      <MainCarouselComponent/>
      <div className='mt-4 grid grid-cols-3'>
        {
          imagesPrueba.map((image, index) => (
            <div className='col-span-1 relative' key={index}>
              <Image
                src={image.url}
                alt="Next.js logo"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div 
                className='absolute inset-0 flex items-center justify-center text-white text-xl font-bold bg-opacity-40 hover:bg-opacity-60 transition '
              >
                <Link 
                  href='/' 
                  className='text-white text-sm font-semibold bg-opacity-40 hover:bg-opacity-60 transition bg-red-600 px-3 py-1 rounded-sm'
                >
                  HASTA 40% OFF
                </Link>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MainComponent
