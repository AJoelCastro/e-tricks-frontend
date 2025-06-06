import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type Image = {
  title: string;
  url: string;
  to: string;
}
type Props = {
  image: Image;
}

const ThreeImages: React.FC<Props> = ({image}) => {
  return (
    <>
        <Link href={image.to} >
            <Image
                src={image.url}
                alt="Next.js logo"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div 
                className='absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/35 transition flex-col gap-3'
            >
            <p 
                className='text-white text-sm font-semibold bg-opacity-40 hover:bg-opacity-60 transition bg-red-600 px-3 py-1 rounded-sm'
            >
                HASTA 40% OFF
            </p>
            <p className='font-bold text-5xl'>
                {image.title}
            </p>
            <p className='font-ligth text-md underline '>
                Ver más
            </p>
            </div>
        </Link>
    </>
  )
}

export default ThreeImages
