'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Heart, ShoppingBag, Search } from "lucide-react";
import SearchSidebar from './modal/SearchSidebar';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const shouldShowWhiteBackground = isScrolled || isHovered;
  const showWhiteBackground = shouldShowWhiteBackground || isMobile;


  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
          showWhiteBackground 
            ? 'bg-white shadow-lg' 
            : 'bg-transparent'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Links de navegación izquierda */}
            <div className="hidden md:flex items-center space-x-4 ">
              
              <Link 
                href="/women" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  showWhiteBackground 
                    ? 'text-gray-900 hover:text-blue-600' 
                    : 'text-white hover:text-gray-300'
                }`}
              >
                Mujer
              </Link>
              {/* <Link 
                href="/men" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  showWhiteBackground 
                    ? 'text-gray-900 hover:text-blue-600' 
                    : 'text-white hover:text-gray-300'
                }`}
              >
                Hombres
              </Link> */}
              <Link 
                href="/marcas" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  showWhiteBackground 
                    ? 'text-gray-900 hover:text-blue-600' 
                    : 'text-white hover:text-gray-300'
                }`}
              >
                Marcas
              </Link>
            </div>

            {/* Logo centrado */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image
                  src="/next.svg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Iconos de la derecha */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Botón de búsqueda */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  showWhiteBackground 
                    ? 'text-gray-900 hover:text-blue-600' 
                    : 'text-white hover:text-gray-300'
                }`}
              >
                <Search/>
              </button>
              <Link 
                href="/favorites" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  showWhiteBackground 
                    ? 'text-gray-900 hover:text-blue-600' 
                    : 'text-white hover:text-gray-300'
                }`}
              >
                <Heart/>
              </Link>
              <Link 
                href="/cart" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  showWhiteBackground 
                    ? 'text-gray-900 hover:text-blue-600' 
                    : 'text-white hover:text-gray-300'
                }`}
              >
                <ShoppingBag/>
              </Link>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode='modal'>
                  <button 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      showWhiteBackground 
                        ? 'text-gray-900 hover:text-blue-600' 
                        : 'text-white hover:text-gray-300'
                    }`}
                  >
                    <User/>
                  </button>
                </SignInButton>
              </SignedOut>
            </div>

            {/* Botón de menú móvil */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-300 ${
                  showWhiteBackground
                    ? 'text-gray-900 hover:text-blue-600 hover:bg-gray-100'
                    : 'text-white hover:text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="sr-only">Abrir menú principal</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300 ${
          showWhiteBackground ? 'bg-white' : 'bg-gray-900'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/productos" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                showWhiteBackground
                  ? 'text-gray-900 hover:text-blue-600 hover:bg-gray-50'
                  : 'text-white hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              Productos
            </Link>
            <Link 
              href="/servicios" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                showWhiteBackground
                  ? 'text-gray-900 hover:text-blue-600 hover:bg-gray-50'
                  : 'text-white hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              Servicios
            </Link>
            <Link 
              href="/contacto" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                showWhiteBackground
                  ? 'text-gray-900 hover:text-blue-600 hover:bg-gray-50'
                  : 'text-white hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              Contacto
            </Link>

            {/* Botón de búsqueda en móvil */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                showWhiteBackground
                  ? 'text-gray-900 hover:text-blue-600 hover:bg-gray-50'
                  : 'text-white hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Search className="inline mr-2"/>
              Buscar
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar de Búsqueda */}
      <SearchSidebar 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default NavbarComponent;