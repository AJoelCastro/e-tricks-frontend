'use client';
import NavbarComponent from '@/components/principal/NavbarComponent'
import OrderService from '@/services/OrderService';
import { useAuth } from '@clerk/nextjs';
import { 
    Box, 
    Container, 
    Typography, 
    Card, 
    CardContent, 
    CardMedia,
    Grid,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    Stack,
    Button,
    Collapse,
    IconButton,
    ButtonGroup
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IOrder } from '@/interfaces/Order'; // Ajusta la ruta según tu estructura
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import LeftSideAdmin from '@/components/admin/LeftSideAdmin';

const MainOrdersPageSection = () => {
    const { getToken } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

    const getOrdenes = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const data = await OrderService.getAllOrders(token as string);
            setOrders(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Error al cargar las órdenes. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getOrdenes()
    }, [])

    const toggleOrderExpansion = (orderId: string) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'processing':
                return 'warning';
            case 'completed':
            case 'delivered':
                return 'success';
            case 'cancelled':
                return 'error';
            case 'pending':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'processing':
                return 'Procesando';
            case 'completed':
                return 'Completado';
            case 'delivered':
                return 'Entregado';
            case 'cancelled':
                return 'Cancelado';
            case 'pending':
                return 'Pendiente';
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return `S/ ${amount.toFixed(2)}`;
    };

    const handleViewDetails = (orderId: string) => {
        router.push(`/admin/ordenes/detalle/${orderId}`);
    };

    const handleEditOrder = (orderId: string) => {
        router.push(`/admin/ordenes/editar/${orderId}`);
    };

    if (loading) {
        return (
            <>
                <NavbarComponent />
                <Box sx={{ height: '64px' }} />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <CircularProgress size={60} />
                    </Box>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <NavbarComponent />
                <Box sx={{ height: '64px' }} />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Button variant="contained" onClick={getOrdenes}>
                        Reintentar
                    </Button>
                </Container>
            </>
        );
    }

    return (
        <>
            <NavbarComponent />
            <Box sx={{ height: '64px' }} />
            <Grid container spacing={1} sx={{minHeight:'100vh'}}>
                <Grid size={{
                    xs:12, sm:5, md:3
                }}>
                    <LeftSideAdmin/>
                </Grid>
                <Grid size={{
                    xs:12, sm:7, md:9
                }}>
                    <Box sx={{ padding:3}}>
                        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                            Sección de Órdenes
                        </Typography>

                        {orders.length === 0 ? (
                            <Card sx={{ textAlign: 'center', py: 8 }}>
                                <CardContent>
                                    <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No tienes órdenes aún
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Cuando realices tu primera compra, aparecerá aquí.
                                    </Typography>
                                </CardContent>
                            </Card>
                        ) : (
                            <Stack spacing={3}>
                                {orders.map((order) => (
                                    <Card key={order._id} elevation={2} sx={{ overflow: 'visible' }}>
                                        <CardContent>
                                            {/* Header de la orden */}
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold">
                                                        Orden #{order.orderNumber}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDate(order.createdAt)}
                                                    </Typography>
                                                </Box>
                                                <Box textAlign="right">
                                                    <Typography variant="h6" fontWeight="bold" color="primary">
                                                        {formatCurrency(order.totalAmount)}
                                                    </Typography>
                                                    <Chip 
                                                        label={getStatusText(order.status)} 
                                                        color={getStatusColor(order.status) as any}
                                                        size="small"
                                                    />
                                                </Box>
                                            </Box>

                                            {/* Información de pago y entrega */}
                                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <CreditCardIcon fontSize="small" color="action" />
                                                        <Typography variant="body2">
                                                            Pago: <strong>{order.paymentStatus === 'approved' ? 'Aprobado' : 'Pendiente'}</strong>
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <LocalShippingIcon fontSize="small" color="action" />
                                                        <Typography variant="body2">
                                                            Entrega: <strong>{order.deliveryStatus === 'pending' ? 'Pendiente' : order.deliveryStatus}</strong>
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>

                                            {/* Botones de acción */}
                                            <Box display="flex" alignItems="center" sx={{ mb: 2, gap:3 }}>
                                                <Button 
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => handleViewDetails(order._id)}
                                                    color="primary"
                                                >
                                                    Ver Detalle
                                                </Button>
                                                <Button 
                                                    startIcon={<EditIcon />}
                                                    onClick={() => handleEditOrder(order._id)}
                                                    color="primary"
                                                    disabled={order.status === 'completed' || order.status === 'cancelled'}
                                                >
                                                    Editar
                                                </Button>
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            {/* Resumen de productos */}
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2" color="text.secondary">
                                                    {order.items.length} producto{order.items.length > 1 ? 's' : ''} • {order.items.reduce((sum, item) => sum + item.quantity, 0)} unidad{order.items.reduce((sum, item) => sum + item.quantity, 0) > 1 ? 'es' : ''}
                                                </Typography>
                                                <IconButton 
                                                    onClick={() => toggleOrderExpansion(order._id)}
                                                    size="small"
                                                >
                                                    {expandedOrders.has(order._id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            </Box>

                                            {/* Detalles expandibles */}
                                            <Collapse in={expandedOrders.has(order._id)}>
                                                <Box sx={{ mt: 2 }}>
                                                    <Divider sx={{ mb: 2 }} />
                                                    <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                                                        Productos:
                                                    </Typography>
                                                    <Stack spacing={2}>
                                                        {order.items.map((item) => (
                                                            <Card key={item._id} variant="outlined">
                                                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                                    <Grid container spacing={2} alignItems="center">
                                                                        <Grid size={{ xs: 3, sm: 2 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <CardMedia
                                                                                component="img"
                                                                                height="80"
                                                                                image={item.image}
                                                                                alt={item.name}
                                                                                sx={{ borderRadius: 1, objectFit: 'cover' }}
                                                                            />
                                                                        </Grid>
                                                                        <Grid size={{ xs: 9, sm: 10 }}>
                                                                            <Typography variant="subtitle2" fontWeight="bold">
                                                                                {item.name}
                                                                            </Typography>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                Talla: {item.size} • Cantidad: {item.quantity}
                                                                            </Typography>
                                                                            <Typography variant="body2" fontWeight="bold">
                                                                                {formatCurrency(item.price)} c/u
                                                                            </Typography>
                                                                            <Chip 
                                                                                label={item.itemStatus === 'pending' ? 'Pendiente' : item.itemStatus}
                                                                                size="small"
                                                                                color={getStatusColor(item.itemStatus) as any}
                                                                                sx={{ mt: 1 }}
                                                                            />
                                                                        </Grid>
                                                                    </Grid>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </Stack>

                                                    {/* Detalles de pago si están disponibles */}
                                                    {order.paymentDetails && (
                                                        <Box sx={{ mt: 3 }}>
                                                            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                                                                Detalles de Pago:
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Método: {order.paymentDetails.payment_method_id?.toUpperCase()}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Procesado: {formatDate(order.paymentDetails.processed_at)}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Collapse>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default MainOrdersPageSection