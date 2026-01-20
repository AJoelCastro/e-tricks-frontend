'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
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
  country: yup
  .string()
  .required('El país es obligatorio')
  .test('is-peru', 'Solo se permiten direcciones dentro de Perú', (value) => value === 'Peru'),
  phone: yup.string().required('El teléfono es obligatorio'),
  // isDefault: yup.boolean(),
});

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: -12.0464, // Lima
  lng: -77.0428,
};

const AddressForm: React.FC<AddressFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>(
    defaultCenter
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const {
    control,
    handleSubmit,
    setValue,
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
      // isDefault: initialValues?.isDefault || false,
    },
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const components = results[0].address_components;

        const getComponent = (type: string) =>
          components.find(c => c.types.includes(type))?.long_name || '';

        const country = getComponent('country');

        if (country !== 'Peru') {
          setSnackbarOpen(true); // Mostrar alerta
          return;
        }

        // Solo si está en Perú, se actualizan los campos
        setValue('street', getComponent('route'));
        setValue('number', getComponent('street_number'));
        setValue('city', getComponent('locality') || getComponent('administrative_area_level_2'));
        setValue('state', getComponent('administrative_area_level_1'));
        setValue('zipCode', getComponent('postal_code'));
        setValue('country', country);
      }
    });
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  };

  const handleFormSubmit = (data: Omit<IAddress, '_id'>) => {
    onSubmit(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={1}>
          {/* Mapa */}
          <Grid size={{xs:12, sm:12, md:12}}>
            <Typography variant="subtitle1" gutterBottom>
              Selecciona tu dirección en el mapa
            </Typography>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPosition}
                zoom={15}
                onClick={handleMapClick}
              >
                <Marker position={markerPosition} draggable onDragEnd={handleMapClick} />
              </GoogleMap>
            ) : (
              <CircularProgress />
            )}
          </Grid>

          {/* Campos del formulario */}
          <Grid size={{xs:6, sm:6, md:4}}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="(Ej: Casa, Oficina)"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{xs:6, sm:6, md:3}}>
            <Controller
              name="street"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Calle" fullWidth error={!!errors.street} helperText={errors.street?.message} />
              )}
            />
          </Grid>

          <Grid size={{xs:6, sm:6, md:2}}>
            <Controller
              name="number"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Número" fullWidth error={!!errors.number} helperText={errors.number?.message} />
              )}
            />
          </Grid>

          <Grid size={{xs:6, sm:6, md:3}}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Ciudad" fullWidth error={!!errors.city} helperText={errors.city?.message} />
              )}
            />
          </Grid>

          <Grid size={{xs:6, sm:6, md:3}}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Estado/Provincia" fullWidth error={!!errors.state} helperText={errors.state?.message} />
              )}
            />
          </Grid>

          <Grid size={{xs:6, sm:6, md:3}}>
            <Controller
              name="zipCode"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Código Postal" fullWidth error={!!errors.zipCode} helperText={errors.zipCode?.message} />
              )}
            />
          </Grid>

          <Grid size={{xs:6, sm:6, md:3}}>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="País" fullWidth error={!!errors.country} helperText={errors.country?.message} />
              )}
            />
          </Grid>

          <Grid size={{xs:6, sm:6, md:3}}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Teléfono" fullWidth error={!!errors.phone} helperText={errors.phone?.message} />
              )}
            />
          </Grid>

          {/* <Grid size={{xs:12, sm:12, md:6}}>
            <Controller
              name="isDefault"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={field.onChange} color="primary" />}
                  label="Establecer como dirección predeterminada"
                />
              )}
            />
          </Grid> */}

          <Grid size={{xs:12, sm:12, md:12}}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={onCancel} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : initialValues ? 'Actualizar Dirección' : 'Guardar Dirección'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar para país no permitido */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          Solo se permiten direcciones dentro de Perú.
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddressForm;
