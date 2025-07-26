'use client';
import { useState, useEffect } from 'react';
import {  Search, X } from "lucide-react";
import ProductService from '@/services/ProductService';
type Product = {
  name: string;
  description: string;
  images: string[];
  price: number;
  marca: string;
  descuento?: number;
};
type Props = {
  products?: Product;
  isOpen: boolean;
  onClose: () => void;
}



const SearchSidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
   const [suggestedProducts, setDataProducts] = useState<Array<any>>([]);
  useEffect(() => {
    if (isOpen) {
    
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

     const getProducts = async() =>{
      const data = await ProductService.GetProducts();
      setDataProducts(data);
    }
    getProducts();
   
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  const quickLinks = [
    'Outlet',
    'Nuevo',
    'Sigue tu pedido',
  ];

 


  const handleBackdropClick = (e: any) => {
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
                    <img src={product.images[0]} className=" bg-gray-300 rounded-lg" alt={product.name}/>
                  </div>

                  {/* Info del Producto */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      {product.marca}
                    </p>
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                      {product.name}
                    </h4>

                    {/* Precios */}
                    <div className="space-y-1">
                      {product.price && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400 line-through">
                           S/.  {product.price}
                          </span>
                          {product.descuento && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
                              {product.descuento}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-red-600">
                          S/. {product.price}
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