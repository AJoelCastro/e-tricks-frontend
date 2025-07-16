'use client';
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  // Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { IAddress } from '@/interfaces/Address';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';

type AddressCardProps = {
  address: IAddress;
  onEdit: () => void;
  onDelete: () => void;
  // onSetDefault: () => void;
};

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  // onSetDefault,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit();
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setConfirmDelete(true);
  };

  const handleDeleteConfirm = () => {
    setConfirmDelete(false);
    onDelete();
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false);
  };

  // const handleSetDefault = () => {
  //   handleMenuClose();
  //   onSetDefault();
  // };

  return (
    <>
      <Card sx={{ height: '100%', position: 'relative' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon color="primary" />
              <Typography variant="h6" component="div">
                {address.name}
              </Typography>
              {/* {address.isDefault && (
                <Chip
                  icon={<StarIcon fontSize="small" />}
                  label="Predeterminada"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )} */}
            </Box>

            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="body1" gutterBottom>
            {address.street} {address.number}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {address.city}, {address.state}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {address.zipCode}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {address.country}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tel: {address.phone}
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              size="small"
              onClick={onEdit}
            >
              Editar
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        {/* {!address.isDefault && (
          <MenuItem onClick={handleSetDefault}>
            <StarIcon fontSize="small" sx={{ mr: 1 }} />
            Establecer como predeterminada
          </MenuItem>
        )} */}
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      <Dialog
        open={confirmDelete}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ¿Eliminar dirección?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddressCard;