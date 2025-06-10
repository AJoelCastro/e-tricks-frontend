'use client';

import React, { useState, useEffect } from 'react'
import Image from "next/image";
import Button from '@mui/material/Button';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const FooterComponent = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detectar modo oscuro
    const checkDarkMode = () => {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    };

    checkDarkMode();
    
    // Escuchar cambios en el modo de color
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', checkDarkMode);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  return (
    <div className={isDarkMode ? 'bg-[#0a0a0a] text-[#ededed]' : 'bg-white text-gray-800'}>
        <div className='flex lg:flex-row flex-col p-4 gap-4'>
            {/* primera seccion */}
            <div className='flex flex-col mb-4 lg:w-[35%] gap-8'>
                <div className='mx-auto'>
                    <Image
                        src="/next.svg"
                        alt="Next.js logo"
                        width={180}
                        height={38}
                        priority
                        className={isDarkMode ? 'filter invert' : ''}
                    />
                </div>
                <div>
                    <p className={isDarkMode ? 'text-gray-300 mb-6' : 'text-gray-600 mb-6'}>
                        ¡Te esperan muchos beneficios y sorpresas!
                        Regístrate, acumula puntos y úsalos en todas tus compras.
                    </p>
                    <div className='w-full flex items-center justify-center py-3 rounded-lg'>
                        <Button 
                          style={{
                            width:'100%', 
                            backgroundColor: isDarkMode ? '#1a1a1a' : 'white', 
                            color: isDarkMode ? '#ededed' : 'black'
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
                    <h1 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} border-b pb-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>ACERCA DE</h1>
                    <ul className='space-y-3'>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>About Us</li>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>Contact Us</li>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>Careers</li>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>Blog</li>
                    </ul>
                </div>
                <div className='col-span-1'>
                    <h1 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} border-b pb-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>TÉRMINOS Y CONDICIONES</h1>
                    <ul className='space-y-3'>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>Help Center</li>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>Terms of Service</li>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>Privacy Policy</li>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>Legal</li>
                    </ul>
                </div>
                
                <div className='col-span-1'>
                    <h1 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} border-b pb-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>LEGAL</h1>
                    <ul className='space-y-3'>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>Help Center</li>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>Terms of Service</li>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>Privacy Policy</li>
                        <li className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}>Legal</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className='flex flex-row gap-8 items-center lg:justify-end justify-between p-4'>
            <Facebook color={isDarkMode ? 'white' : 'black'}/>
            <Instagram color={isDarkMode ? 'white' : 'black'}/>
            <Youtube color={isDarkMode ? 'white' : 'black'}/>
        </div>
        <div>
            <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} pb-4`}>© 2023 Tricks. All rights reserved.</p>
        </div>
    </div>
  )
}

export default FooterComponent
