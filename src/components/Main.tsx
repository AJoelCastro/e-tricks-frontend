import React from 'react'
import MainCarouselComponent from './carousel/MainCarousel'
import Image from 'next/image'
import Link from 'next/link'

const MainComponent = () => {
  return (
    <div className='bg-white'>
      <MainCarouselComponent/>
      <div className='mt-4 grid grid-cols-3'>
        <div className='col-span-1 relative'>
          <Image
            src='https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dw383b8e58/homepage/1.jpg?sw=2560&q=80'
            alt="Next.js logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <Link 
            href='/' 
            className='absolute inset-0 flex items-center justify-center text-white text-xl font-bold bg-opacity-40 hover:bg-opacity-60 transition'
          >
            Descubre nuestros productos
          </Link>
        </div>

        <div className='col-span-1 relative'>
          <Image
            src='https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dw383b8e58/homepage/1.jpg?sw=2560&q=80'
            alt="Next.js logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <Link 
            href='/' 
            className='absolute inset-0 flex items-center justify-center text-white text-xl font-bold bg-opacity-40 hover:bg-opacity-60 transition'
          >
            Descubre nuestros productos
          </Link>
        </div>
        <div className='col-span-1 relative'>
          <Image
            src='https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-pe-Library/es_PE/dw383b8e58/homepage/1.jpg?sw=2560&q=80'
            alt="Next.js logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <Link 
            href='/' 
            className='absolute inset-0 flex items-center justify-center text-white text-xl font-bold bg-opacity-40 hover:bg-opacity-60 transition'
          >
            Descubre nuestros productos
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainComponent
