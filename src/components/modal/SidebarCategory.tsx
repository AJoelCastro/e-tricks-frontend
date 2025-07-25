'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@mui/material';
import { IGroupCategory } from '@/interfaces/GroupCategory';
import { ISubCategory } from '@/interfaces/SubCategory';

interface SidebarCategoryProps {
  activeGroup: IGroupCategory;
  groupCategories: IGroupCategory[];
  onClose: () => void;
  onGroupHover: (group: IGroupCategory) => void;
  showWhiteBackground: boolean;
}

const SidebarCategory = ({
  activeGroup,
  groupCategories,
  onClose,
  onGroupHover,
  showWhiteBackground
}: SidebarCategoryProps) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<ISubCategory | null>(null);
  const [mobileActiveGroup, setMobileActiveGroup] = useState<IGroupCategory>(activeGroup);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMarcasGroup = activeGroup.routeLink === 'marcas';

  // Static "Nuevas Tendencias" section
  const staticTrendsSection = {
    _id: 'trends',
    name: 'Nuevas Tendencias',
    productcategories: [
      { _id: 'trend1', name: 'MAKE YOUR WAY' },
      { _id: 'trend2', name: 'H CAMINO EMPIEZA AHORA' },
      { _id: 'trend3', name: 'NUEVA COLECCIÓN' }
    ],
    image: 'https://www.bata.com/dw/image/v2/BCLG_PRD/on/demandware.static/-/Sites-bata-cl-Library/es_CL/dw711e3e3d/New-home/menubanner_desk-mujer01_shoes.jpg'
  };

  // Add static section as first subcategory
  const allSubcategories = [
    staticTrendsSection,
    ...(mobileActiveGroup.subcategories || [])
  ];

  // Mobile handlers
  const handleMobileGroupClick = (group: IGroupCategory) => {
    setMobileActiveGroup(group);
    setShowSubcategories(true);
    setSelectedSubCategory(null);
    setShowCategories(false);
  };

  const handleMobileSubcategoryClick = (subcategory: ISubCategory) => {
    setSelectedSubCategory(subcategory);
    setShowCategories(true);
  };

  const handleBackToSubcategories = () => {
    setShowCategories(false);
    setSelectedSubCategory(null);
  };

  const handleBackToGroups = () => {
    setShowSubcategories(false);
    setShowCategories(false);
    setSelectedSubCategory(null);
  };

  return (
    <>
      {/* Desktop layout - unchanged */}
      <div className="hidden md:block">
        {/* Semi-transparent overlay on right half */}
        <div
          className="fixed inset-0 bg-opacity-30 z-40"
          style={{ left: '50%' }}
          onClick={onClose}
        />

        {/* Main sidebar container - left half */}
        <div
          ref={sidebarRef}
          className="fixed top-0 left-0 z-50 w-3/4 h-full bg-white shadow-xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Floating navbar replica */}
          <div className={`absolute top-0 left-0 right-0 h-16 flex items-center px-4 sm:px-6 lg:px-8 ${showWhiteBackground ? 'bg-white' : 'bg-transparent'
            }`}>
            <div className="flex items-center space-x-6">
              {groupCategories.map((group) => (
                <div
                  key={`group-${group._id}`}
                  className="relative group"
                  onMouseEnter={() => onGroupHover(group)}
                >
                  <button className={`px-3 py-2 text-lg font-medium transition-colors ${showWhiteBackground || activeGroup._id === group._id
                      ? 'text-gray-900 hover:text-[#7950f2]'
                      : 'text-gray-900 hover:text-[#7950f2]'
                    }`}>
                    <Typography variant='navbar'>
                      {group.name}
                    </Typography>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Content area */}
          <div className="flex h-full pt-16">
            {/* Subcategories - Left Column */}
            <div className="w-1/4 border-r border-gray-200 overflow-y-auto p-4 mt-2">
              <ul className="space-y-2">
                {[staticTrendsSection, ...(activeGroup.subcategories || [])].map((subcategory: ISubCategory) => (
                  <li key={`subcat-${subcategory._id}`}>
                    <button
                      className={`w-full font-semibold text-left p-3 transition-colors ${selectedSubCategory?._id === subcategory._id
                          ? 'text-[#7950f2]'
                          : 'hover:bg-gray-100 text-gray-800'
                        }`}
                      onMouseEnter={() => setSelectedSubCategory(subcategory)}
                    >
                      <Link href={subcategory._id === 'tendencias' ? `/${activeGroup.routeLink}/tendencias` : `/${activeGroup.routeLink}/${subcategory.routeLink}`}>
                        <Typography variant='navbar'>
                          {subcategory.name}
                        </Typography>
                      </Link>
                    </button>
                  </li>
                ))}
              </ul>
              <div className='absolute bottom-5 px-4'>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <Link href="/tiendas" className="text-gray-800 hover:text-[#7950f2]">
                      Tiendas
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <Link href="/contacto" className="text-gray-800 hover:text-[#7950f2]">
                      Contáctanos
                    </Link>
                  </li>
                </ul>
                <hr className="my-3 border-gray-200 w-full" />
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <Link href="/stores" className="text-gray-800 hover:text-[#7950f2]">
                      Mi cuenta
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <Link href="/favoritos" className="text-gray-800 hover:text-[#7950f2]">
                      Favoritos
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Product Categories - Middle Column */}
            <div className="w-1/3 p-4 flex flex-col">
              <div className="flex-1 overflow-hidden mt-2">
                <Typography variant="nameCard" >
                  {selectedSubCategory?.name === 'Nuevas Tendencias' ? 'Tendencias' : 'Categorias'}
                </Typography>
                {selectedSubCategory ? (
                  <ul className="space-y-2">
                    {selectedSubCategory.productcategories?.map((category, index) => (
                      <li key={`prod-${category._id || index}-${category.name}`}>
                        <Link
                          href={
                            selectedSubCategory._id === 'trends'
                              ? `/tendencias/${category._id}`
                              : `/${activeGroup.routeLink}/${selectedSubCategory.routeLink}/${category.routeLink}`
                          }
                          className="block w-full p-2  hover:text-[#7950f2] transition-colors"
                          onClick={onClose}
                        >
                          <Typography variant="reseniasCard">
                            {category.name}
                          </Typography>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-center">
                      Selecciona una subcategoría
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Image - Right Column */}
            <div className="w-1/3 p-4">
              {selectedSubCategory && (
                <div className="mt-4 h-[80vh] relative">
                  <Image
                    src={selectedSubCategory.image || '/default-subcategory.jpg'}
                    alt={selectedSubCategory.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    unoptimized={selectedSubCategory.image?.startsWith('http')}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <Typography variant="h6" className="font-bold text-white">
                      {selectedSubCategory.name}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="block md:hidden">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={onClose}
        />

        {/* Mobile sidebar */}
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-white">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Mobile content */}
          <div className="h-full pt-16 flex flex-col">
            
            {/* SECTION 1: Initial view with group categories, subcategories, and links */}
            {!showCategories && (
              <>
                {/* Group Categories Section */}
                <div className="border-b border-gray-200 p-4">
                  <Typography variant="nameCard">
                    Categorias
                  </Typography>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {groupCategories.map((group) => (
                      <button
                        key={`mobile-group-${group._id}`}
                        onClick={() => handleMobileGroupClick(group)}
                        className={`py-3 px-1 text-center border rounded-lg transition-colors ${
                          mobileActiveGroup._id === group._id
                            ? 'bg-[#7950f2] text-white'
                            : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        <Typography variant="priceCard" >
                          {group.name}
                        </Typography>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategories Section */}
                {showSubcategories && (
                  <div className="border-b border-gray-200 p-4 flex-1 overflow-y-auto">
                    <div className="flex items-center mb-3">
                      <button
                        onClick={handleBackToGroups}
                        className="mr-3 text-gray-600 hover:text-gray-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m15 18-6-6 6-6"/>
                        </svg>
                      </button>
                      <h3 className="font-bold text-lg text-gray-800">{mobileActiveGroup.name}</h3>
                    </div>
                    <ul className="space-y-1">
                      {allSubcategories.map((subcategory) => (
                        <li key={`mobile-subcat-${subcategory._id}`}>
                          <button
                            onClick={() => handleMobileSubcategoryClick(subcategory)}
                            className="w-full text-left p-3 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <Typography variant="sideBarSubCategories">{subcategory.name}</Typography>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9 18 6-6-6-6"/>
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Links Container Section */}
                <div className="p-4 bg-gray-50">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <Link href="/tiendas" className="text-gray-800 hover:text-[#7950f2]" onClick={onClose}>
                        Tiendas
                      </Link>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <Link href="/contacto" className="text-gray-800 hover:text-[#7950f2]" onClick={onClose}>
                        Contáctanos
                      </Link>
                    </li>
                  </ul>
                  <hr className="my-3 border-gray-300" />
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <Link href="/account" className="text-gray-800 hover:text-[#7950f2]" onClick={onClose}>
                        Mi cuenta
                      </Link>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <Link href="/favoritos" className="text-gray-800 hover:text-[#7950f2]" onClick={onClose}>
                        Favoritos
                      </Link>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* SECTION 2: Categories view after clicking subcategory */}
            {showCategories && selectedSubCategory && (
              <div className="flex flex-col h-full">
                {/* Back button and title */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center mb-2">
                    <button
                      onClick={handleBackToSubcategories}
                      className="mr-3 text-gray-600 hover:text-gray-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>
                    <h3 className="font-bold text-lg text-gray-800">
                      {selectedSubCategory.name === 'Nuevas Tendencias' ? 'Tendencias' : 'Productos'}
                    </h3>
                  </div>
                </div>

                {/* Categories links */}
                <div className="p-4 flex-1 overflow-y-auto">
                  {selectedSubCategory.productcategories && selectedSubCategory.productcategories.length > 0 ? (
                    <ul className="space-y-2 mb-6">
                      {selectedSubCategory.productcategories.map((category, index) => (
                        <li key={`mobile-prod-${category._id || index}-${category.name}`}>
                          <Link
                            href={
                              selectedSubCategory._id === 'trends'
                                ? `/tendencias/${category._id}`
                                : `/products?category=${category._id}`
                            }
                            className="block w-full p-3 rounded-lg border border-gray-200"
                            onClick={onClose}
                          >
                            <Typography variant="h7" sx={{color: '#707071ff',":hover": {color: "#7950f2"}}}>{category.name}</Typography>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-gray-500 text-center">No hay productos disponibles</p>
                    </div>
                  )}
                </div>

                {/* Subcategory image */}
                <div className="p-4">
                  <div className="h-[50vh] bg-red-500 p-2 relative rounded-lg overflow-hidden">
                    <Image
                      src={selectedSubCategory.image || '/default-subcategory.jpg'}
                      alt={selectedSubCategory.name}
                      fill
                      className="object-cover"
                      priority
                      unoptimized={selectedSubCategory.image?.startsWith('http')}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <Typography variant="h5" color='white'>
                        {selectedSubCategory.name}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarCategory;