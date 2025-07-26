'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@mui/material';
import { IGroupCategory } from '@/interfaces/GroupCategory';
import { ISubCategory } from '@/interfaces/SubCategory';
import { IBrandWithCategories } from '@/interfaces/Brand';

interface SidebarCategoryProps {
  activeGroup: IGroupCategory;
  groupCategories: IGroupCategory[];
  onClose: () => void;
  onGroupHover: (group: IGroupCategory) => void;
  showWhiteBackground: boolean;
  brandsWithCategories: IBrandWithCategories[];
}

const SidebarCategory = ({
  activeGroup,
  groupCategories,
  onClose,
  onGroupHover,
  showWhiteBackground,
  brandsWithCategories
}: SidebarCategoryProps) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<ISubCategory | null>(null);
  const [mobileActiveGroup, setMobileActiveGroup] = useState<IGroupCategory>(activeGroup);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMarcasGroup = activeGroup.routeLink === 'marcas';
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const allSubcategories = mobileActiveGroup.subcategories || [];
  console.log('ag', activeGroup );
  console.log('gc', groupCategories );
  const handleMobileGroupClick = (group: IGroupCategory) => {
    setMobileActiveGroup(group);
    setShowSubcategories(true);
    setSelectedSubCategory(null);
    setSelectedBrandId(null);
    setShowCategories(false);
  };

  const handleMobileSubcategoryClick = (subcategory: ISubCategory) => {
    setSelectedSubCategory(subcategory);
    setShowCategories(true);
  };

  const handleBackToSubcategories = () => {
    setShowCategories(false);
    setSelectedSubCategory(null);
    setSelectedBrandId(null);
  };

  const handleBackToGroups = () => {
    setShowSubcategories(false);
    setShowCategories(false);
    setSelectedSubCategory(null);
    setSelectedBrandId(null);
  };

  return (
    <>
      {/* --- DESKTOP --- */}
      <div className="hidden md:block">
        <div className="fixed inset-0 bg-opacity-30 z-40" style={{ left: '50%' }} onClick={onClose} />
        <div ref={sidebarRef} className="fixed top-0 left-0 z-50 w-3/4 h-full bg-white shadow-xl">
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Floating navbar */}
          <div className={`absolute top-0 left-0 right-0 h-16 flex items-center px-4 ${showWhiteBackground ? 'bg-white' : 'bg-transparent'}`}>
            <div className="flex items-center space-x-6">
              {groupCategories.map((group) => (
                <div key={group._id} onMouseEnter={() => onGroupHover(group)}>
                  <button className={`px-3 py-2 text-lg font-medium ${activeGroup._id === group._id ? 'text-[#7950f2]' : 'text-gray-900 hover:text-[#7950f2]'}`}>
                    <Typography variant="navbar">{group.name}</Typography>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex h-full pt-16">
            {/* Subcategories */}
            <div className="w-1/4 border-r overflow-y-auto p-4 mt-2">
              <ul className="space-y-2">
                {isMarcasGroup
                  ? brandsWithCategories.map(({ brand }) => (
                      <li key={brand._id}>
                        <button
                          className={`w-full font-semibold text-left p-3 ${selectedBrandId === brand._id ? 'text-[#7950f2]' : 'text-gray-800 hover:bg-gray-100'}`}
                          onMouseEnter={() => setSelectedBrandId(brand._id)}
                        >
                          <Link href={`/${brand.name.toLowerCase()}`} onMouseEnter={() => setSelectedBrandId(brand._id)}>
                            <Typography variant="priceCard">{brand.name}</Typography>
                          </Link>
                        </button>
                      </li>
                    ))
                  : (activeGroup.subcategories || []).map((subcategory) => (
                      <li key={subcategory._id}>
                          <button
                            className={`w-full font-semibold text-left p-3 ${selectedSubCategory?._id === subcategory._id ? 'text-[#7950f2]' : 'text-gray-800 hover:bg-gray-100'}`}
                            onMouseEnter={() => setSelectedSubCategory(subcategory)}
                          >
                            <Link href={`/${activeGroup.routeLink}/${subcategory.routeLink}`} onMouseEnter={() => setSelectedSubCategory(subcategory)}>
                              <Typography variant="priceCard">{subcategory.name}</Typography>
                            </Link>
                          </button>
                      </li>
                    ))}
              </ul>
            </div>

            {/* Product Categories */}
            <div className="w-1/3 p-4">
              <Typography variant="nameCard" className="mt-2">
                {isMarcasGroup ? 'Categorías de Marca' : 'Categorías'}
              </Typography>
              <ul className="space-y-2 mt-2">
                {isMarcasGroup && selectedBrandId ? (
                  brandsWithCategories.find(b => b.brand._id === selectedBrandId)?.categories.map(cat => (
                    <li key={cat._id}>
                      <Link href={`/${brandsWithCategories.find(b => b.brand._id === selectedBrandId)?.brand.name.toLowerCase()}/${cat.routeLink}`} onClick={onClose} className="block p-2 hover:text-[#7950f2] transition-colors">
                        <Typography variant="productCategory">{cat.name}</Typography>
                      </Link>
                    </li>
                  ))
                ) : selectedSubCategory ? (
                  selectedSubCategory.productcategories?.map((cat, i) => (
                    <li key={cat._id || i}>
                      <Link href={`/${cat._id}`} onClick={onClose} className="block p-2 hover:text-[#7950f2] transition-colors">
                        <Typography variant="productCategory">{cat.name}</Typography>
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 mt-10 text-center">Selecciona una subcategoría</p>
                )}
              </ul>
            </div>

            {/* Image */}
            <div className="w-1/3 p-4">
              {isMarcasGroup && selectedBrandId ? (
                <div className="h-[80vh] relative rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={brandsWithCategories.find(b => b.brand._id === selectedBrandId)?.brand.image || '/default-brand.jpg'}
                    alt="Marca"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <Typography variant="h6" className="text-white font-bold">
                      {brandsWithCategories.find(b => b.brand._id === selectedBrandId)?.brand.name}
                    </Typography>
                  </div>
                </div>
              ) : selectedSubCategory ? (
                <div className="h-[80vh] relative rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={selectedSubCategory.image || '/default-subcategory.jpg'}
                    alt={selectedSubCategory.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <Typography variant="h6" className="text-white font-bold">
                      {selectedSubCategory.name}
                    </Typography>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE --- */}
      <div className="block md:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50">
            <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="h-full pt-16 flex flex-col">
            {!showCategories && (
              <>
                <div className="border-b p-4">
                  <Typography variant="nameCard">Categorías</Typography>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {groupCategories.map((group) => (
                      <button
                        key={group._id}
                        onClick={() => handleMobileGroupClick(group)}
                        className={`py-3 px-1 border rounded-lg ${mobileActiveGroup._id === group._id ? 'bg-[#7950f2] text-white' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'}`}
                      >
                        <Typography variant="priceCard">{group.name}</Typography>
                      </button>
                    ))}
                  </div>
                </div>

                {showSubcategories && (
                  <div className="p-4 flex-1 overflow-y-auto border-b">
                    <div className="flex items-center mb-3">
                      <button onClick={handleBackToGroups} className="mr-3 text-gray-600 hover:text-gray-800">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </button>
                      <h3 className="font-bold text-lg text-gray-800">{mobileActiveGroup.name}</h3>
                    </div>
                    <ul className="space-y-1">
                      {mobileActiveGroup.routeLink === 'marcas'
                        ? brandsWithCategories.map(({ brand }) => (
                            <li key={brand._id}>
                              <button
                                onClick={() => {
                                  setSelectedBrandId(brand._id);
                                  setShowCategories(true);
                                }}
                                className="w-full text-left p-3 text-gray-800 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                              >
                                <Typography variant="sideBarSubCategories">{brand.name}</Typography>
                                <svg width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2">
                                  <path d="m9 18 6-6-6-6" />
                                </svg>
                              </button>
                            </li>
                          ))
                        : allSubcategories.map((subcategory) => (
                            <li key={subcategory._id}>
                              <button
                                onClick={() => handleMobileSubcategoryClick(subcategory)}
                                className="w-full text-left p-3 text-gray-800 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                              >
                                <Typography variant="sideBarSubCategories">{subcategory.name}</Typography>
                                <svg width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2">
                                  <path d="m9 18 6-6-6-6" />
                                </svg>
                              </button>
                            </li>
                          ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {showCategories && (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center mb-2">
                    <button onClick={handleBackToSubcategories} className="mr-3 text-gray-600 hover:text-gray-800">
                      <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <h3 className="font-bold text-lg text-gray-800">Productos</h3>
                  </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                  {mobileActiveGroup.routeLink === 'marcas' && selectedBrandId ? (
                    <ul className="space-y-2">
                      {brandsWithCategories.find(b => b.brand._id === selectedBrandId)?.categories.map(cat => (
                        <li key={cat._id}>
                          <Link href={`/${brandsWithCategories.find(b => b.brand._id === selectedBrandId)?.brand.name.toLowerCase()}/${cat.routeLink}`} onClick={onClose} className="block p-3 rounded-lg border border-gray-200">
                            <Typography variant="h7" sx={{ color: '#707071ff', ":hover": { color: "#7950f2" } }}>
                              {cat.name}
                            </Typography>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : selectedSubCategory?.productcategories?.length ? (
                    <ul className="space-y-2">
                      {selectedSubCategory.productcategories.map((cat, i) => (
                        <li key={cat._id || i}>
                          <Link href={`/${activeGroup.routeLink}/${selectedSubCategory.routeLink}/${cat.routeLink}`} onClick={onClose} className="block p-3 rounded-lg border border-gray-200">
                            <Typography variant="h7" sx={{ color: '#707071ff', ":hover": { color: "#7950f2" } }}>
                              {cat.name}
                            </Typography>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-gray-500 py-12">No hay productos disponibles</p>
                  )}
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
