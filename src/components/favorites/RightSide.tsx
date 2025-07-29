'use client';
import UserService from '@/services/UserService'
import { Box, CircularProgress, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ProductCard from '../product/Products';
import { useAuth } from '@clerk/nextjs';
import { IProduct } from '@/interfaces/Product';
import NoFavoritesFound from '../not-found/NoFavoritesFound';
import { useProductLogic } from '@/hooks/useProductLogic';
import { useProductFilter } from '@/hooks/useProductFilter';
import ProductFilter from '../product/ProductFilter';
import CartNotificationModal from '../cart/CartNotificationModal';
import ErrorNotification from '../ErrorNotification';
import { Typography, Button } from '@mui/material';

const RightSide = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [favorites, setFavorites] = useState<IProduct[]>([]);
    const { getToken } = useAuth();
    
    const {
        favoriteIds,
        cartItems,
        loading,
        cartNotificationOpen,
        lastAddedProduct,
        notification,
        closeNotification,
        handleAddFavorite,
        handleRemoveFavorite,
        handleAddToCart,
        handleRemoveFromCart,
        isProductInCart,
        closeCartNotification,
    } = useProductLogic();

    // Hook de filtros
    const {
        filter,
        filteredProducts,
        minPrice,
        maxPrice,
        handleFilterTypeChange,
        handlePriceRangeChange,
        handleSeasonChange,
        handleBrandChange,
        handleCategoryChange,
        clearFilters,
    } = useProductFilter({ products: favorites });

    const getFavorites = async () => {
        try {
            setIsLoading(true)
            const token = await getToken();
            const dataFavorites = await UserService.getFavorites(token as string)
            console.log("data favorites", dataFavorites)
            setFavorites(dataFavorites || [])
        } catch (error) {
            console.error('Error getting favorites:', error);
            setFavorites([]);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getFavorites()
    }, [])

    // Funciones para el manejo de productos
    const handleRemoveFavoriteLocal = async (productId: string) => {
        await handleRemoveFavorite(productId);
        setFavorites(prev => prev.filter((fav: IProduct) => fav._id !== productId));
    };

    const handleAddToCartLocal = async (productId: string, size: string, quantity: number) => {
        const product = favorites.find((fav: IProduct) => fav._id === productId);
        if (product) {
            await handleAddToCart(productId, size, quantity, product);
        } else {
            await handleAddToCart(productId, size, quantity);
        }
    };

    if (isLoading) {
        return (
            <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
            </Grid>
        )
    }

    return (
        <Box>
            {/* Notificaciones */}
            <ErrorNotification
                open={notification.open}
                onClose={closeNotification}
                message={notification.message}
                type={notification.type}
                autoHideDuration={3000}
            />

            <CartNotificationModal
                open={cartNotificationOpen}
                onClose={closeCartNotification}
                product={lastAddedProduct?.product || null}
                size={lastAddedProduct?.size}
                quantity={lastAddedProduct?.quantity}
                autoHideDuration={5000}
            />

            {/* Componente de filtros reutilizable */}
            <ProductFilter
                filter={filter}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onFilterTypeChange={handleFilterTypeChange}
                onPriceRangeChange={handlePriceRangeChange}
                onSeasonChange={handleSeasonChange}
                onBrandChange={handleBrandChange}
                onCategoryChange={handleCategoryChange}
                onClearFilters={clearFilters}
            />

            {/* Grid de productos */}
            <Grid container sx={{ marginX: 4, marginBottom: 4 }} spacing={3}>
                {
                    favorites.length === 0 ? (
                        <NoFavoritesFound />
                    ) : filteredProducts.length === 0 ? (
                        <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                No se encontraron productos con los filtros aplicados
                            </Typography>
                            <Button 
                                onClick={clearFilters} 
                                variant="outlined" 
                                sx={{ mt: 2 }}
                            >
                                Limpiar filtros
                            </Button>
                        </Grid>
                    ) : (
                        filteredProducts.map((favorite: IProduct) => (
                            <Grid
                                key={favorite._id}
                                size={{ xs: 12, sm: 6, md: 4 }}
                            >
                                <ProductCard
                                    products={favorite}
                                    markedFavorite={true}
                                    handleRemoveFavorite={handleRemoveFavoriteLocal}
                                    show
                                    handleAddToCart={handleAddToCartLocal}
                                    handleRemoveFromCart={handleRemoveFromCart}
                                    isInCart={isProductInCart(favorite._id)}
                                />
                            </Grid>
                        ))
                    )
                }
            </Grid>
        </Box>
    )
}

export default RightSide