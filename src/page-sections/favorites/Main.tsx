import React, { useEffect, useState } from 'react'
import ProductCard from '../../components/cards/Products'
import ProductService from '@/services/ProductService'
import { CircularProgress } from '@mui/material'

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
    <div className=''>
      
    </div>
  )
}

export default MainFavorites
