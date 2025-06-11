import React from 'react'
import Image from "next/image";
import Button from '@mui/material/Button';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const FooterComponent = () => {
  // Eliminamos el estado isDarkMode y el useEffect

  return (
    <div className='bg-white text-gray-800'>
        <div className='flex lg:flex-row flex-col p-4 gap-4'>
            {/* primera seccion */}
            <div className='flex flex-col mb-4 lg:w-[35%]'>
                <div className='mx-auto'>
                    <Image
                        src="/tricks_logo_black.svg"
                        alt="Next.js logo"
                        width={150}
                        height={30}
                        priority
                    />
                </div>
                <div>
                    <p className='text-gray-600 mb-6'>
                        ¡Te esperan muchos beneficios y sorpresas!
                        Regístrate, acumula puntos y úsalos en todas tus compras.
                    </p>
                    <div className='w-full flex items-center justify-center py-3 rounded-lg'>
                        <Button 
                          style={{
                            width:'100%', 
                            backgroundColor: 'white', 
                            color: 'black'
                          }} 
                          variant='contained'
                        >
                          Descubre más
                        </Button>
                    </div>
                </div>
            </div>
            {/* segunda sección */}
            <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 flex-1 gap-8 px-4'>
                <div className='col-span-1'>
                    <h1 className='text-lg font-bold mb-4 text-gray-800 border-b pb-2 border-gray-200'>ACERCA DE</h1>
                    <ul className='space-y-3'>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>About Us</li>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>Contact Us</li>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>Careers</li>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>Blog</li>
                    </ul>
                </div>
                <div className='col-span-1'>
                    <h1 className='text-lg font-bold mb-4 text-gray-800 border-b pb-2 border-gray-200'>TÉRMINOS Y CONDICIONES</h1>
                    <ul className='space-y-3'>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>Help Center</li>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>Terms of Service</li>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>Privacy Policy</li>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>Legal</li>
                    </ul>
                </div>
                
                <div className='col-span-1'>
                    <h1 className='text-lg font-bold mb-4 text-gray-800 border-b pb-2 border-gray-200'>LEGAL</h1>
                    <ul className='space-y-3'>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>Help Center</li>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>Terms of Service</li>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>Privacy Policy</li>
                        <li className='text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer'>Legal</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className='flex flex-row gap-8 items-center lg:justify-end justify-between p-4'>
            <Facebook color='black'/>
            <Instagram color='black'/>
            <Youtube color='black'/>
        </div>
        <div>
            <p className='text-center text-gray-600 pb-4'>© 2023 Tricks. All rights reserved.</p>
        </div>
    </div>
  )
}

export default FooterComponent
