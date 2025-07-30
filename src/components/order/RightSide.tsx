'use client';
import { 
    Backdrop, 
    Box, 
    Button, 
    CircularProgress, 
    Fade, 
    Grid, 
    IconButton, 
    Menu, 
    MenuItem, 
    Modal, 
    Typography,
    Chip,
    Card,
    CardContent,
    Divider
} from '@mui/material'
import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LucideArrowLeft, User, Calendar, Package, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EmptyOrderComponent from '@/components/not-found/EmptyOrderComponent';
import ErrorNotification from '@/components/ErrorNotification';
import { useProductLogic } from '@/hooks/useProductLogic';
import { useCart } from '../../page-sections/cart/CartContext';
import { useAuth, useUser } from '@clerk/nextjs';
import OrderService from '@/services/OrderService';
import { IOrder } from '@/interfaces/Order';
import OrderFilter from './OrderFilter';

interface FilterState {
    type: string;
    selectedPeriod: string;
    searchTerm: string;
}

const RightSideOrder = () => {
    const {
        notification,
        closeNotification,
        showError,
        showSuccess,
    } = useProductLogic();
    
    const [dataOrders, setDataOrders] = useState<Array<IOrder>>([]);
    const [filteredOrders, setFilteredOrders] = useState<Array<IOrder>>([]);
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<FilterState>({
        type: 'todo',
        selectedPeriod: '',
        searchTerm: ''
    });

    const [menuAnchor, setMenuAnchor] = useState<{
        anchor: HTMLElement | null;
        itemId: string | null;
    }>({ anchor: null, itemId: null });

    const { isLoading } = useCart();
    const { getToken } = useAuth();
    const { user } = useUser();

    // Función para obtener las órdenes
    const getOrders = async () => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error('No se pudo obtener el token de autenticación');
            }

            const data = await OrderService.getUserOrders(token);
            console.log("data",data)
            setDataOrders(data.data);
        } catch (error) {
            showError('Error al cargar las órdenes');
        }
    };

    // Función para aplicar filtros - CORREGIDA
    const applyFilters = useMemo(() => {
        let filtered = [...dataOrders];

        // Filtro por tipo/estado - CORREGIDO
        if (filter.type !== 'todo') {
            filtered = filtered.filter(order => {
                switch (filter.type) {
                    case 'processing':
                        // A enviar: órdenes en processing o con pago pendiente
                        return order.status === 'processing' || order.paymentStatus === 'pending';
                    case 'shipped':
                        return order.deliveryStatus === 'shipped';
                    case 'delivered':
                        return order.deliveryStatus === 'delivered';
                    case 'cancelled':
                        return order.status === 'cancelled';
                    default:
                        return true;
                }
            });
        }

        // Filtro por período
        if (filter.selectedPeriod) {
            const now = new Date();
            const monthsBack = parseInt(filter.selectedPeriod);
            const dateLimit = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate());
            
            filtered = filtered.filter(order => new Date(order.createdAt) >= dateLimit);
        }

        // Filtro por búsqueda
        if (filter.searchTerm) {
            const searchLower = filter.searchTerm.toLowerCase();
            filtered = filtered.filter(order => 
                order.orderNumber.toLowerCase().includes(searchLower) ||
                order.items.some(item => item.name.toLowerCase().includes(searchLower))
            );
        }

        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [dataOrders, filter]);

    // Contadores para los botones de filtro - CORREGIDOS
    const filterCounts = useMemo(() => {
        return {
            todo: dataOrders.length,
            pending: dataOrders.filter(o => o.status === 'processing' || o.paymentStatus === 'pending').length,
            shipped: dataOrders.filter(o => o.deliveryStatus === 'shipped').length,
            delivered: dataOrders.filter(o => o.deliveryStatus === 'delivered').length,
            cancelled: dataOrders.filter(o => o.status === 'cancelled').length,
        };
    }, [dataOrders]);

    useEffect(() => {
        getOrders();
    }, []);

    useEffect(() => {
        setFilteredOrders(applyFilters);
    }, [applyFilters]);

    // Handlers para el filtro
    const handleFilterTypeChange = (newType: string) => {
        setFilter(prev => ({ ...prev, type: newType }));
    };

    const handlePeriodChange = (event: any) => {
        setFilter(prev => ({ ...prev, selectedPeriod: event.target.value }));
    };

    const handleSearchChange = (searchTerm: string) => {
        setFilter(prev => ({ ...prev, searchTerm }));
    };

    const handleClearFilters = () => {
        setFilter({
            type: 'todo',
            selectedPeriod: '',
            searchTerm: ''
        });
    };

    // Función para expandir/contraer órdenes
    const toggleOrderExpansion = (orderId: string) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    // Función para obtener el estado visual - CORREGIDA
    const getStatusChip = (order: IOrder) => {
        let label = '';
        let color: string = '#7950f2';

        if (order.status === 'cancelled') {
            label = 'Cancelado';
            color = '#d32f2f';
        } else if (order.deliveryStatus === 'delivered') {
            label = 'Finalizado';
            color = '#2e7d32';
        } else if (order.deliveryStatus === 'shipped') {
            label = 'Enviado';
            color = '#0288d1';
        } else if (order.status === 'processing') {
            label = 'A enviar';
            color = '#ed6c02';
        } else if (order.status === 'pending' || order.paymentStatus === 'pending') {
            label = 'A pagar';
            color = '#7950f2';
        } else if (order.status === 'completed') {
            label = 'Procesado';
            color = '#9c27b0';
        } else {
            label = 'Pendiente';
            color = '#757575';
        }

        return <Chip label={label} sx={{backgroundColor:color, color:'white'}}  size="small" />;
    };

    // Función para formatear fecha
    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress sx={{ color: '#7950f2' }} />
            </Grid>
        );
    }

    return (
        <Box>
            {/* Componente de filtros */}
            <OrderFilter
                filter={filter}
                onFilterTypeChange={handleFilterTypeChange}
                onPeriodChange={handlePeriodChange}
                onSearchChange={handleSearchChange}
                onClearFilters={handleClearFilters}
                counts={filterCounts}
            />

            <Grid container sx={{ mx: { xs:2, sm:2, md:4}, marginBottom: 4, mt: 2, paddingY: 1 }} spacing={2}>
                {
                    filteredOrders.length === 0?(
                        <EmptyOrderComponent/>
                    ):(
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            {
                                filteredOrders.map((order) => (
                                    <Card 
                                        key={order._id} 
                                        sx={{ 
                                            marginBottom: 2, 
                                            borderRadius: 2,
                                            border: '1px solid #f0f0f0',
                                            '&:hover': {
                                                boxShadow: '0 4px 12px rgba(121, 80, 242, 0.1)',
                                                borderColor: '#7950f2'
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            {/* Header de la orden */}
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'flex-start',
                                                mb: 2 
                                            }}>
                                                <Box>
                                                    {getStatusChip(order)}
                                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Typography 
                                                            variant="h6" 
                                                            sx={{ 
                                                                fontWeight: 'bold',
                                                                color: '#333',
                                                                fontSize: '1rem'
                                                            }}
                                                        >
                                                            Pedido efectuado el: {formatDate(order.createdAt)}
                                                        </Typography>
                                                    </Box>
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: 'text.secondary',
                                                            fontSize: '0.875rem',
                                                            mt: 0.5
                                                        }}
                                                    >
                                                        N° de pedido: {order.orderNumber}
                                                        <Button
                                                            size="small"
                                                            sx={{ 
                                                                ml: 1, 
                                                                minWidth: 'auto',
                                                                color: '#7950f2',
                                                                textTransform: 'none',
                                                                fontSize: '0.875rem'
                                                            }}
                                                        >
                                                            Copiar
                                                        </Button>
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Link href={`/compras/${order._id}`}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{
                                                                color: '#7950f2',
                                                                borderColor: '#7950f2',
                                                                textTransform: 'none',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(121, 80, 242, 0.04)',
                                                                    borderColor: '#7950f2'
                                                                }
                                                            }}
                                                        >
                                                            Detalles del pedido
                                                        </Button>
                                                    </Link>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            {/* Items de la orden */}
                                            <Box>
                                                {order.items
                                                    .slice(0, expandedOrders.has(order._id) ? order.items.length : 2)
                                                    .map((item, index) => (
                                                        <Grid
                                                            container
                                                            key={`${item.productId}-${index}`}
                                                            sx={{ 
                                                                marginY: 1,
                                                                padding: 1,
                                                                borderRadius: 1,
                                                                '&:hover': {
                                                                    backgroundColor: '#f8f9fa'
                                                                }
                                                            }}
                                                        >
                                                            <Grid size={{ xs: 3, sm: 2, md: 2 }}>
                                                                <Box sx={{ 
                                                                    display: 'flex', 
                                                                    justifyContent: 'center', 
                                                                    alignItems: 'center',
                                                                    height: '100%'
                                                                }}>
                                                                    <Image
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        width={80}
                                                                        height={80}
                                                                        style={{ 
                                                                            objectFit: 'contain', 
                                                                            borderRadius: 8,
                                                                            border: '1px solid #f0f0f0'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                            
                                                            <Grid size={{ xs: 9, sm: 10, md: 10 }}>
                                                                <Box sx={{ 
                                                                    display: 'flex', 
                                                                    flexDirection: 'column',
                                                                    height: '100%',
                                                                    justifyContent: 'center',
                                                                    pl: 2
                                                                }}>
                                                                    <Link href={`/producto/${item.productId}`}>
                                                                        <Typography 
                                                                            variant="subtitle1" 
                                                                            sx={{ 
                                                                                color: '#333',
                                                                                fontWeight: '500',
                                                                                mb: 0.5,
                                                                                '&:hover': {
                                                                                    color: '#7950f2'
                                                                                }
                                                                            }}
                                                                        >
                                                                            {item.name}
                                                                        </Typography>
                                                                    </Link>
                                                                    
                                                                    <Box sx={{ 
                                                                        display: 'flex', 
                                                                        gap: 2, 
                                                                        flexWrap: 'wrap',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        <Typography 
                                                                            variant="body2" 
                                                                            sx={{ color: 'text.secondary' }}
                                                                        >
                                                                            Cantidad: {item.quantity}
                                                                        </Typography>
                                                                        <Typography 
                                                                            variant="body2" 
                                                                            sx={{ color: 'text.secondary' }}
                                                                        >
                                                                            Talla: {item.size} US
                                                                        </Typography>
                                                                        <Typography 
                                                                            variant="body1" 
                                                                            sx={{ 
                                                                                fontWeight: 'bold',
                                                                                color: '#7950f2'
                                                                            }}
                                                                        >
                                                                            S/ {item.price.toFixed(2)}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    ))}

                                                {order.items.length > 2 && (
                                                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                                                        <Button
                                                            onClick={() => toggleOrderExpansion(order._id)}
                                                            sx={{
                                                                color: '#7950f2',
                                                                textTransform: 'none',
                                                                fontSize: '0.875rem'
                                                            }}
                                                        >
                                                            {expandedOrders.has(order._id) 
                                                                ? `Ver menos` 
                                                                : `Ver ${order.items.length - 2} productos más`
                                                            }
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Footer con total */}
                                            <Divider sx={{ my: 2 }} />
                                            
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                pt: 1
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Package size={16} color="#666" />
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                                                    </Typography>
                                                </Box>
                                                
                                                <Typography 
                                                    variant="h6" 
                                                    sx={{ 
                                                        fontWeight: 'bold',
                                                        color: '#333'
                                                    }}
                                                >
                                                    Total: S/ {order.totalAmount.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))
                            }
                        </Grid>
                    )
                }
                
            </Grid>

            {/* Notificaciones */}
            <ErrorNotification
                open={notification.open}
                onClose={closeNotification}
                message={notification.message}
                type={notification.type}
                autoHideDuration={3000}
            />
        </Box>
    )
}

export default RightSideOrder