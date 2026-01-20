import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    useMediaQuery,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Drawer,
    IconButton,
    Menu,
    Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { FilterState, SEASONS, STATIC_BRANDS } from '@/hooks/useProductFilter';

interface ProductFilterProps {
    // Estado del filtro
    filter: FilterState;
    minPrice: number;
    maxPrice: number;
    
    // Handlers
    onFilterTypeChange: (newType: string) => void;
    onPriceRangeChange: (event: Event, newValue: number | number[]) => void;
    onSeasonChange: (event: any) => void;
    onBrandChange: (event: any) => void;
    onCategoryChange: (event: any) => void;
    onClearFilters: () => void;
    
    // Opcional: personalización
    customBrands?: Array<{ value: string; label: string }>;
    customCategories?: Array<{ value: string; label: string }>;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
    filter,
    minPrice,
    maxPrice,
    onFilterTypeChange,
    onPriceRangeChange,
    onSeasonChange,
    onBrandChange,
    onCategoryChange,
    onClearFilters,
    customBrands = STATIC_BRANDS,
    customCategories = []
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('');

    const handleMenuOpen = (filterType: string, event: React.MouseEvent<HTMLElement>) => {
        if (activeFilter === filterType) {
            // Si ya está activo, lo cerramos
            setActiveFilter('');
            setAnchorEl(null);
        } else {
            // Si no está activo, lo abrimos
            setAnchorEl(event.currentTarget);
            setActiveFilter(filterType);
            onFilterTypeChange(filterType);
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActiveFilter('');
    };

    const filterButtons = [
        { key: 'precio', label: 'Precio' },
        { key: 'marca', label: 'Marca' },
        { key: 'temporada', label: 'Temporada' },
        { key: 'material', label: 'Material' }
    ];

    // Renderizar contenido del menú según el tipo de filtro
    const renderMenuContent = (filterType: string) => {
        switch (filterType) {
            case 'precio':
                return (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
                            Rango de precio
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                            S/ {filter.priceRange[0]} - S/ {filter.priceRange[1]}
                        </Typography>
                        <Box sx={{ px: 2, py: 1 }}>
                            <Slider
                                value={filter.priceRange}
                                onChange={onPriceRangeChange}
                                valueLabelDisplay="auto"
                                min={minPrice}
                                max={maxPrice}
                                valueLabelFormat={(value) => `S/ ${value}`}
                                sx={{
                                    color: '#000',
                                    '& .MuiSlider-thumb': {
                                        backgroundColor: '#000',
                                        width: 20,
                                        height: 20,
                                        '&:hover': {
                                            boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.16)',
                                        },
                                    },
                                    '& .MuiSlider-track': {
                                        backgroundColor: '#000',
                                        height: 3,
                                    },
                                    '& .MuiSlider-rail': {
                                        backgroundColor: '#e0e0e0',
                                        height: 3,
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                            <Button
                                onClick={handleMenuClose}
                                variant="contained"
                                sx={{
                                    backgroundColor: '#000',
                                    color: 'white',
                                    textTransform: 'none',
                                    px: 4,
                                    py: 1,
                                    borderRadius: '8px',
                                    '&:hover': {
                                        backgroundColor: '#333'
                                    }
                                }}
                            >
                                Aplicar
                            </Button>
                        </Box>
                    </Box>
                );

            case 'marca':
                return (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: '#333', fontWeight: 600, px: 1, pb: 1 }}>
                            Seleccionar marca
                        </Typography>
                        {customBrands.map((brand) => (
                            <Box
                                key={brand.value}
                                onClick={() => {
                                    onBrandChange({ target: { value: brand.label } });
                                    handleMenuClose();
                                }}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    backgroundColor: filter.selectedBrand === brand.label ? '#f5f5f5' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: '#f8f9fa'
                                    }
                                }}
                            >
                                <Typography sx={{ fontSize: '15px', ":hover":{color:'primary.main'} }}>
                                    {brand.label}
                                </Typography>
                            </Box>
                        ))}
                        <Divider sx={{ my: 1 }} />
                        <Box
                            onClick={() => {
                                onBrandChange({ target: { value: '' } });
                                handleMenuClose();
                            }}
                            sx={{
                                p: 2,
                                cursor: 'pointer',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: '#f8f9fa'
                                }
                            }}
                        >
                            <Typography sx={{ fontSize: '15px', fontStyle: 'italic', color: '#666', ":hover":{color:'primary.main'} }}>
                                Todas las marcas
                            </Typography>
                        </Box>
                    </Box>
                );

            case 'temporada':
                return (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: '#333', fontWeight: 600, px: 1, pb: 1 }}>
                            Seleccionar temporada
                        </Typography>
                        {SEASONS.map((season) => (
                            <Box
                                key={season.value}
                                onClick={() => {
                                    onSeasonChange({ target: { value: season.value } });
                                    handleMenuClose();
                                }}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    backgroundColor: filter.selectedSeason === season.value ? '#f5f5f5' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: '#f8f9fa'
                                    }
                                }}
                            >
                                <Typography sx={{ fontSize: '15px', ":hover":{color:'primary.main'} }}>
                                    {season.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                );

            case 'material':
                // Extraer materiales únicos de los productos
                const materials = Array.from(new Set(
                    customCategories.length > 0 
                        ? customCategories.map(cat => cat.label)
                        : ['Cuero', 'Charol', 'Sintético', 'Tela', 'Lona'] // materiales por defecto
                ));
                
                return (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: '#333', fontWeight: 600, px: 1, pb: 1 }}>
                            Seleccionar material
                        </Typography>
                        {materials.map((material) => (
                            <Box
                                key={material}
                                onClick={() => {
                                    onCategoryChange({ target: { value: material } });
                                    handleMenuClose();
                                }}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    backgroundColor: filter.selectedCategory === material ? '#f5f5f5' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: '#f8f9fa'
                                    }
                                }}
                            >
                                <Typography sx={{ fontSize: '15px', ":hover":{color:'primary.main'} }}>
                                    {material}
                                </Typography>
                            </Box>
                        ))}
                        <Divider sx={{ my: 1 }} />
                        <Box
                            onClick={() => {
                                onCategoryChange({ target: { value: '' } });
                                handleMenuClose();
                            }}
                            sx={{
                                p: 2,
                                cursor: 'pointer',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: '#f8f9fa'
                                }
                            }}
                        >
                            <Typography sx={{ fontSize: '15px', fontStyle: 'italic', color: '#666', ":hover":{color:'primary.main'} }}>
                                Todos los materiales
                            </Typography>
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    // Contenido del filtro para desktop
    const DesktopFilter = () => (
        <Box sx={{ 
            width: '100%',
            backgroundColor: '#f8f9fa', 
            borderBottom: '1px solid #e0e0e0',
            py: 1,
            px: 4,
            position: 'relative',
            borderRadius: 2,
            zIndex: 1
        }}>
            {/* Primera fila - Botones de filtro */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                width: '100%'
            }}>
                {/* Botones de filtro */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                    {filterButtons.map((button) => (
                        <Box key={button.key} sx={{ position: 'relative' }}>
                            <Button
                                onClick={(e) => handleMenuOpen(button.key, e)}
                                variant="text"
                                endIcon={<ExpandMoreIcon sx={{ 
                                    fontSize: '18px !important',
                                    transform: activeFilter === button.key ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease'
                                }} />}
                                sx={{
                                    color: activeFilter === button.key ? 'primary.main' : '#666',
                                    backgroundColor: activeFilter === button.key ? '#f0f0f0' : 'transparent',
                                    textTransform: 'none',
                                    fontSize: '15px',
                                    fontWeight: activeFilter === button.key ? 600 : 500,
                                    px: 2,
                                    py: 1.5,
                                    minWidth: 'auto',
                                    borderRadius: '8px',
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                        color: 'primary.main'
                                    },
                                    '& .MuiButton-endIcon': {
                                        marginLeft: '6px'
                                    }
                                }}
                            >
                                {button.label}
                                {button.key === 'material' && filter.selectedCategory && (
                                    <Box component="span" sx={{ 
                                        fontSize: '11px', 
                                        verticalAlign: 'super',
                                        ml: 0.5,
                                        color: '#999'
                                    }}>
                                        1
                                    </Box>
                                )}
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Contenido del filtro activo - se muestra debajo de los botones */}
            {activeFilter && (
                <Box sx={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    mb: 2,
                    position: 'relative',
                    zIndex: 10
                }}>
                    {renderMenuContent(activeFilter)}
                </Box>
            )}

            {/* Segunda fila - Filtros activos */}
            {(filter.selectedBrand || filter.selectedSeason || filter.selectedCategory || 
              (filter.priceRange[0] !== minPrice || filter.priceRange[1] !== maxPrice)) && (
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    pt: 2,
                    borderTop: '1px solid #e0e0e0',
                    width: '100%'
                }}>
                    {filter.selectedBrand && (
                        <Chip
                            label={filter.selectedBrand}
                            onDelete={() => onBrandChange({ target: { value: '' } })}
                            deleteIcon={<CloseIcon sx={{ fontSize: '18px !important' }} />}
                            sx={{
                                backgroundColor: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '20px',
                                height: '36px',
                                fontSize: '14px',
                                px: 1,
                                '& .MuiChip-label': {
                                    px: 2
                                },
                                '& .MuiChip-deleteIcon': {
                                    fontSize: '18px',
                                    color: '#666',
                                    ml: 1,
                                    '&:hover': {
                                        color: '#000'
                                    }
                                }
                            }}
                        />
                    )}
                    
                    {filter.selectedSeason && (
                        <Chip
                            label={SEASONS.find(s => s.value === filter.selectedSeason)?.label || filter.selectedSeason}
                            onDelete={() => onSeasonChange({ target: { value: '' } })}
                            deleteIcon={<CloseIcon sx={{ fontSize: '18px !important' }} />}
                            sx={{
                                backgroundColor: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '20px',
                                height: '36px',
                                fontSize: '14px',
                                px: 1,
                                '& .MuiChip-label': {
                                    px: 2
                                },
                                '& .MuiChip-deleteIcon': {
                                    fontSize: '18px',
                                    color: '#666',
                                    ml: 1,
                                    '&:hover': {
                                        color: '#000'
                                    }
                                }
                            }}
                        />
                    )}

                    {filter.selectedCategory && (
                        <Chip
                            label={filter.selectedCategory}
                            onDelete={() => onCategoryChange({ target: { value: '' } })}
                            deleteIcon={<CloseIcon sx={{ fontSize: '18px !important' }} />}
                            sx={{
                                backgroundColor: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '20px',
                                height: '36px',
                                fontSize: '14px',
                                px: 1,
                                '& .MuiChip-label': {
                                    px: 2
                                },
                                '& .MuiChip-deleteIcon': {
                                    fontSize: '18px',
                                    color: '#666',
                                    ml: 1,
                                    '&:hover': {
                                        color: '#000'
                                    }
                                }
                            }}
                        />
                    )}

                    {(filter.priceRange[0] !== minPrice || filter.priceRange[1] !== maxPrice) && (
                        <Chip
                            label={`S/ ${filter.priceRange[0]} - S/ ${filter.priceRange[1]}`}
                            onDelete={() => onPriceRangeChange({} as Event, [minPrice, maxPrice])}
                            deleteIcon={<CloseIcon sx={{ fontSize: '18px !important' }} />}
                            sx={{
                                backgroundColor: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '20px',
                                height: '36px',
                                fontSize: '14px',
                                px: 1,
                                '& .MuiChip-label': {
                                    px: 2
                                },
                                '& .MuiChip-deleteIcon': {
                                    fontSize: '18px',
                                    color: '#666',
                                    ml: 1,
                                    '&:hover': {
                                        color: '#000'
                                    }
                                }
                            }}
                        />
                    )}
                    
                    <Button
                        onClick={onClearFilters}
                        variant="text"
                        sx={{
                            color: '#666',
                            textTransform: 'none',
                            fontSize: '14px',
                            textDecoration: 'underline',
                            padding: '6px 12px',
                            minWidth: 'auto',
                            borderRadius: '6px',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                                color: '#000',
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Borrar todos los filtros
                    </Button>
                </Box>
            )}
        </Box>
    );

    // Contenido del filtro para móvil
    const MobileFilter = () => (
        <>
            {/* Botón para abrir drawer en móvil */}
            <Box sx={{ 
                width: '100%',
                backgroundColor: '#f8f9fa', 
                borderBottom: '1px solid #e0e0e0',
                py: 1,
                px: 3,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Button
                    startIcon={<FilterListIcon />}
                    onClick={() => setMobileDrawerOpen(true)}
                    variant="text"
                    sx={{
                        color: '#000',
                        borderColor: '#e0e0e0',
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: '#000',
                            backgroundColor: 'transparent'
                        }
                    }}
                >
                    Filtros
                    {(filter.selectedBrand || filter.selectedSeason || filter.selectedCategory) && (
                        <Chip
                            size="small"
                            label="1"
                            sx={{
                                ml: 1,
                                backgroundColor: '#000',
                                color: 'white',
                                height: '22px',
                                fontSize: '12px'
                            }}
                        />
                    )}
                </Button>
            </Box>

            {/* Drawer para móvil */}
            <Drawer
                anchor="bottom"
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '85vh',
                        zIndex: 1300
                    }
                }}
            >
                <Box sx={{ p: 4 }}>
                    {/* Header del drawer */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 4
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '20px' }}>
                            Filtros
                        </Typography>
                        <IconButton 
                            onClick={() => setMobileDrawerOpen(false)}
                            sx={{ 
                                backgroundColor: '#f5f5f5', 
                                '&:hover': { backgroundColor: '#e0e0e0' } 
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Filtros en el drawer */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {filterButtons.map((button) => (
                            <Button
                                key={button.key}
                                onClick={() => {
                                    onFilterTypeChange(button.key);
                                    setMobileDrawerOpen(false);
                                }}
                                variant={filter.type === button.key ? 'contained' : 'outlined'}
                                sx={{
                                    justifyContent: 'flex-start',
                                    textTransform: 'none',
                                    py: 2,
                                    px: 3,
                                    fontSize: '16px',
                                    borderRadius: '12px',
                                    backgroundColor: filter.type === button.key ? '#000' : 'transparent',
                                    borderColor: '#e0e0e0',
                                    color: filter.type === button.key ? 'white' : '#000',
                                    '&:hover': {
                                        backgroundColor: filter.type === button.key ? '#333' : '#f5f5f5',
                                        borderColor: '#000'
                                    }
                                }}
                            >
                                {button.label}
                                {button.key === 'material' && filter.selectedCategory && (
                                    <Box component="span" sx={{ 
                                        fontSize: '12px',
                                        ml: 1,
                                        opacity: 0.7
                                    }}>
                                        1
                                    </Box>
                                )}
                            </Button>
                        ))}
                    </Box>

                    {/* Filtros activos en drawer */}
                    {(filter.selectedBrand || filter.selectedSeason || filter.selectedCategory) && (
                        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #e0e0e0' }}>
                            <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 600, fontSize: '16px' }}>
                                Filtros activos:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                {filter.selectedBrand && (
                                    <Chip
                                        label={filter.selectedBrand}
                                        onDelete={() => onBrandChange({ target: { value: '' } })}
                                        sx={{
                                            height: '36px',
                                            fontSize: '14px',
                                            borderRadius: '18px'
                                        }}
                                    />
                                )}
                                {filter.selectedSeason && (
                                    <Chip
                                        label={SEASONS.find(s => s.value === filter.selectedSeason)?.label || filter.selectedSeason}
                                        onDelete={() => onSeasonChange({ target: { value: '' } })}
                                        sx={{
                                            height: '36px',
                                            fontSize: '14px',
                                            borderRadius: '18px'
                                        }}
                                    />
                                )}
                                {filter.selectedCategory && (
                                    <Chip
                                        label={filter.selectedCategory}
                                        onDelete={() => onCategoryChange({ target: { value: '' } })}
                                        sx={{
                                            height: '36px',
                                            fontSize: '14px',
                                            borderRadius: '18px'
                                        }}
                                    />
                                )}
                            </Box>
                            <Button
                                onClick={() => {
                                    onClearFilters();
                                    setMobileDrawerOpen(false);
                                }}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    color: '#000',
                                    borderColor: '#e0e0e0',
                                    textTransform: 'none',
                                    py: 2,
                                    fontSize: '16px',
                                    borderRadius: '12px'
                                }}
                            >
                                Borrar todos los filtros
                            </Button>
                        </Box>
                    )}
                </Box>
            </Drawer>
        </>
    );

    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            {isMobile ? <MobileFilter /> : <DesktopFilter />}
        </Box>
    );
};

export default ProductFilter;