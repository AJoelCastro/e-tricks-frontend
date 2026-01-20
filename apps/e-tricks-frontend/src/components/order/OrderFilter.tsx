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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Grid,
    TextField,
    InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Search } from "lucide-react";

interface FilterState {
    type: string;
    selectedPeriod: string;
    searchTerm: string;
}

interface OrderFilterProps {
    filter: FilterState;
    
    // Handlers
    onFilterTypeChange: (newType: string) => void;
    onPeriodChange: (event: any) => void;
    onSearchChange: (searchTerm: string) => void;
    onClearFilters: () => void;
    
    // Contadores para mostrar en los botones
    counts?: {
        todo: number;
        pending: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
}

const OrderFilter: React.FC<OrderFilterProps> = ({
    filter,
    onFilterTypeChange,
    onPeriodChange,
    onSearchChange,
    onClearFilters,
    counts = {
        todo: 0,
        pending: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    }
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const filterButtons = [
        { key: 'todo', label: 'Ver todo', count: counts.todo },
        { key: 'processing', label: 'A enviar', count: counts.pending },
        { key: 'shipped', label: 'Enviado', count: counts.shipped },
        { key: 'delivered', label: 'Finalizado', count: counts.delivered },
        { key: 'cancelled', label: 'Procesado', count: counts.cancelled }
    ];

    const periods = [
        { key: '6', label: 'Últimos 6 meses' },
        { key: '12', label: 'Últimos 12 meses' },
        { key: '24', label: 'Hace 2 años o más' }
    ];

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    return (
        <Box>
            <Grid container sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 2,
                mx: { xs: 2, sm: 2, md: 4 },
                marginBottom: 2,
                mt: { xs: 0, sm: 1, md: 3 }
            }}>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    {isMobile ? (
                        <Accordion elevation={1} sx={{ borderRadius: 2, paddingY: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="priceCard" >
                                        Pedidos
                                    </Typography>
                                    {filter.type && filter.type !== 'todo' && (
                                        <Chip
                                            label={filterButtons.find(b => b.key === filter.type)?.label}
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
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                    <Typography variant="body2">{button.label}</Typography>
                                                    {button.count > 0 && (
                                                        <Typography variant="body2">{button.count}</Typography>
                                                    )}
                                                </Box>
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                                
                            </AccordionDetails>
                        </Accordion>
                    ) : (
                        <Box>
                            {/* Barra de filtros superior */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                paddingX: 3,
                                paddingY: 2,
                                gap: 1,
                                borderBottom: '1px solid #f0f0f0'
                            }}>
                                {filterButtons.map((button) => (
                                    <Button
                                        key={button.key}
                                        onClick={() => onFilterTypeChange(button.key)}
                                        variant={filter.type === button.key ? 'contained' : 'text'}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: '5px',
                                            minHeight: '36px',
                                            px: 2
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {button.label}
                                            </Typography>
                                            {button.count > 0 && (
                                                <Typography variant="body2" sx={{ 
                                                    opacity: 0.8,
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {button.count}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Button>
                                ))}
                            </Box>
                            
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default OrderFilter;