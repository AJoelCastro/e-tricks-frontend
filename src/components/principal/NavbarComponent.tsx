'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Heart, ShoppingBag, Search, Plus } from "lucide-react";
import SearchSidebar from '../modal/SearchSidebar';
import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from '@clerk/nextjs';
import theme from '@/theme/create-theme';
import { Typography, Badge, Box } from '@mui/material';
import GroupCategoryService from '@/services/GroupCategoryService';
import { IGroupCategory } from '@/interfaces/GroupCategory';
import SidebarCategory from '../modal/SidebarCategory';
import UserService from '@/services/UserService';
import { IBrandWithCategories } from '@/interfaces/Brand';
import BrandService from '@/services/BrandService';
import { motion, AnimatePresence } from 'framer-motion';
import { store } from '@/store';
import { AdminPanelSettings, AdminPanelSettingsOutlined } from '@mui/icons-material';

type Props = {
  main?: boolean;
  cartItemsCount?: number;
}

const NavbarComponent: React.FC<Props> = ({ main, cartItemsCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [groupCategories, setGroupCategories] = useState<IGroupCategory[]>([]);
  const [brandsWithCategories, setBrandsWithCategories] = useState<IBrandWithCategories[]>([]);
  const [activeGroup, setActiveGroup] = useState<IGroupCategory | null>(null);
  const [localCartCount, setLocalCartCount] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const { isAdmin } = store.getState().auth;

  const { isSignedIn, getToken } = useAuth();
  
  const fetchBrandsWithCategories = async () => {
    try {
      const data = await BrandService.getBrandsWithProductCategories();
      setBrandsWithCategories(data);
    } catch (error) {
      console.error('Error fetching brands with categories:', error);
    }
  }
  
  const fetchGroupCategories = async () => {
    try {
      const data = await GroupCategoryService.getGroupCategories();
      setGroupCategories(data.filter((g : any) => ['Mujer', 'Marcas'].includes(g.name)));
    } catch (error) {
      console.error('Error fetching group categories:', error);
    }
  };
  
  useEffect(() => {
    fetchBrandsWithCategories();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Cerrar FAB cuando se hace clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsFabOpen(false);
      }
    };

    fetchGroupCategories();
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para obtener el conteo del carrito
  const fetchCartCount = async () => {
    if (!isSignedIn) {
      setLocalCartCount(0);
      return;
    }

    try {
      const token = await getToken();
      if (!token) return;

      const cartItems = await UserService.getCartItems(token);
      const count = cartItems?.length || 0;
      setLocalCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setLocalCartCount(0);
    }
  };

  // Cargar conteo del carrito al iniciar y cuando cambie el estado de autenticación
  useEffect(() => {
    fetchCartCount();
  }, [isSignedIn]);

  // Actualizar conteo cuando se pase como prop (desde el componente padre)
  useEffect(() => {
    if (typeof cartItemsCount === 'number') {
      setLocalCartCount(cartItemsCount);
    }
  }, [cartItemsCount]);

  // Función para refrescar el conteo (puede ser llamada desde componentes hijos)
  const refreshCartCount = () => {
    fetchCartCount();
  };

  // Exponer la función de refresh globalmente para que otros componentes puedan usarla
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshNavbarCartCount = refreshCartCount;
    }
  }, []);

  const shouldShowWhiteBackground = isScrolled || isHovered;
  const showWhiteBackground = shouldShowWhiteBackground || isMobile;

  const handleGroupHover = (group: IGroupCategory) => {
    setActiveGroup(group);
    setIsHovered(true);
  };

  const handleCloseModal = () => {
    setActiveGroup(null);
    setIsHovered(false);
  };

  // Función para manejar click en FAB
  const handleFabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFabOpen(!isFabOpen);
  };

  return (
    <>
      <nav
        ref={navbarRef}
        className={`w-full fixed transition-all duration-300 ${
          showWhiteBackground ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
        style={{ zIndex: 50 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-16 flex items-center justify-between">
            {/* LEFT SECTION */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Menú (solo móvil) */}
              <div className="md:hidden">
                <button
                  onClick={() => setActiveGroup(groupCategories[0])}
                  className={`p-2 rounded-md transition-colors ${
                    showWhiteBackground
                      ? 'text-gray-900 hover:text-[#7950f2] hover:bg-gray-100'
                      : 'text-white hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Buscador (solo móvil) */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-2 rounded-md transition-colors ${
                    showWhiteBackground
                      ? 'text-gray-900 hover:text-[#7950f2]'
                      : `text-${main ? 'white' : theme.palette.text.primary} hover:text-gray-300`
                  }`}
                >
                  <Search />
                </button>
              </div>

              {/* GroupCategories (solo desktop) */}
              <div className="hidden md:flex items-center space-x-4">
                {groupCategories.map((group) => (
                  <div
                    key={group._id}
                    className="relative group"
                    onMouseEnter={() => handleGroupHover(group)}
                  >
                    <button className={`px-3 py-2 transition-colors ${
                      showWhiteBackground
                        ? 'text-gray-900 hover:text-[#7950f2]'
                        : `text-${main ? 'white' : 'gray-900'} hover:text-[#7950f2]`
                    }`}>
                      <Typography variant='navbar'>
                        {group.name}
                      </Typography>
                    </button>
                  </div>
                ))}
                {
                  isAdmin && (
                    <Link href={'/admin'} className={`px-3 py-2 transition-colors ${showWhiteBackground ? 'text-gray-900 hover:text-[#7950f2]' : 'text-white hover:text-gray-300'}`}>
                      <Typography variant='navbar'>
                        Admin
                      </Typography>
                    </Link>
                  )
                }
              </div>
            </div>

            {/* CENTER SECTION - LOGO */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center h-full">
              <Link href="/" className="flex items-center">
                <Image
                  src={main ? (showWhiteBackground
                    ? 'https://tricks-bucket.s3.us-east-2.amazonaws.com/logos/logo_horizontal.svg'
                    : 'https://tricks-bucket.s3.us-east-2.amazonaws.com/logo_horizontal_blanco.svg')
                    : 'https://tricks-bucket.s3.us-east-2.amazonaws.com/logos/logo_horizontal.svg'}
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-7 md:h-12 w-auto" // Altura ajustada: h-8 en móvil (32px), h-12 en desktop (48px)
                />
              </Link>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* Buscador (solo desktop) */}
              <div className="hidden md:block">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`px-3 py-2 rounded-md transition-colors duration-300 ${
                    showWhiteBackground
                      ? 'text-gray-900 hover:text-[#7950f2]'
                      : `text-${main ? 'white' : theme.palette.text.primary} hover:text-gray-300`
                  }`}
                >
                  <Search />
                </button>
              </div>

              {/* FAB MÓVIL - En el navbar */}
              <div ref={fabRef} className="relative md:hidden">
                {/* Botón principal del FAB */}
                <motion.button
                  onClick={handleFabClick}
                  className={`p-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg relative ${
                    isFabOpen 
                      ? 'bg-[#7950f2] text-white' 
                      : showWhiteBackground
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  animate={{ rotate: isFabOpen ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <User size={20} />
                </motion.button>

                {/* Opciones del FAB */}
                <AnimatePresence>
                  {isFabOpen && (
                    <>
                      {/* Overlay para cerrar */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0"
                        style={{ zIndex: 40}}
                        onClick={() => setIsFabOpen(false)}
                      />
                      
                      {/* Menú desplegable */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                        style={{ zIndex: 50, padding:8 }}
                      >
                        {/* Login/Usuario */}
                        <div className="border-b border-gray-100">
                          {isSignedIn ? (
                            <div className="p-3 flex items-center space-x-3 hover:bg-gray-50">
                              <UserButton />
                              <span className="text-sm text-gray-700">Mi cuenta</span>
                            </div>
                          ) : (
                            <SignInButton mode='modal'>
                              <button 
                                className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsFabOpen(false)}
                              >
                                <User className="text-gray-700" size={20} />
                                <span className="text-sm text-gray-700">Iniciar sesión</span>
                              </button>
                            </SignInButton>
                          )}
                        </div>

                        {/* Carrito */}
                        <Link
                          href="/carrito"
                          className="block p-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                          onClick={() => setIsFabOpen(false)}
                        >
                          <Badge
                            badgeContent={localCartCount}
                            color="error"
                            sx={{
                              '& .MuiBadge-badge': {
                                fontSize: '0.65rem',
                                height: '18px',
                                minWidth: '18px',
                                backgroundColor: '#ff4444',
                                color: 'white',
                                fontWeight: 'bold'
                              }
                            }}
                            invisible={localCartCount === 0}
                          >
                            <ShoppingBag className="text-gray-700" size={20} />
                          </Badge>
                          <span className="text-sm text-gray-700">Carrito</span>
                        </Link>

                        {/* Favoritos */}
                        <Link
                          href="/favoritos"
                          className="block p-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsFabOpen(false)}
                        >
                          <Heart className="text-gray-700" size={20} />
                          <span className="text-sm text-gray-700">Favoritos</span>
                        </Link>
                        {/* ADMIN */}
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="block p-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsFabOpen(false)}
                          >
                            <AdminPanelSettingsOutlined fontSize='medium'/>
                            <span className="text-sm text-gray-700">Admin</span>
                          </Link>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Íconos normales en desktop */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Favoritos */}
                <Link
                  href="/favoritos"
                  className={`px-3 py-2 rounded-md transition-colors duration-300 ${
                    showWhiteBackground
                      ? 'text-gray-900 hover:text-[#7950f2]'
                      : `text-${main ? 'white' : theme.palette.text.primary} hover:text-gray-300`
                  }`}
                >
                  <Heart />
                </Link>

                {/* Carrito */}
                <Link
                  href="/carrito"
                  className={`px-3 py-2 rounded-md transition-colors duration-300 relative ${
                    showWhiteBackground
                      ? 'text-gray-900 hover:text-[#7950f2]'
                      : `text-${main ? 'white' : theme.palette.text.primary} hover:text-gray-300`
                  }`}
                >
                  <Badge
                    badgeContent={localCartCount}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.65rem',
                        height: '18px',
                        minWidth: '18px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        fontWeight: 'bold'
                      }
                    }}
                    invisible={localCartCount === 0}
                  >
                    <ShoppingBag />
                  </Badge>
                </Link>

                {/* Usuario */}
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode='modal'>
                    <button
                      className={`px-3 py-2 rounded-md transition-colors duration-300 ${
                        showWhiteBackground
                          ? 'text-gray-900 hover:text-[#7950f2]'
                          : `text-${main ? 'white' : theme.palette.text.primary} hover:text-gray-300`
                      }`}
                    >
                      <User />
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </nav>



      {/* Category Modal */}
      {activeGroup && (
        <SidebarCategory
          activeGroup={activeGroup}
          brandsWithCategories={brandsWithCategories}
          groupCategories={groupCategories}
          onClose={handleCloseModal}
          onGroupHover={handleGroupHover}
          showWhiteBackground={showWhiteBackground}
        />
      )}

      <SearchSidebar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default NavbarComponent;