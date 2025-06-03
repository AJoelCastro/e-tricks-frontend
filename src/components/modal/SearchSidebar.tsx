'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Heart, ShoppingBag, Search, X } from "lucide-react";


const SearchSidebar = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
    
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

   
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  const quickLinks = [
    'Outlet',
    'Nuevo',
    'Sigue tu pedido',
    'Tiendas'
  ];

  const suggestedProducts = [
    {
      id: 1,
      name: 'Zapatillas Urbanas Mujer North Star',
      brand: 'NORTH STAR',
      price: 169.90,
      currency: 'S/',
    },
    {
      id: 2,
      name: 'Zapatillas Deportivas Running Hombre',
      brand: 'POWER',
      originalPrice: 149.90,
      price: 119.92,
      discount: '-20%',
      currency: 'S/',
    },
    {
      id: 3,
      name: 'Zapatillas Urbanas Mujer North Star Azul',
      brand: 'NORTH STAR',
      originalPrice: 139.90,
      price: 111.92,
      discount: '-20%',
      currency: 'S/',
    },
    {
      id: 4,
      name: 'Zapatillas De Fútbol Hombre Power',
      brand: 'POWER',
      originalPrice: 139.90,
      price: 79.90,
      discount: '-43%',
      currency: 'S/',
    }
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;
  

  return (
    <div
      className="fixed inset-0  backdrop-blur-md bg-opacity-50 z-[60] flex justify-end"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white w-full max-w-5xl h-full shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header del Sidebar */}
        <div className="flex items-center border-b border-gray-200 p-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
            <input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border border-transparent focus:border-blue-500 transition-all"
              autoFocus
            />
          </div>
          <button
            onClick={handleClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Contenido del Sidebar */}
        <div className="flex h-full">
          {/* Enlaces Rápidos */}
          <div className="w-1/3 border-r border-gray-200 p-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Enlaces Rápidos
            </h3>
            <div className="space-y-1">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-sm"
                  onClick={() => {
                    console.log('Navegando a:', link);
                    handleClose();
                  }}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Productos Sugeridos */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
              Productos Sugeridos
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {suggestedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => {
                    console.log('Producto seleccionado:', product.name);
                    handleClose();
                  }}
                >
                  {/* Imagen del Producto */}
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
                  </div>

                  {/* Info del Producto */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      {product.brand}
                    </p>
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                      {product.name}
                    </h4>

                    {/* Precios */}
                    <div className="space-y-1">
                      {product.originalPrice && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400 line-through">
                            {product.currency} {product.originalPrice}
                          </span>
                          {product.discount && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
                              {product.discount}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-red-600">
                          {product.currency} {product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchSidebar;