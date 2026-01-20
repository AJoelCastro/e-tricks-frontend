'use client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import { RefreshCw } from 'lucide-react';
import React from 'react';

interface RefundRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  itemName: string;
  loading: boolean;
  refundReason: string;
  setRefundReason: (value: string) => void;
  refundType: string;
  setRefundType: (value: string) => void;
}

const refundReasons = [
  { value: 'defective', label: 'Producto defectuoso' },
  { value: 'wrong_size', label: 'Talla incorrecta' },
  { value: 'not_as_described', label: 'No es como se describe' },
  { value: 'damaged_shipping', label: 'Dañado en el envío' },
  { value: 'changed_mind', label: 'Cambié de opinión' },
  { value: 'other', label: 'Otro motivo' }
];

const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  open,
  onClose,
  onSubmit,
  itemName,
  loading,
  refundReason,
  setRefundReason,
  refundType,
  setRefundType
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
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
          onClick={onClose}
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
          onClick={onSubmit}
          variant="contained"
          disabled={loading || !refundReason.trim()}
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

export default RefundRequestModal;