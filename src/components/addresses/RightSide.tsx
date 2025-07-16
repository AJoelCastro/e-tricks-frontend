'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  IconButton,
} from '@mui/material';
import UserService from '@/services/UserService';
import { IAddress } from '@/interfaces/Address';
import AddressForm from './AddressForm';
import AddressCard from './AddressCard';
import AddIcon from '@mui/icons-material/Add';


const RightSideAddress = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar las direcciones',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address: IAddress) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await UserService.deleteAddress(addressId);
      setSnackbar({
        open: true,
        message: 'Dirección eliminada correctamente',
        severity: 'success',
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar la dirección',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await UserService.setDefaultAddress(addressId);
      setSnackbar({
        open: true,
        message: 'Dirección establecida como predeterminada',
        severity: 'success',
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error al establecer dirección predeterminada:', error);
      setSnackbar({
        open: true,
        message: 'Error al establecer la dirección predeterminada',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (address: Omit<IAddress, '_id'>) => {
    try {
      setLoading(true);
      if (editingAddress) {
        await UserService.updateAddress(editingAddress._id as string, address);
        setSnackbar({
          open: true,
          message: 'Dirección actualizada correctamente',
          severity: 'success',
        });
      } else {
        await UserService.addAddress(address);
        setSnackbar({
          open: true,
          message: 'Dirección agregada correctamente',
          severity: 'success',
        });
      }
      setShowForm(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (error) {
      console.error('Error al guardar dirección:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar la dirección',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };


  return (
    <Box sx={{ padding:2 }}>
      {loading && !showForm ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {!showForm && (
            <Box sx={{ mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddAddress}
              >
                Agregar Nueva Dirección
              </Button>
            </Box>
          )}

          {showForm ? (
            <Card sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                {editingAddress ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <AddressForm
                initialValues={editingAddress || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelForm}
                loading={loading}
              />
            </Card>
          ) : addresses.length > 0 ? (
            <Grid container spacing={1}>
              {addresses.map((address) => (
                <Grid size={{xs:6, sm:6, md:4}} key={address._id}>
                  <AddressCard
                    address={address}
                    onEdit={() => handleEditAddress(address)}
                    onDelete={() => handleDeleteAddress(address._id as string)}
                    onSetDefault={() => handleSetDefaultAddress(address._id as string)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No tienes direcciones guardadas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Agrega una nueva dirección para tus envíos
              </Typography>
            </Card>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RightSideAddress;