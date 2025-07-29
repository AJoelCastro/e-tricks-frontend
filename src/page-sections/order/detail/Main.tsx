'use client';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Avatar
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, CreditCard, Package, Calendar, Phone, Store, Copy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import OrderService from '@/services/OrderService';
import { IOrder } from '@/interfaces/Order';
import { IAddress } from '@/interfaces/Address';
import { IPickUp } from '@/interfaces/PickUp';
import ErrorNotification from '@/components/ErrorNotification';
import { useProductLogic } from '@/hooks/useProductLogic';

type Props = {
    id: string;
};

const OrderDetailPage: React.FC<Props> = ({ id }) => {
    const router = useRouter();

    const { getToken } = useAuth();
    const {
        notification,
        closeNotification,
        showError,
        showSuccess,
    } = useProductLogic();

    const [order, setOrder] = useState<IOrder | null>(null);
    const [address, setAddress] = useState<IAddress | null>(null);
    const [pickupLocation, setPickupLocation] = useState<IPickUp | null>(null);
    const [loading, setLoading] = useState(true);

    // Función para obtener los detalles de la orden
    const getOrderDetails = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            if (!token) {
                throw new Error('No se pudo obtener el token de autenticación');
            }

            const response = await OrderService.getOrderDetails(token, id as string);
            setOrder(response.data);
            
            // Aquí podrías hacer llamadas adicionales para obtener la dirección y pickup si es necesario
            // setAddress(response.address);
            // setPickupLocation(response.pickup);
        } catch (error) {
            console.error('Error getting order details:', error);
            showError('Error al cargar los detalles de la orden');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getOrderDetails();
        }
    }, [id]);

    // Función para copiar número de orden
    const copyOrderNumber = () => {
        if (order?.orderNumber) {
            navigator.clipboard.writeText(order.orderNumber);
            showSuccess('Número de orden copiado');
        }
    };

    // Función para obtener el estado visual
    const getStatusChip = (order: IOrder) => {
        let label = '';
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';

        if (order.status === 'cancelled') {
            label = 'Cancelado';
            color = 'error';
        } else if (order.deliveryStatus === 'delivered') {
            label = 'Finalizado';
            color = 'success';
        } else if (order.deliveryStatus === 'shipped') {
            label = 'Enviado';
            color = 'info';
        } else if (order.status === 'processing') {
            label = 'A enviar';
            color = 'warning';
        } else if (order.status === 'pending' || order.paymentStatus === 'pending') {
            label = 'A pagar';
            color = 'primary';
        } else {
            label = 'Procesado';
            color = 'secondary';
        }

        return <Chip label={label} color={color} size="medium" />;
    };

    // Función para formatear fecha
    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Función para obtener el método de pago legible
    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'credit_card':
                return 'Tarjeta de crédito/débito';
            case 'debit_card':
                return 'Tarjeta de débito';
            case 'cash':
                return 'Efectivo';
            default:
                return method;
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress sx={{ color: '#7950f2' }} />
            </Box>
        );
    }

    if (!order) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6">Orden no encontrada</Typography>
                <Button onClick={() => router.back()} sx={{ mt: 2, color: '#7950f2' }}>
                    Volver
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
            {/* Header con botón de volver */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                    onClick={() => router.back()}
                    sx={{ 
                        color: '#7950f2',
                        '&:hover': { backgroundColor: 'rgba(121, 80, 242, 0.04)' }
                    }}
                >
                    <ArrowLeft size={24} />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Detalles del pedido
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Información del Cliente y Orden */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <MapPin size={20} color="#7950f2" />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Información del Cliente
                                </Typography>
                            </Box>
                            
                            {/* Aquí mostrarías la información del cliente si la tienes */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: '600', mb: 0.5 }}>
                                    Marck Alessandro +51 904388543
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Jose Crespo #867
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    EL PORVENIR, TRUJILLO, Peru, 13003
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Información de la Orden */}
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Package size={20} color="#7950f2" />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Información del Pedido
                                </Typography>
                            </Box>

                            <List sx={{ p: 0 }}>
                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemText 
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    N° de pedido:
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: '600' }}>
                                                    {order.orderNumber}
                                                </Typography>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={copyOrderNumber}
                                                    sx={{ color: '#7950f2' }}
                                                >
                                                    <Copy size={16} />
                                                </IconButton>
                                                <Button
                                                    size="small"
                                                    onClick={copyOrderNumber}
                                                    sx={{ 
                                                        color: '#7950f2',
                                                        textTransform: 'none',
                                                        fontSize: '0.75rem',
                                                        minWidth: 'auto',
                                                        p: 0.5
                                                    }}
                                                >
                                                    Copiar
                                                </Button>
                                            </Box>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemText 
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Pedido efectuado el:
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: '600' }}>
                                                    {formatDate(order.createdAt)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemText 
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Pago completado en:
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: '600' }}>
                                                    {order.paymentStatus === 'approved' ? formatDate(order.updatedAt) : 'Pendiente'}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemText 
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Envío completado en:
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: '600' }}>
                                                    {order.deliveryStatus === 'delivered' ? formatDate(order.updatedAt) : 'En proceso'}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemText 
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Pedido completado en:
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: '600' }}>
                                                    {order.status === 'completed' ? formatDate(order.updatedAt) : 'En proceso'}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemText 
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Método de pago:
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: '600' }}>
                                                    {getPaymentMethodLabel(order.paymentMethod)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Productos y Resumen */}
                <Grid size={{ xs: 12, md: 6 }}>
                    {/* Estado de la Orden */}
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        {getStatusChip(order)}
                    </Box>

                    {/* Información de Entrega */}
                    <Card sx={{ mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Store size={20} color="#7950f2" />
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    ✓Choice | Shop1104058560 Store
                                </Typography>
                            </Box>
                            
                            {order.orderType === 'pickup' ? (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Fecha de entrega estimada: 22 may, 2025
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Envío a domicilio - {order.deliveryStatus === 'delivered' ? 'Entregado' : 'En proceso'}
                                </Typography>
                            )}

                            {/* Productos */}
                            {order.items.map((item, index) => (
                                <Box key={`${item.productId}-${index}`} sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 3, sm: 2 }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'center',
                                                position: 'relative'
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
                                                {/* Indicador de protección */}
                                                <Box sx={{ 
                                                    position: 'absolute',
                                                    bottom: -8,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    backgroundColor: '#333',
                                                    borderRadius: '50%',
                                                    width: 24,
                                                    height: 24,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Typography sx={{ color: 'white', fontSize: '10px' }}>✓</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        
                                        <Grid size={{ xs: 9, sm: 10 }}>
                                            <Box>
                                                <Link href={`/producto/${item.productId}`}>
                                                    <Typography 
                                                        variant="body1" 
                                                        sx={{ 
                                                            fontWeight: '500',
                                                            mb: 0.5,
                                                            '&:hover': { color: '#7950f2' }
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                </Link>
                                                
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                    {item.size}
                                                </Typography>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                        PEN {item.price.toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        x{item.quantity}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    {/* Botones de acción */}
                                    <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                borderColor: '#e0e0e0',
                                                color: '#666',
                                                textTransform: 'none',
                                                '&:hover': { borderColor: '#7950f2', color: '#7950f2' }
                                            }}
                                        >
                                            Añadir a la cesta
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                borderColor: '#e0e0e0',
                                                color: '#666',
                                                textTransform: 'none',
                                                '&:hover': { borderColor: '#7950f2', color: '#7950f2' }
                                            }}
                                        >
                                            Devolución/reembolso
                                        </Button>
                                    </Box>

                                    {index < order.items.length - 1 && <Divider sx={{ mt: 2 }} />}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Resumen de Costos */}
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Resumen del pedido
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Subtotal
                                </Typography>
                                <Typography variant="body1">
                                    PEN{order.totalAmount.toFixed(2)}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Envío
                                </Typography>
                                <Typography variant="body1">
                                    PEN7.66
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Cupón AliExpress
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'red' }}>
                                    -PEN1.16
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Total
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    PEN {(order.totalAmount + 7.66 - 1.16).toFixed(2)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
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
    );
};

export default OrderDetailPage;