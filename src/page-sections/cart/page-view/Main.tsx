"use client";
import React, { useEffect, useState } from 'react'
import ProductService from '@/services/ProductService'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  images: string[]
}

const MainCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Simulación de carga de productos del carrito
    const getCartItems = async() => {
      try {
        setLoading(true)
        const data = await ProductService.GetProducts()
        // Simulamos que algunos productos están en el carrito
        // En una implementación real, esto vendría del backend
        const fakeCartItems = data.slice(0, 3).map(product => ({
          ...product,
          quantity: Math.floor(Math.random() * 3) + 1 // Cantidad aleatoria entre 1 y 3
        }))
        setCartItems(fakeCartItems)
      } catch (error) {
        console.error('Error al cargar el carrito:', error)
      } finally {
        setLoading(false)
      }
    }
    
    getCartItems()
  }, [])

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return (
    <div className='container mx-auto px-4 py-8 bg-white'> {/* Añadido bg-white */}
      <h1 className='text-3xl font-bold mb-6'>Mi Carrito</h1>
      
      {loading ? (
        <div className='flex justify-center items-center h-40'>
          <p className='text-gray-500'>Cargando tu carrito...</p>
        </div>
      ) : cartItems.length > 0 ? (
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='lg:w-2/3 bg-white'> {/* Añadido bg-white */}
            {cartItems.map((item) => (
              <div key={item.id} className='flex flex-col sm:flex-row items-center border-b border-gray-200 py-4 gap-4 bg-white'> {/* Añadido bg-white */}
                <div className='sm:w-24 h-24 relative'>
                  <Image 
                    src={item.images[0]} 
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className='rounded'
                  />
                </div>
                <div className='flex-1 sm:ml-4'>
                  <h3 className='font-medium text-lg text-gray-900'>{ /* Añadido text-gray-900 */ }{item.name}</h3>
                  <p className='text-gray-600 mt-1'>S/ {item.price.toFixed(2)}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <button 
                    className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center'
                    onClick={() => updateQuantity(item?.id, item?.quantity - 1)}
                  >
                    -
                  </button>
                  <span className='w-8 text-center'>{item.quantity}</span>
                  <button 
                    className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center'
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className='text-right sm:w-24'>
                  <p className='font-medium'>S/ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button 
                  className='text-red-500 hover:text-red-700 transition-colors'
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <div className='lg:w-1/3 bg-gray-50 p-6 rounded-lg h-fit'> {/* Ya tiene bg-gray-50 que es claro */}
            <h2 className='text-xl font-bold mb-4'>Resumen de compra</h2>
            <div className='space-y-3 mb-4'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Subtotal</span>
                <span>S/ {calculateTotal().toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Envío</span>
                <span>Gratis</span>
              </div>
              <div className='border-t border-gray-200 pt-3 mt-3'>
                <div className='flex justify-between font-bold'>
                  <span>Total</span>
                  <span>S/ {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button className='w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors'>
              Proceder al pago
            </button>
          </div>
        </div>
      ) : (
        <div className='text-center py-10 bg-white'> {/* Añadido bg-white */}
          <p className='text-xl text-gray-600 mb-4'>Tu carrito está vacío</p>
          <p className='text-gray-500 mb-6'>Añade productos a tu carrito para verlos aquí</p>
          <button className='bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors'>
            Continuar comprando
          </button>
        </div>
      )}
    </div>
  )
}

export default MainCart
