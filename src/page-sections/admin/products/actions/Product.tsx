'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ProductService from '@/services/ProductService';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';

// Esquema de validación
const schema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio'),
  description: yup.string().required('La descripción es obligatoria'),
  price: yup.number().positive('El precio debe ser positivo').required('El precio es obligatorio'),
  size: yup.array().of(yup.string()).min(1, 'Debe seleccionar al menos una talla'),
  stock: yup.number().integer('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo').required('El stock es obligatorio'),
  category: yup.string().required('La categoría es obligatoria'),
  marca: yup.string().required('La marca es obligatoria'),
  descuento: yup.number().required('El descuento es requerido'),
  images: yup.array().of(yup.string()).min(1, 'Debe agregar al menos una imagen'),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const categories = ['Camisetas', 'Pantalones', 'Vestidos', 'Zapatos', 'Accesorios'];

const Product = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const { getToken } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      size: [],
      stock: 0,
      category: '',
      marca: '',
      images: [],
      descuento: 0,
    },
  });

  const handleAddImage = () => {
    if (newImageUrl && !imageUrls.includes(newImageUrl)) {
      const updatedImages = [...imageUrls, newImageUrl];
      setImageUrls(updatedImages);
      setValue('images', updatedImages);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
    setValue('images', updatedImages);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const token = await getToken();
      // Llamada al servicio para crear el producto
      await ProductService.CreateProduct(token as string, data);
      
      setSnackbar({
        open: true,
        message: 'Producto creado exitosamente',
        severity: 'success',
      });
      
      // Resetear el formulario
      reset();
      setImageUrls([]);
    } catch (error) {
      console.error('Error al crear el producto:', error);
      setSnackbar({
        open: true,
        message:
          (error && typeof error === 'object' && 'response' in error && (error as any).response?.data?.message)
            || 'Error al crear el producto',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Box  sx={{ height:{xs:16, sm:32, md:64}}}></Box>
      <Box sx={{padding:2}} minHeight={'100vh'}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Panel de Administración de Productos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Registra nuevos productos para la tienda
          </Typography>
        </Box>

        <Card sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid size={{xs:12, sm:10, md:4}}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre del producto"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{xs:12, sm:10, md:4}}>
                <Controller
                  name="marca"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Marca"
                      fullWidth
                      error={!!errors.marca}
                      helperText={errors.marca?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{xs:12, sm:10, md:4}}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descripción"
                      fullWidth
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{xs:12, sm:10, md:2}}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Precio"
                      type="number"
                      fullWidth
                      InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{xs:12, sm:10, md:2}}>
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Stock"
                      type="number"
                      fullWidth
                      InputProps={{ inputProps: { min: 0 } }}
                      error={!!errors.stock}
                      helperText={errors.stock?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{xs:12, sm:10, md:2}}>
                <Controller
                  name="descuento"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descuento (%)"
                      type="number"
                      fullWidth
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{xs:12, sm:10, md:2}}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category}>
                      <InputLabel id="category-label">Categoría</InputLabel>
                      <Select
                        {...field}
                        labelId="category-label"
                        label="Categoría"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.category && (
                        <FormHelperText>{errors.category.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{xs:12, sm:10, md:4}}>
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.size}>
                      <InputLabel id="size-label">Tallas</InputLabel>
                      <Select
                        {...field}
                        labelId="size-label"
                        label="Tallas"
                        multiple
                        input={<OutlinedInput label="Tallas" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {sizes.map((size) => (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.size && (
                        <FormHelperText>{errors.size.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{xs:12, sm:10, md:4}}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    label="URL de la imagen"
                    fullWidth
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddImage}
                    disabled={!newImageUrl}
                  >
                    Agregar
                  </Button>
                </Box>
                {errors.images && (
                  <FormHelperText error>{errors.images.message}</FormHelperText>
                )}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {imageUrls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 150,
                        height: 150,
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        width ={100}
                        height={100}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          minWidth: 'auto',
                          width: 30,
                          height: 30,
                          p: 0,
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        X
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid size={{xs:12, sm:10, md:12}}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Registrar Producto'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>

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
    </>
  );
};

export default Product;