import React from 'react';
import {
    Box,
    Button,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useMediaQuery,
    ListItem,
    List,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Renderizar controles de filtro específicos
    const renderFilterControls = () => {
        switch (filter.type) {
            case 'precio':
                return (
                    <Box sx={{ px: 3, py: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Rango de precio: S/ {filter.priceRange[0]} - S/ {filter.priceRange[1]}
                        </Typography>
                        <Slider
                            value={filter.priceRange}
                            onChange={onPriceRangeChange}
                            valueLabelDisplay="auto"
                            min={minPrice}
                            max={maxPrice}
                            valueLabelFormat={(value) => `S/ ${value}`}
                            sx={{
                                color: '#7950f2',
                                '& .MuiSlider-thumb': {
                                    backgroundColor: '#7950f2',
                                },
                                '& .MuiSlider-track': {
                                    backgroundColor: '#7950f2',
                                },
                                '& .MuiSlider-rail': {
                                    backgroundColor: '#e0e0e0',
                                }
                            }}
                        />
                    </Box>
                );

            case 'temporada':
                return (
                    <Box sx={{ px: 3, py: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Seleccionar temporada</InputLabel>
                            <Select
                                value={filter.selectedSeason}
                                onChange={onSeasonChange}
                                label="Seleccionar temporada"
                            >
                                <MenuItem value="">
                                    <em>Todas las temporadas</em>
                                </MenuItem>
                                {SEASONS.map((season) => (
                                    <MenuItem key={season.value} value={season.value}>
                                        {season.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                );

            case 'marca':
                return (
                    <Box sx={{ px: 3, py: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Seleccionar marca</InputLabel>
                            <Select
                                value={filter.selectedBrand}
                                onChange={onBrandChange}
                                label="Seleccionar marca"
                            >
                                <MenuItem value="">
                                    <em>Todas las marcas</em>
                                </MenuItem>
                                {customBrands.map((brand) => (
                                    <MenuItem key={brand.value} value={brand.label}>
                                        {brand.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                );

            case 'categoria':
                return (
                    <Box sx={{ px: 3, py: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Seleccionar categoría</InputLabel>
                            <Select
                                value={filter.selectedCategory}
                                onChange={onCategoryChange}
                                label="Seleccionar categoría"
                            >
                                <MenuItem value="">
                                    <em>Todas las categorías</em>
                                </MenuItem>
                                {customCategories.map((category) => (
                                    <MenuItem key={category.value} value={category.label}>
                                        {category.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                );

            default:
                return null;
        }
    };

    const filterButtons = [
        { key: 'nombre', label: 'NOMBRE' },
        { key: 'precio', label: 'PRECIO' },
        { key: 'marca', label: 'MARCA' },
        { key: 'categoria', label: 'CATEGORÍA' },
        { key: 'temporada', label: 'TEMPORADA' }
    ];

    return (
        <Box>
            {/* Sección de filtros */}
            <Grid container sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 2,
                marginX: 4,
                marginBottom: 2,
                mt: { xs: 0, sm: 1, md: 3 }
            }}>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    {isMobile ? (
                        <Accordion elevation={1} sx={{ borderRadius: 2, paddingY: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="productCategory">Filtrar por</Typography>
                                    {filter.type && (
                                        <Chip 
                                            label={filter.type.toUpperCase()} 
                                            size="small" 
                                            sx={{ backgroundColor: '#7950f2', color: 'white' }}
                                        />
                                    )}
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List sx={{ width: '100%' }}>
                                    {filterButtons.map((button) => (
                                        <ListItem key={button.key}>
                                            <Button 
                                                fullWidth 
                                                onClick={() => onFilterTypeChange(button.key)}
                                                variant={filter.type === button.key ? 'contained' : 'text'}
                                                sx={filter.type === button.key ? {
                                                    backgroundColor: '#7950f2',
                                                    '&:hover': { backgroundColor: '#6a40e0' }
                                                } : {}}
                                            >
                                                <Typography variant="body2">{button.label}</Typography>
                                            </Button>
                                        </ListItem>
                                    ))}
                                    {filter.type && (
                                        <ListItem>
                                            <Button 
                                                fullWidth 
                                                onClick={onClearFilters}
                                                color="error"
                                                variant="outlined"
                                            >
                                                <Typography variant="body2">LIMPIAR FILTROS</Typography>
                                            </Button>
                                        </ListItem>
                                    )}
                                </List>
                                {renderFilterControls()}
                            </AccordionDetails>
                        </Accordion>
                    ) : (
                        <Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                paddingX: 2,
                                paddingY: 1,
                                gap: 1
                            }}>
                                <Typography variant="productCategory" >
                                    FILTRAR POR
                                </Typography>
                                {filterButtons.map((button) => (
                                    <Button 
                                        key={button.key}
                                        onClick={() => onFilterTypeChange(button.key)}
                                        variant={filter.type === button.key ? 'contained' : 'text'}
                                        sx={filter.type === button.key ? {
                                            backgroundColor: '#7950f2',
                                            '&:hover': { backgroundColor: '#6a40e0' }
                                        } : {}}
                                    >
                                        <Typography variant="body2">{button.label}</Typography>
                                    </Button>
                                ))}
                                {filter.type && (
                                    <Button 
                                        onClick={onClearFilters}
                                        color="error"
                                        variant="outlined"
                                        size="small"
                                    >
                                        <Typography variant="body2">LIMPIAR</Typography>
                                    </Button>
                                )}
                            </Box>
                            {renderFilterControls()}
                        </Box>
                    )}
                </Grid>
            </Grid>
            
        </Box>
    );
};

export default ProductFilter;