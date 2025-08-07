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
    List,
    ListItem,
    ListItemText,
    Alert
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin,  Package, Calendar, Phone, Store, Copy, Star, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import OrderService from '@/services/OrderService';
import { IOrder } from '@/interfaces/Order';
import { IAddress } from '@/interfaces/Address';
import { IPickUp } from '@/interfaces/PickUp';
import ErrorNotification from '@/components/ErrorNotification';
import { useProductLogic } from '@/hooks/useProductLogic';
import { SplashScreen } from '@/components/splash-screen';
import { useCart } from '@/page-sections/cart/CartContext';
import { useUser } from '@clerk/nextjs';
import RefundRequestModal from '@/components/modal/RefundRequestModal';

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
    const {
        addresses,
        pickUps,
    } = useCart();

    const [order, setOrder] = useState<IOrder | null>(null);
    const [address, setAddress] = useState<IAddress | null>(null);
    const [pickupLocation, setPickupLocation] = useState<IPickUp | null>(null);
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Estados para el modal de reembolso
    const [refundModal, setRefundModal] = useState({
        open: false,
        itemId: '',
        itemName: '',
        loading: false
    });
    const [refundReason, setRefundReason] = useState('');
    const [refundType, setRefundType] = useState('defective');

    // Función para obtener los detalles de la orden (solo una vez)
    const getOrderDetails = useCallback(async () => {
        if (dataLoaded || !id) return;
        console.log("addresses", addresses)
        try {
            setLoading(true);
            const token = await getToken();
            if (!token) {
                throw new Error('No se pudo obtener el token de autenticación');
            }

            const response = await OrderService.getOrderDetails(token, id as string);
            const orderData = response.data;
            setOrder(orderData);

            // Buscar la dirección o pickup correspondiente
            if (orderData.orderType === 'pickup') {
                const pickup = pickUps.find(pickup => pickup._id === orderData.addressId);
                setPickupLocation(pickup || null);
            } else {
                const addr = addresses.find(address => address._id === orderData.addressId);
                setAddress(addr || null);
            }

            setDataLoaded(true);
        } catch (error) {
            console.error('Error getting order details:', error);
            showError('Error al cargar los detalles de la orden');
        } finally {
            setLoading(false);
        }
    }, [id, getToken, pickUps, addresses, dataLoaded, showError]);

    // Función para abrir el modal de reembolso
    const openRefundModal = (itemId: string, itemName: string) => {
        setRefundModal({
            open: true,
            itemId,
            itemName,
            loading: false
        });
    };

    // Función para cerrar el modal de reembolso
    const closeRefundModal = () => {
        setRefundModal({
            open: false,
            itemId: '',
            itemName: '',
            loading: false
        });
        setRefundReason('');
        setRefundType('defective');
    };

    // Función para confirmar el reembolso
    const handleRefundConfirm = async () => {
        if (!order || !refundReason.trim()) return;

        setRefundModal(prev => ({ ...prev, loading: true }));

        try {
            const token = await getToken();
            if (!token) {
                throw new Error('No se pudo obtener el token de autenticación');
            }

            const fullReason = `${refundType}: ${refundReason}`;

            console.log("refundModal.orderId",  
                order._id,"refundModal.itemId ",
                refundModal.itemId)

            await OrderService.requestItemRefund(
                token,
                order._id,
                refundModal.itemId,
                fullReason
            );

            showSuccess('Solicitud de reembolso enviada correctamente');
            closeRefundModal();

            // Recargar los detalles de la orden
            setDataLoaded(false);
            getOrderDetails();

        } catch (error: any) {
            console.error('Error requesting refund:', error);
            showError(error.message || 'Error al solicitar el reembolso');
        } finally {
            setRefundModal(prev => ({ ...prev, loading: false }));
        }
    };

    // Función para determinar si un item puede solicitar reembolso
    const canRequestRefund = (itemStatus: string) => {
        return ['delivered', 'shipped'].includes(itemStatus);
    };

    // Función para obtener el estado del item
    const getItemStatusLabel = (status: string) => {
        const statusMap: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
            'pending': { label: 'Pendiente', color: 'default' },
            'shipped': { label: 'Enviado', color: 'info' },
            'delivered': { label: 'Entregado', color: 'success' },
            'cancelled': { label: 'Cancelado', color: 'error' },
            'return_requested': { label: 'Reembolso solicitado', color: 'warning' },
            'returned': { label: 'Devuelto', color: 'warning' },
            'refunded': { label: 'Reembolsado', color: 'info' }
        };

        return statusMap[status] || { label: status, color: 'default' };
    };

    // Componente de dirección optimizado
    const AddressComponent = React.memo(() => {
        if (!order) return null;

        if (order.orderType === 'pickup') {
            return (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: '600', mb: 0.5 }}>
                        {pickupLocation?.city} - {pickupLocation?.stand}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: '400', mb: 1 }}>
                        {pickupLocation?.cc} - {pickupLocation?.contactNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: '400', mb: 1 }}>
                        {pickupLocation?.address}
                    </Typography>
                </Box>
            );
        } else {
            return (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: '600', mb: 0.5 }}>
                        {address?.name} - {address?.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {address?.street}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {address?.state}, {address?.city}, {address?.country}, {address?.zipCode}
                    </Typography>
                </Box>
            );
        }
    });
    // ✅ AGREGAR ESTA LÍNEA DESPUÉS DEL COMPONENTE
    AddressComponent.displayName = 'AddressComponent';

    // Efecto principal - solo se ejecuta una vez cuando cambia el ID
    useEffect(() => {
        if (id && !dataLoaded) {
            getOrderDetails();
        }
    }, [id, dataLoaded, getOrderDetails]);

    // Reset cuando cambia el ID
    useEffect(() => {
        setDataLoaded(false);
        setOrder(null);
        setAddress(null);
        setPickupLocation(null);
    }, [id]);

    // Función para copiar número de orden
    const copyOrderNumber = useCallback(() => {
        if (order?.orderNumber) {
            navigator.clipboard.writeText(order.orderNumber);
            showSuccess('Número de orden copiado');
        }
    }, [order?.orderNumber, showSuccess]);

    // Función para obtener el estado visual (mejorada según el modelo)
    const getStatusChip = useCallback((order: IOrder) => {
        let label = '';
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';

        // Prioridad: cancelled > payment_failed > completed + delivered > processing + shipped > pending
        if (order.status === 'cancelled') {
            label = 'Cancelado';
            color = 'error';
        } else if (order.status === 'payment_failed') {
            label = 'Pago Fallido';
            color = 'error';
        } else if (order.status === 'completed' && order.deliveryStatus === 'delivered') {
            label = 'Finalizado';
            color = 'success';
        } else if (order.status === 'completed') {
            label = 'Completado';
            color = 'success';
        } else if (order.deliveryStatus === 'delivered') {
            label = 'Entregado';
            color = 'success';
        } else if (order.deliveryStatus === 'returned') {
            label = 'Devuelto';
            color = 'warning';
        } else if (order.deliveryStatus === 'shipped') {
            label = 'Enviado';
            color = 'info';
        } else if (order.status === 'processing') {
            label = 'Procesando';
            color = 'warning';
        } else if (order.paymentStatus === 'rejected') {
            label = 'Pago Rechazado';
            color = 'error';
        } else if (order.paymentStatus === 'refunded') {
            label = 'Reembolsado';
            color = 'info';
        } else if (order.paymentStatus === 'pending' || order.status === 'pending') {
            label = 'Pendiente de Pago';
            color = 'primary';
        } else if (order.paymentStatus === 'approved') {
            label = 'Pago Aprobado';
            color = 'secondary';
        } else {
            label = 'En Proceso';
            color = 'default';
        }

        return <Chip label={label} color={color} size="small" />;
    }, []);

    // Función para formatear fecha
    const formatDate = useCallback((date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }, []);

    // Función para obtener el método de pago legible (ampliada)
    const getPaymentMethodLabel = useCallback((method: string) => {
        switch (method) {
            case 'credit_card':
                return 'Tarjeta de Crédito';
            case 'debit_card':
                return 'Tarjeta de Débito';
            case 'cash':
                return 'Efectivo';
            case 'bank_transfer':
                return 'Transferencia Bancaria';
            case 'digital_wallet':
                return 'Billetera Digital';
            default:
                return method || 'No especificado';
        }
    }, []);

    // Opciones de motivos de reembolso
    const refundReasons = [
        { value: 'defective', label: 'Producto defectuoso' },
        { value: 'wrong_size', label: 'Talla incorrecta' },
        { value: 'not_as_described', label: 'No es como se describe' },
        { value: 'damaged_shipping', label: 'Dañado en el envío' },
        { value: 'changed_mind', label: 'Cambié de opinión' },
        { value: 'other', label: 'Otro motivo' }
    ];

    if (!id) return <SplashScreen />;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!order) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6">No se pudo cargar la información de la orden</Typography>
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
                {/* Información del Cliente y tienda */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <MapPin size={20} color="#7950f2" />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Información {order.orderType === 'pickup' ? 'de la Tienda' : 'del Cliente'}
                                </Typography>
                            </Box>
                            <AddressComponent />
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
                                                    {order.createdAt ? formatDate(new Date(order.createdAt)) : ''}
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
                                                    Estado del pedido:
                                                </Typography>
                                                {getStatusChip(order)}
                                            </Box>
                                        }
                                    />
                                </ListItem>


                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Estado del pago:
                                                </Typography>
                                                <Chip
                                                    label={order.paymentStatus === 'approved' ? 'Aprobado' :
                                                        order.paymentStatus === 'rejected' ? 'Rechazado' :
                                                            order.paymentStatus === 'pending' ? 'Pendiente' :
                                                                order.paymentStatus === 'refunded' ? 'Rembolso' : 'Pendiente'}
                                                    size="small"
                                                    color={
                                                        order.paymentStatus === 'approved' ? 'success' :
                                                            order.paymentStatus === 'rejected' ? 'error' :
                                                                order.paymentStatus === 'pending' ? 'warning' : 'default'
                                                    }
                                                />
                                            </Box>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Estado de entrega:
                                                </Typography>
                                                <Chip
                                                    label={order.deliveryStatus === 'delivered' ? 'Entregado' :
                                                        order.deliveryStatus === 'shipped' ? 'Enviado' :
                                                            order.deliveryStatus === 'returned' ? 'Devuelto' : 'Pendiente'}
                                                    size="small"
                                                    color={
                                                        order.deliveryStatus === 'delivered' ? 'success' :
                                                            order.deliveryStatus === 'shipped' ? 'info' :
                                                                order.deliveryStatus === 'returned' ? 'warning' : 'default'
                                                    }
                                                />
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
                                                    {getPaymentMethodLabel(order.paymentMethod ?? '')}
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
                                                    {order.deliveryStatus === 'delivered' ? formatDate(new Date(order.updatedAt)) : 'En proceso'}
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
                                                    {order.status === 'completed' ? formatDate(new Date(order.updatedAt)) : 'En proceso'}
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


                    {/* Información de Entrega */}
                    <Card sx={{ mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Store size={20} color="#7950f2" />
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    ✓Tricks SAC
                                </Typography>
                            </Box>

                            {order.orderType === 'pickup' ? (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Acercate a la tienda a recoger tu pedido
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Envío a domicilio - {order.deliveryStatus === 'delivered' ? 'Entregado' : 'En proceso'}
                                </Typography>
                            )}

                            {/* Productos */}
                            {order.items.map((item, index) => {
                                const itemStatusInfo = getItemStatusLabel(item.itemStatus!);
                                return (
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
                                                    <Link href='#'>
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
                                                        Talla: {item.size}
                                                    </Typography>

                                                    {/* Estado del item */}
                                                    <Box sx={{ mb: 1 }}>
                                                        <Chip
                                                            label={itemStatusInfo.label}
                                                            size="small"
                                                            color={itemStatusInfo.color}
                                                        />
                                                    </Box>

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
                                        <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                            {/* Botón de Evaluar Producto */}
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Star size={16} />}
                                                sx={{
                                                    borderColor: '#ffd700',
                                                    color: '#ffa000',
                                                    textTransform: 'none',
                                                    fontSize: '0.75rem',
                                                    '&:hover': {
                                                        borderColor: '#ffc107',
                                                        backgroundColor: 'rgba(255, 193, 7, 0.04)'
                                                    }
                                                }}
                                                onClick={() => {
                                                    showSuccess('Función de evaluación próximamente');
                                                }}
                                            >
                                                Evaluar
                                            </Button>

                                            {/* Botón de Solicitar Reembolso */}
                                              {canRequestRefund(item.itemStatus!) && ( 
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<RefreshCw size={16} />}
                                                sx={{
                                                    borderColor: '#ff6b6b',
                                                    color: '#ff6b6b',
                                                    textTransform: 'none',
                                                    fontSize: '0.75rem',
                                                    '&:hover': {
                                                        borderColor: '#ff5252',
                                                        backgroundColor: 'rgba(255, 107, 107, 0.04)'
                                                    }
                                                }}
                                                onClick={() => openRefundModal(item._id, item.name)}
                                            >
                                                Solicitar Reembolso
                                            </Button>
                                            )}    

                                            {/* Mensaje para items que no pueden solicitar reembolso */}
                                            {!canRequestRefund(item.itemStatus!) && item.itemStatus === 'return_requested' && (
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    backgroundColor: '#fff3cd',
                                                    border: '1px solid #ffeaa7',
                                                    borderRadius: 1,
                                                    px: 2,
                                                    py: 0.5
                                                }}>
                                                    <RefreshCw size={14} color="#856404" />
                                                    <Typography variant="caption" sx={{ color: '#856404', fontWeight: '500' }}>
                                                        Reembolso en proceso
                                                    </Typography>
                                                </Box>
                                            )}

                                            {!canRequestRefund(item.itemStatus) &&
                                                !['return_requested', 'returned', 'refunded'].includes(item.itemStatus) && (
                                                    <Typography variant="caption" sx={{
                                                        color: '#666',
                                                        alignSelf: 'center',
                                                        fontStyle: 'italic'
                                                    }}>
                                                        Reembolso no disponible
                                                    </Typography>
                                                )}
                                        </Box>

                                        {index < order.items.length - 1 && <Divider sx={{ mt: 2 }} />}
                                    </Box>
                                )
                            })}
                        </CardContent>
                    </Card>

                    {/* Resumen de Costos */}
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Resumen del pedido
                            </Typography>
                            {/*  
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Envío
                                </Typography>
                                <Typography variant="body1">
                                    PEN7.66
                                </Typography>
                            </Box>
                            */}

                            {/* Mostrar descuento si existe */}
                            {order.discountAmount && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="success.main">
                                        Descuento {order.couponCode && `(${order.couponCode})`}
                                    </Typography>
                                    <Typography variant="body1" color="success.main">
                                        -PEN{order.discountAmount.toFixed(2)}
                                    </Typography>
                                </Box>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Total
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    PEN {(order.totalAmount).toFixed(2)}
                                </Typography>
                            </Box>

                            {/* Información adicional sobre reembolsos */}
                            {order.items.some(item => item.itemStatus === 'return_requested') && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Solicitudes de reembolso pendientes:</strong> Recibirás una notificación por email
                                        cuando se procesen tus solicitudes de reembolso.
                                    </Typography>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Modal de Reembolso */}
            <RefundRequestModal
                open={refundModal.open}
                onClose={closeRefundModal}
                onSubmit={handleRefundConfirm}
                itemName={refundModal.itemName}
                loading={refundModal.loading}
                refundReason={refundReason}
                setRefundReason={setRefundReason}
                refundType={refundType}
                setRefundType={setRefundType}
            />

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