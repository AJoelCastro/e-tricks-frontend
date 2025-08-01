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
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Alert
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, CreditCard, Package, Calendar, Phone, Store, Copy, Star, RefreshCw } from 'lucide-react';
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

type Props = {
    id: string;
};

// Componente del Modal de Reembolso
interface RefundModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string, refundType: string) => void;
    itemName: string;
    loading?: boolean;
}

const RefundModal: React.FC<RefundModalProps> = ({ 
    open, 
    onClose, 
    onConfirm, 
    itemName, 
    loading = false 
}) => {
    const [reason, setReason] = useState('');
    const [refundType, setRefundType] = useState('defective');

    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason, refundType);
            setReason('');
            setRefundType('defective');
        }
    };

    const handleClose = () => {
        setReason('');
        setRefundType('defective');
        onClose();
    };

    const refundReasons = [
        { value: 'defective', label: 'Producto defectuoso' },
        { value: 'wrong_size', label: 'Talla incorrecta' },
        { value: 'not_as_described', label: 'No es como se describe' },
        { value: 'damaged_shipping', label: 'Dañado en el envío' },
        { value: 'changed_mind', label: 'Cambié de opinión' },
        { value: 'other', label: 'Otro motivo' }
    ];

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RefreshCw size={20} color="#ff6b6b" />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Solicitar Reembolso
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                    Vas a solicitar el reembolso para: <strong>{itemName}</strong>
                </Alert>

                <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                    <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Motivo del reembolso:
                    </FormLabel>
                    <RadioGroup
                        value={refundType}
                        onChange={(e) => setRefundType(e.target.value)}
                    >
                        {refundReasons.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio size="small" />}
                                label={option.label}
                                sx={{ mb: 0.5 }}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Descripción detallada"
                    placeholder="Explica en detalle el motivo de tu solicitud de reembolso..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    helperText="Por favor, proporciona una descripción clara del problema"
                    sx={{ mb: 2 }}
                />

                <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        • Tu solicitud será revisada en un plazo de 24-48 horas
                        <br />
                        • El reembolso puede tardar de 3-7 días hábiles
                        <br />
                        • Te notificaremos por email sobre el estado de tu solicitud
                    </Typography>
                </Alert>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button 
                    onClick={handleClose}
                    variant="outlined"
                    disabled={loading}
                    sx={{ 
                        borderColor: '#e0e0e0',
                        color: '#666',
                        '&:hover': { borderColor: '#ccc' }
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={loading || !reason.trim()}
                    startIcon={loading ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
                    sx={{
                        backgroundColor: '#ff6b6b',
                        '&:hover': { backgroundColor: '#ff5252' },
                        '&:disabled': { backgroundColor: '#ffcdd2' }
                    }}
                >
                    {loading ? 'Procesando...' : 'Confirmar Solicitud'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default RefundModal;