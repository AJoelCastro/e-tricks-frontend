'use client';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    Alert,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Edit3, Package, CreditCard, Truck, AlertTriangle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import OrderService from '@/services/OrderService';
import { IOrder, IUpdateOrderData, IUpdateOrderItemData } from '@/interfaces/Order';
import ErrorNotification from '@/components/ErrorNotification';
import { useProductLogic } from '@/hooks/useProductLogic';

type Props = {
    id: string;
};

// Definición de estados disponibles
const ORDER_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente', color: 'default' as const },
    { value: 'processing', label: 'Procesando', color: 'warning' as const },
    { value: 'completed', label: 'Completado', color: 'success' as const },
    { value: 'cancelled', label: 'Cancelado', color: 'error' as const },
    { value: 'payment_failed', label: 'Pago Fallido', color: 'error' as const }
];

const PAYMENT_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente', color: 'default' as const },
    { value: 'approved', label: 'Aprobado', color: 'success' as const },
    { value: 'authorized', label: 'Autorizado', color: 'info' as const },
    { value: 'in_process', label: 'En Proceso', color: 'warning' as const },
    { value: 'in_mediation', label: 'En Mediación', color: 'warning' as const },
    { value: 'rejected', label: 'Rechazado', color: 'error' as const },
    { value: 'cancelled', label: 'Cancelado', color: 'error' as const },
    { value: 'refunded', label: 'Reembolsado', color: 'info' as const }
];

const DELIVERY_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente', color: 'default' as const },
    { value: 'shipped', label: 'Enviado', color: 'info' as const },
    { value: 'delivered', label: 'Entregado', color: 'success' as const },
    { value: 'returned', label: 'Devuelto', color: 'warning' as const }
];

const ITEM_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente', color: 'default' as const },
    { value: 'shipped', label: 'Enviado', color: 'info' as const },
    { value: 'delivered', label: 'Entregado', color: 'success' as const },
    { value: 'cancelled', label: 'Cancelado', color: 'error' as const },
    { value: 'return_requested', label: 'Devolución Solicitada', color: 'warning' as const },
    { value: 'returned', label: 'Devuelto', color: 'warning' as const },
    { value: 'refunded', label: 'Reembolsado', color: 'info' as const }
];

const OrderEditStatusPageSection: React.FC<Props> = ({ id }) => {
    const router = useRouter();
    const { getToken } = useAuth();
    const {
        notification,
        closeNotification,
        showError,
        showSuccess,
    } = useProductLogic();

    // Estados
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', data: null as any });

    // Estados del formulario
    const [formData, setFormData] = useState<IUpdateOrderData>({
        status: 'pending',
        paymentStatus: 'pending',
        deliveryStatus: 'pending',
        paymentMethod: ''
    });

    const [itemUpdates, setItemUpdates] = useState<Record<string, string>>({});
    const [bulkItemStatus, setBulkItemStatus] = useState('');

    // Cargar datos de la orden
    const getOrderDetails = useCallback(async () => {
        try {
            setLoading(true);
            const token = await getToken();
            if (!token) throw new Error('Token no disponible');

            const response = await OrderService.getOrderDetails(token, id);
            const orderData = response.data;
            
            setOrder(orderData);
            setFormData({
                status: orderData.status,
                paymentStatus: orderData.paymentStatus,
                deliveryStatus: orderData.deliveryStatus,
                paymentMethod: orderData.paymentMethod || ''
            });

            // Inicializar estados de items
            const initialItemUpdates: Record<string, string> = {};
            orderData.items.forEach((item : any) => {
                initialItemUpdates[item._id] = item.itemStatus || 'pending';
            });
            setItemUpdates(initialItemUpdates);

        } catch (error) {
            console.error('Error cargando orden:', error);
            showError('Error al cargar los datos de la orden');
        } finally {
            setLoading(false);
        }
    }, [id, getToken, showError]);

    useEffect(() => {
        if (id) getOrderDetails();
    }, [ ]);

    // Función para obtener la configuración visual de los chips
    const getStatusConfig = (status: string, options: any[]) => {
        return options.find(opt => opt.value === status) || { label: status, color: 'default' };
    };

    // Validar cambios antes de guardar
    const validateChanges = () => {
        if (!order) return false;

        // Reglas de negocio
        if (formData.status === 'completed' && formData.paymentStatus !== 'approved') {
            showError('No se puede completar una orden sin pago aprobado');
            return false;
        }

        if (formData.deliveryStatus === 'delivered' && formData.status === 'cancelled') {
            showError('No se puede entregar una orden cancelada');
            return false;
        }

        return true;
    };

    // Función para actualizar la orden
    const handleUpdateOrder = async () => {
        if (!order || !validateChanges()) return;

        setConfirmDialog({ 
            open: true, 
            action: 'updateOrder', 
            data: formData 
        });
    };

    // Función para actualizar estados de items
    const handleUpdateItems = async () => {
        if (!order) return;

        const changedItems = Object.entries(itemUpdates).filter(([itemId, newStatus]) => {
            const originalItem = order.items.find(item => item._id === itemId);
            return originalItem && originalItem.itemStatus !== newStatus;
        });

        if (changedItems.length === 0) {
            showError('No hay cambios en los items para actualizar');
            return;
        }

        setConfirmDialog({ 
            open: true, 
            action: 'updateItems', 
            data: changedItems 
        });
    };

    // Función para actualizar todos los items
    const handleBulkUpdateItems = () => {
        if (!bulkItemStatus || !order) return;

        const updates: Record<string, string> = {};
        order.items.forEach(item => {
            updates[item._id] = bulkItemStatus;
        });
        setItemUpdates(updates);
        setBulkItemStatus('');
        showSuccess('Estados de items actualizados. No olvides guardar los cambios.');
    };

    // Ejecutar la acción confirmada
    const executeAction = async () => {
        if (!order) return;

        setUpdating(true);
        try {
            const token = await getToken();
            if (!token) throw new Error('Token no disponible');

            if (confirmDialog.action === 'updateOrder') {
                // Aquí deberías llamar al servicio para actualizar la orden
                // await OrderService.updateOrderStatus(token, order._id, confirmDialog.data);
                console.log('Actualizando orden:', confirmDialog.data);
                showSuccess('Estado de la orden actualizado correctamente');
                
                // Actualizar estado local
                setOrder(prev => prev ? { ...prev, ...confirmDialog.data } : null);
                
            } else if (confirmDialog.action === 'updateItems') {
                // Actualizar items individuales
                for (const [itemId, newStatus] of confirmDialog.data) {
                    // await OrderService.updateOrderItemStatus(token, order._id, itemId, { itemStatus: newStatus });
                    console.log(`Actualizando item ${itemId} a estado: ${newStatus}`);
                }
                
                showSuccess(`${confirmDialog.data.length} items actualizados correctamente`);
                
                // Actualizar estado local de items
                setOrder(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        items: prev.items.map(item => ({
                            ...item,
                            itemStatus: itemUpdates[item._id] || item.itemStatus
                        }))
                    };
                });
            }

        } catch (error: any) {
            console.error('Error actualizando:', error);
            showError(error.message || 'Error al actualizar');
        } finally {
            setUpdating(false);
            setConfirmDialog({ open: false, action: '', data: null });
        }
    };

    // Formatear fecha
    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
                <Typography variant="h6">Orden no encontrada</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        onClick={() => router.back()}
                        sx={{ color: '#7950f2' }}
                    >
                        <ArrowLeft size={24} />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Editar Orden #{order.orderNumber}
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => router.push(`/orders/${id}`)}
                        sx={{ textTransform: 'none' }}
                    >
                        Ver Detalles
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Información General y Estados de la Orden */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Package size={20} color="#7950f2" />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Estados de la Orden
                                </Typography>
                            </Box>

                            <Stack spacing={3}>
                                {/* Estado General */}
                                <FormControl fullWidth>
                                    <InputLabel>Estado de la Orden</InputLabel>
                                    <Select
                                        value={formData.status}
                                        label="Estado de la Orden"
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                    >
                                        {ORDER_STATUS_OPTIONS.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={option.label}
                                                        color={option.color}
                                                        size="small"
                                                    />
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Estado de Pago */}
                                <FormControl fullWidth>
                                    <InputLabel>Estado del Pago</InputLabel>
                                    <Select
                                        value={formData.paymentStatus}
                                        label="Estado del Pago"
                                        onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value as any }))}
                                    >
                                        {PAYMENT_STATUS_OPTIONS.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CreditCard size={16} />
                                                    <Chip
                                                        label={option.label}
                                                        color={option.color}
                                                        size="small"
                                                    />
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Estado de Entrega */}
                                <FormControl fullWidth>
                                    <InputLabel>Estado de Entrega</InputLabel>
                                    <Select
                                        value={formData.deliveryStatus}
                                        label="Estado de Entrega"
                                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryStatus: e.target.value as any }))}
                                    >
                                        {DELIVERY_STATUS_OPTIONS.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Truck size={16} />
                                                    <Chip
                                                        label={option.label}
                                                        color={option.color}
                                                        size="small"
                                                    />
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Método de Pago */}
                                <TextField
                                    fullWidth
                                    label="Método de Pago"
                                    value={formData.paymentMethod}
                                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                    placeholder="visa, mastercard, efectivo, etc."
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateOrder}
                                    startIcon={<Save size={18} />}
                                    disabled={updating}
                                    sx={{ textTransform: 'none' }}
                                >
                                    {updating ? 'Guardando...' : 'Guardar Estados de Orden'}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Información de la Orden */}
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Información de la Orden
                            </Typography>
                            
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Creada:</Typography>
                                    <Typography variant="body2">{formatDate(order.createdAt)}</Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Última actualización:</Typography>
                                    <Typography variant="body2">{formatDate(order.updatedAt)}</Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Total:</Typography>
                                    <Typography variant="h6" color="primary">PEN {order.totalAmount.toFixed(2)}</Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Tipo:</Typography>
                                    <Chip
                                        label={order.orderType === 'pickup' ? 'Recojo en tienda' : 'Envío a domicilio'}
                                        size="small"
                                        color={order.orderType === 'pickup' ? 'info' : 'default'}
                                    />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Estados de Items */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justify: 'space-between', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Edit3 size={20} color="#7950f2" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Estados de Productos
                                    </Typography>
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary">
                                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                </Typography>
                            </Box>

                            {/* Actualización masiva */}
                            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                    Actualización Masiva
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel size="small">Cambiar todos a...</InputLabel>
                                        <Select
                                            size="small"
                                            value={bulkItemStatus}
                                            label="Cambiar todos a..."
                                            onChange={(e) => setBulkItemStatus(e.target.value)}
                                        >
                                            {ITEM_STATUS_OPTIONS.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    <Chip
                                                        label={option.label}
                                                        color={option.color}
                                                        size="small"
                                                    />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="outlined"
                                        onClick={handleBulkUpdateItems}
                                        disabled={!bulkItemStatus}
                                        size="small"
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Aplicar
                                    </Button>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            {/* Lista de items */}
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell align="center">Cantidad</TableCell>
                                            <TableCell align="center">Estado Actual</TableCell>
                                            <TableCell align="center">Nuevo Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order.items.map((item, index) => {
                                            const currentStatus = getStatusConfig(item.itemStatus || 'pending', ITEM_STATUS_OPTIONS);
                                            const newStatus = getStatusConfig(itemUpdates[item._id] || item.itemStatus || 'pending', ITEM_STATUS_OPTIONS);
                                            const hasChanged = (itemUpdates[item._id] || item.itemStatus) !== item.itemStatus;

                                            return (
                                                <TableRow key={item._id} sx={{ backgroundColor: hasChanged ? 'action.hover' : 'transparent' }}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                width={40}
                                                                height={40}
                                                                style={{
                                                                    objectFit: 'contain',
                                                                    borderRadius: 4,
                                                                    border: '1px solid #e0e0e0'
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: '500' }}>
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Talla: {item.size}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2">
                                                            x{item.quantity}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={currentStatus.label}
                                                            color={currentStatus.color}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <FormControl size="small" sx={{ minWidth: 140 }}>
                                                            <Select
                                                                value={itemUpdates[item._id] || item.itemStatus || 'pending'}
                                                                onChange={(e) => setItemUpdates(prev => ({
                                                                    ...prev,
                                                                    [item._id]: e.target.value
                                                                }))}
                                                                variant="outlined"
                                                            >
                                                                {ITEM_STATUS_OPTIONS.map(option => (
                                                                    <MenuItem key={option.value} value={option.value}>
                                                                        <Chip
                                                                            label={option.label}
                                                                            color={option.color}
                                                                            size="small"
                                                                        />
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        {hasChanged && (
                                                            <CheckCircle size={16} color="#4caf50" style={{ marginLeft: 8 }} />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleUpdateItems}
                                startIcon={<Save size={18} />}
                                disabled={updating}
                                sx={{ mt: 2, textTransform: 'none' }}
                                fullWidth
                            >
                                {updating ? 'Guardando...' : 'Guardar Estados de Productos'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Dialog de confirmación */}
            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: '', data: null })}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AlertTriangle size={20} color="#ff9800" />
                    Confirmar Cambios
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {confirmDialog.action === 'updateOrder' 
                            ? '¿Estás seguro de que quieres actualizar los estados de esta orden?'
                            : `¿Estás seguro de que quieres actualizar ${confirmDialog.data?.length || 0} productos?`
                        }
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Esta acción afectará el estado de la orden y puede enviar notificaciones al cliente.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setConfirmDialog({ open: false, action: '', data: null })}
                        disabled={updating}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={executeAction}
                        variant="contained"
                        disabled={updating}
                        startIcon={updating ? <CircularProgress size={16} /> : <Save size={16} />}
                    >
                        {updating ? 'Guardando...' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>

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

export default OrderEditStatusPageSection;