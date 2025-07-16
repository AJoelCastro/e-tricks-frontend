'use client';
import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IAddress } from '@/interfaces/Address';

type AddressFormProps = {
  initialValues?: IAddress;
  onSubmit: (data: Omit<IAddress, '_id'>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
};

const schema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio'),
  street: yup.string().required('La calle es obligatoria'),
  number: yup.string().required('El número es obligatorio'),
  city: yup.string().required('La ciudad es obligatoria'),
  state: yup.string().required('El estado/provincia es obligatorio'),
  zipCode: yup.string().required('El código postal es obligatorio'),
  country: yup.string().required('El país es obligatorio'),
  phone: yup.string().required('El teléfono es obligatorio'),
  isDefault: yup.boolean(),
});

const AddressForm: React.FC<AddressFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialValues?.name || '',
      street: initialValues?.street || '',
      number: initialValues?.number || '',
      city: initialValues?.city || '',
      state: initialValues?.state || '',
      zipCode: initialValues?.zipCode || '',
      country: initialValues?.country || '',
      phone: initialValues?.phone || '',
      isDefault: initialValues?.isDefault || false,
    },
  });

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre de la dirección"
                placeholder="Casa, Trabajo, etc."
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Calle"
                fullWidth
                error={!!errors.street}
                helperText={errors.street?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número"
                fullWidth
                error={!!errors.number}
                helperText={errors.number?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ciudad"
                fullWidth
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Estado/Provincia"
                fullWidth
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Código Postal"
                fullWidth
                error={!!errors.zipCode}
                helperText={errors.zipCode?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="País"
                fullWidth
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Teléfono"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="isDefault"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    color="primary"
                  />
                }
                label="Establecer como dirección predeterminada"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : initialValues ? (
                'Actualizar Dirección'
              ) : (
                'Guardar Dirección'
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddressForm;