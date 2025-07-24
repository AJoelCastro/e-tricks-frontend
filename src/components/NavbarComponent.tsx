'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Heart, ShoppingBag, Search } from "lucide-react";
import SearchSidebar from './modal/SearchSidebar';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import theme from '@/theme/create-theme';
import { Typography } from '@mui/material';
import GroupCategoryService from '@/services/GroupCategoryService';
import { IGroupCategory } from '@/interfaces/GroupCategory';
import SidebarCategory from './modal/SidebarCategory';

type Props = {
  main?: boolean
}

const NavbarComponent: React.FC<Props> = ({ main }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [groupCategories, setGroupCategories] = useState<IGroupCategory[]>([]);
  const [activeGroup, setActiveGroup] = useState<IGroupCategory | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGroupCategories = async () => {
      try {
        const data = await GroupCategoryService.getGroupCategories();
        setGroupCategories(data.filter(g => ['Mujer', 'Marcas'].includes(g.name)));
      } catch (error) {
        console.error('Error fetching group categories:', error);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    fetchGroupCategories();
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

  const handleGroupHover = (group: IGroupCategory) => {
    setActiveGroup(group);
    setIsHovered(true);
  };

  const handleCloseModal = () => {
    setActiveGroup(null);
    setIsHovered(false);
  };

  return (
    <>
      <nav
        ref={navbarRef}
        className={`w-full z-50 fixed transition-all duration-300 ${
          showWhiteBackground ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Group Categories */}
            <div className="hidden md:flex items-center space-x-6">
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
              
            </div>

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image
                  src={main ? (showWhiteBackground ? 
                    'https://tricks-bucket.s3.us-east-2.amazonaws.com/logos/logo_oscuro.svg' : 
                    'https://tricks-bucket.s3.us-east-2.amazonaws.com/logos/logo_transparente.svg') : 
                    'https://tricks-bucket.s3.us-east-2.amazonaws.com/logos/logo_oscuro.svg'}
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-36 w-auto"
                />
              </Link>
            </div>

            {/* Right Icons */}
            <div className="items-center space-x-4 flex">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`px-3 py-2 rounded-md transition-colors duration-300 ${
                  showWhiteBackground
                    ? 'text-gray-900 hover:text-[#7950f2]'
                    : `text-${main?'white':theme.palette.text.primary} hover:text-gray-300`
                }`}
              >
                <Search/>
              </button>
              <Link
                href="/favoritos"
                className={`px-3 py-2 rounded-md transition-colors duration-300 ${
                  showWhiteBackground
                    ? 'text-gray-900 hover:text-[#7950f2]'
                    : `text-${main?'white':theme.palette.text.primary} hover:text-gray-300`
                }`}
              >
                <Heart/>
              </Link>
              <Link
                href="/carrito"
                className={`px-3 py-2 rounded-md transition-colors duration-300 ${
                  showWhiteBackground
                    ? 'text-gray-900 hover:text-[#7950f2]'
                    : `text-${main?'white':theme.palette.text.primary} hover:text-gray-300`
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
                    className={`px-3 py-2 rounded-md transition-colors duration-300 ${
                      showWhiteBackground
                        ? 'text-gray-900 hover:text-[#7950f2]'
                        : `text-${main?'white':theme.palette.text.primary} hover:text-gray-300`
                    }`}
                  >
                    <User/>
                  </button>
                </SignInButton>
              </SignedOut>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => {
                  setActiveGroup(groupCategories[0]); 
                }}
                className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors duration-300 ${
                  showWhiteBackground
                    ? 'text-gray-900 hover:text-[#7950f2] hover:bg-gray-100'
                    : 'text-white hover:text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Modal */}
      {activeGroup && (
         <SidebarCategory
            activeGroup={activeGroup}
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