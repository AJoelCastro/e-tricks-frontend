import { useState, useCallback, useEffect } from 'react';
import { IProduct } from '@/interfaces/Product';

// Datos estáticos para filtros
export const SEASONS = [
    { value: 'primavera', label: 'Primavera' },
    { value: 'verano', label: 'Verano' },
    { value: 'otono', label: 'Otoño' },
    { value: 'invierno', label: 'Invierno' }
];

export const STATIC_BRANDS = [
    { value: 'Tricks', label: 'Tricks' },
    { value: 'Naiza', label: 'Naiza' },
];

export interface FilterState {
    type: string;
    priceRange: [number, number];
    selectedSeason: string;
    selectedBrand: string;
    selectedCategory: string;
}

interface UseProductFilterProps {
    products: IProduct[];
    initialMinPrice?: number;
    initialMaxPrice?: number;
}

interface UseProductFilterReturn {
    // Estado
    filter: FilterState;
    filteredProducts: IProduct[];
    minPrice: number;
    maxPrice: number;
    
    // Acciones
    handleFilterTypeChange: (newType: string) => void;
    handlePriceRangeChange: (event: Event, newValue: number | number[]) => void;
    handleSeasonChange: (event: any) => void;
    handleBrandChange: (event: any) => void;
    handleCategoryChange: (event: any) => void;
    handleMinPriceChange: (value: number) => void;
    handleMaxPriceChange: (value: number) => void;
    clearFilters: () => void;
    
    // Utilidades
    getActiveFilterCount: () => number;
    getFilterDescription: () => string;
}

export const useProductFilter = ({ 
    products, 
    initialMinPrice = 0, 
    initialMaxPrice = 1000 
}: UseProductFilterProps): UseProductFilterReturn => {
    const [minPrice, setMinPrice] = useState<number>(initialMinPrice);
    const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    
    // Estado del filtro
    const [filter, setFilter] = useState<FilterState>({
        type: '',
        priceRange: [initialMinPrice, initialMaxPrice],
        selectedSeason: '',
        selectedBrand: '',
        selectedCategory: ''
    });

    // Calcular rango de precios automáticamente cuando cambian los productos
    useEffect(() => {
        if (products && products.length > 0) {
            const prices = products.map((item: IProduct) => item.price);
            const min = Math.floor(Math.min(...prices));
            const max = Math.ceil(Math.max(...prices));
            setMinPrice(min);
            setMaxPrice(max);
            setFilter(prev => ({
                ...prev,
                priceRange: [min, max]
            }));
        }
    }, [products]);

    // Aplicar filtros
    const applyFilters = useCallback(() => {
        if (!products || products.length === 0) {
            setFilteredProducts([]);
            return;
        }

        let filtered = [...products];

        switch (filter.type) {
            case 'nombre':
                filtered.sort((a: IProduct, b: IProduct) => a.name.localeCompare(b.name));
                break;
                
            case 'precio':
                filtered = filtered.filter((item: IProduct) => 
                    item.price >= filter.priceRange[0] && item.price <= filter.priceRange[1]
                );
                filtered.sort((a: IProduct, b: IProduct) => a.price - b.price);
                break;
                
            case 'marca':
                if (filter.selectedBrand) {
                    filtered = filtered.filter((item: IProduct) => 
                        item.brand.name.toLowerCase().includes(filter.selectedBrand.toLowerCase())
                    );
                }
                filtered.sort((a: IProduct, b: IProduct) => a.brand.name.localeCompare(b.brand.name));
                break;
                
            case 'material':
                if (filter.selectedCategory) {
                    filtered = filtered.filter((item: IProduct) => 
                        item.material.name.toLowerCase().includes(filter.selectedCategory.toLowerCase())
                    );
                }
                filtered.sort((a: IProduct, b: IProduct) => a.material.name.localeCompare(b.material.name));
                break;
                
            case 'temporada':
                if (filter.selectedSeason) {
                    filtered = filtered.filter((item: IProduct) => {
                        // Si el producto no tiene temporada definida o está vacía, no se filtra
                        if (!item.season || item.season === '') {
                            return false;
                        }
                        return item.season.toLowerCase() === filter.selectedSeason.toLowerCase();
                    });
                }
                break;
                
            default:
                // Sin filtro específico, mantener orden original
                break;
        }

        setFilteredProducts(filtered);
    }, [filter, products]);

    useEffect(() => {
        applyFilters();
    }, [filter, products, applyFilters]);

    // Handlers
    const handleFilterTypeChange = useCallback((newType: string) => {
        setFilter(prev => ({
            ...prev,
            type: newType,
            // Resetear otros filtros cuando cambia el tipo
            selectedSeason: '',
            selectedBrand: '',
            selectedCategory: '',
            priceRange: [minPrice, maxPrice]
        }));
    }, [minPrice, maxPrice]);

    const handlePriceRangeChange = useCallback((event: Event, newValue: number | number[]) => {
        setFilter(prev => ({
            ...prev,
            priceRange: newValue as [number, number]
        }));
    }, []);

    const handleSeasonChange = useCallback((event: any) => {
        setFilter(prev => ({
            ...prev,
            selectedSeason: event.target.value
        }));
    }, []);

    const handleBrandChange = useCallback((event: any) => {
        setFilter(prev => ({
            ...prev,
            selectedBrand: event.target.value
        }));
    }, []);

    const handleCategoryChange = useCallback((event: any) => {
        setFilter(prev => ({
            ...prev,
            selectedCategory: event.target.value
        }));
    }, []);

    const handleMinPriceChange = useCallback((value: number) => {
        const newMin = Math.max(minPrice, Math.min(value, filter.priceRange[1]));
        setFilter(prev => ({
            ...prev,
            priceRange: [newMin, prev.priceRange[1]]
        }));
    }, [minPrice, filter.priceRange]);

    const handleMaxPriceChange = useCallback((value: number) => {
        const newMax = Math.min(maxPrice, Math.max(value, filter.priceRange[0]));
        setFilter(prev => ({
            ...prev,
            priceRange: [prev.priceRange[0], newMax]
        }));
    }, [maxPrice, filter.priceRange]);

    const clearFilters = useCallback(() => {
        setFilter({
            type: '',
            priceRange: [minPrice, maxPrice],
            selectedSeason: '',
            selectedBrand: '',
            selectedCategory: ''
        });
    }, [minPrice, maxPrice]);

    // Utilidades
    const getActiveFilterCount = useCallback(() => {
        let count = 0;
        if (filter.type) count++;
        if (filter.selectedSeason) count++;
        if (filter.selectedBrand) count++;
        if (filter.selectedCategory) count++;
        if (filter.priceRange[0] !== minPrice || filter.priceRange[1] !== maxPrice) count++;
        return count;
    }, [filter, minPrice, maxPrice]);

    const getFilterDescription = useCallback(() => {
        const descriptions = [];
        if (filter.type === 'precio') {
            descriptions.push(`Precio: S/ ${filter.priceRange[0]} - S/ ${filter.priceRange[1]}`);
        }
        if (filter.selectedBrand) {
            descriptions.push(`Marca: ${filter.selectedBrand}`);
        }
        if (filter.selectedSeason) {
            const seasonLabel = SEASONS.find(s => s.value === filter.selectedSeason)?.label;
            descriptions.push(`Temporada: ${seasonLabel}`);
        }
        if (filter.selectedCategory) {
            descriptions.push(`Material: ${filter.selectedCategory}`);
        }
        return descriptions.join(' • ');
    }, [filter]);

    return {
        // Estado
        filter,
        filteredProducts,
        minPrice,
        maxPrice,
        
        // Acciones
        handleFilterTypeChange,
        handlePriceRangeChange,
        handleSeasonChange,
        handleBrandChange,
        handleCategoryChange,
        handleMinPriceChange,
        handleMaxPriceChange,
        clearFilters,
        
        // Utilidades
        getActiveFilterCount,
        getFilterDescription
    };
};