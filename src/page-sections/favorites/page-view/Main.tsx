import React, { useEffect, useState } from 'react'
import ProductCard from '../../components/cards/Products'
import ProductService from '@/services/ProductService'

const MainFavorites = () => {
  const [favorites, setFavorites] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Simulación de carga de favoritos
    // En un caso real, deberías tener un endpoint específico para obtener favoritos
    const getFavorites = async() => {
      try {
        setLoading(true)
        const data = await ProductService.GetProducts()
        // Simulamos que solo algunos productos son favoritos
        // En una implementación real, esto vendría del backend
        const fakeFavorites = data.slice(0, 4) // Tomamos los primeros 4 productos como ejemplo
        setFavorites(fakeFavorites)
      } catch (error) {
        console.error('Error al cargar favoritos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    getFavorites()
  }, [])

  return (
    <div className='container mx-auto px-4 py-8 bg-white'> {/* Añadido bg-white */}
      <h1 className='text-3xl font-bold mb-6'>Mis Favoritos</h1>
      
      {loading ? (
        <div className='flex justify-center items-center h-40'>
          <p className='text-gray-500'>Cargando tus favoritos...</p>
        </div>
      ) : favorites.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {favorites.map((product, index) => (
            <div key={index} className='col-span-1'>
              <ProductCard products={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-10 bg-white'> {/* Añadido bg-white */}
          <p className='text-xl text-gray-600 mb-4'>No tienes productos favoritos</p>
          <p className='text-gray-500'>Explora nuestra tienda y marca tus productos favoritos para verlos aquí</p>
        </div>
      )}
    </div>
  )
}

export default MainFavorites
