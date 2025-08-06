'use client';
import React, { useState, useEffect } from 'react';
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
  OutlinedInput,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Skeleton,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ProductService from '@/services/ProductService';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { IProduct } from '@/interfaces/Product';

interface ProductFormProps {
  productId?: string; // Si tiene ID, es edición; si no, es creación
  onSuccess?: (product: IProduct) => void; // Callback opcional para manejar el éxito
  onCancel?: () => void; // Callback opcional para manejar cancelación
}

// Esquema de validación actualizado según tu interfaz
const schema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio'),
  description: yup.string().required('La descripción es obligatoria'),
  price: yup.number().positive('El precio debe ser positivo').required('El precio es obligatorio'),
  stockPorTalla: yup.array().of(
    yup.object().shape({
      talla: yup.number().required(),
      stock: yup.number().min(0).required(),
    })
  ).min(1, 'Debe agregar al menos una talla con stock'),
  material: yup.string().required('El material es obligatorio'),
  category: yup.string().required('La categoría es obligatoria'),
  subCategory: yup.string().required('La subcategoría es obligatoria'),
  groupCategory: yup.string().required('El grupo de categoría es obligatorio'),
  brand: yup.string().required('La marca es obligatoria'),
  descuento: yup.number().min(0).max(100).required('El descuento es requerido'),
  images: yup.array().of(yup.string()).min(1, 'Debe agregar al menos una imagen'),
  season: yup.string().optional(),
  isNewProduct: yup.boolean(),
  isTrending: yup.boolean(),
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

// Datos estáticos (podrías obtenerlos de una API)
const sizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]; // Tallas numéricas
const materials = ['Algodón', 'Poliéster', 'Cuero', 'Lino', 'Seda', 'Lana'];
const categories = ['Camisetas', 'Pantalones', 'Vestidos', 'Zapatos', 'Accesorios'];
const subCategories = ['Casual', 'Formal', 'Deportivo', 'Elegante'];
const groupCategories = ['Hombres', 'Mujeres', 'Niños', 'Unisex'];
const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Prada'];
const seasons = ['Primavera', 'Verano', 'Otoño', 'Invierno'];

const ProductForm: React.FC<ProductFormProps> = ({ 
  productId, 
  onSuccess, 
  onCancel 
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [stockPorTalla, setStockPorTalla] = useState<{ talla: number; stock: number }[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  
  const { getToken } = useAuth();
  const isEditing = !!productId;
  
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stockPorTalla: [],
      material: '',
      category: '',
      subCategory: '',
      groupCategory: '',
      brand: '',
      images: [],
      descuento: 0,
      season: '',
      isNewProduct: false,
      isTrending: false,
    },
  });

  // Cargar datos del producto si es edición
  useEffect(() => {
    if (isEditing && productId) {
      loadProductData(productId);
    }
  }, [productId, isEditing]);

  const loadProductData = async (id: string) => {
    try {
      setLoadingProduct(true);
      const product = await ProductService.GetProductById(id);
      
      // Llenar el formulario con los datos del producto
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stockPorTalla: product.stockPorTalla,
        material: product.material._id, // Asumiendo que necesitas el ID
        category: product.category._id,
        subCategory: product.subCategory._id,
        groupCategory: product.groupCategory._id,
        brand: product.brand._id,
        images: product.images,
        descuento: product.descuento || 0,
        season: product.season || '',
        isNewProduct: product.isNewProduct,
        isTrending: product.isTrending,
      });
      
      setImageUrls(product.images);
      setStockPorTalla(product.stockPorTalla);
      
    } catch (error) {
      console.error('Error al cargar el producto:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los datos del producto',
        severity: 'error',
      });
    } finally {
      setLoadingProduct(false);
    }
  };

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

  const handleAddSizeStock = () => {
    const newEntry = { talla: 0, stock: 0 };
    const updatedStock = [...stockPorTalla, newEntry];
    setStockPorTalla(updatedStock);
    setValue('stockPorTalla', updatedStock);
  };

  const handleRemoveSizeStock = (index: number) => {
    const updatedStock = stockPorTalla.filter((_, i) => i !== index);
    setStockPorTalla(updatedStock);
    setValue('stockPorTalla', updatedStock);
  };

  const handleSizeStockChange = (index: number, field: 'talla' | 'stock', value: number) => {
    const updatedStock = [...stockPorTalla];
    updatedStock[index][field] = value;
    setStockPorTalla(updatedStock);
    setValue('stockPorTalla', updatedStock);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const token = await getToken();
      
      // Preparar los datos según tu interfaz
      const productData = {
        ...data,
        stockPorTalla: stockPorTalla,
      };
      
      let result;
      if (isEditing) {
        // Actualizar producto existente
        result = await ProductService.UpdateProduct(token as string, productId!, productData);
      } else {
        // Crear nuevo producto
        result = await ProductService.CreateProduct(token as string, productData);
      }
      
      setSnackbar({
        open: true,
        message: isEditing ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente',
        severity: 'success',
      });
      
      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess(result);
      }
      
      // Si es creación, resetear el formulario
      if (!isEditing) {
        reset();
        setImageUrls([]);
        setStockPorTalla([]);
      }
      
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setSnackbar({
        open: true,
        message:
          (error && typeof error === 'object' && 'response' in error && (error as any).response?.data?.message)
            || `Error al ${isEditing ? 'actualizar' : 'crear'} el producto`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loadingProduct) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="text" height={60} />
        <Skeleton variant="text" height={40} />
        <Card sx={{ p: 4, mt: 2 }}>
          <Grid container spacing={3}>
            {Array.from(new Array(8)).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
            ))}
          </Grid>
        </Card>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ height: { xs: 16, sm: 32, md: 64 } }} />
      <Box sx={{ padding: 2 }} minHeight={'100vh'}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {isEditing ? 'Modifica los datos del producto' : 'Registra nuevos productos para la tienda'}
            </Typography>
          </Box>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </Box>

        <Card sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Información básica */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Información básica
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.brand}>
                      <InputLabel>Marca</InputLabel>
                      <Select {...field} label="Marca">
                        {brands.map((brand) => (
                          <MenuItem key={brand} value={brand}>
                            {brand}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.brand && (
                        <FormHelperText>{errors.brand.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Controller
                  name="material"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.material}>
                      <InputLabel>Material</InputLabel>
                      <Select {...field} label="Material">
                        {materials.map((material) => (
                          <MenuItem key={material} value={material}>
                            {material}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.material && (
                        <FormHelperText>{errors.material.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descripción"
                      fullWidth
                      multiline
                      rows={3}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              {/* Categorización */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Categorización
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category}>
                      <InputLabel>Categoría</InputLabel>
                      <Select {...field} label="Categoría">
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

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Controller
                  name="subCategory"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.subCategory}>
                      <InputLabel>Subcategoría</InputLabel>
                      <Select {...field} label="Subcategoría">
                        {subCategories.map((subCategory) => (
                          <MenuItem key={subCategory} value={subCategory}>
                            {subCategory}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.subCategory && (
                        <FormHelperText>{errors.subCategory.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Controller
                  name="groupCategory"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.groupCategory}>
                      <InputLabel>Grupo</InputLabel>
                      <Select {...field} label="Grupo">
                        {groupCategories.map((group) => (
                          <MenuItem key={group} value={group}>
                            {group}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.groupCategory && (
                        <FormHelperText>{errors.groupCategory.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Controller
                  name="season"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Temporada</InputLabel>
                      <Select {...field} label="Temporada">
                        <MenuItem value="">Sin temporada</MenuItem>
                        {seasons.map((season) => (
                          <MenuItem key={season} value={season}>
                            {season}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Precio y descuento */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Precio y promociones
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                      error={!!errors.descuento}
                      helperText={errors.descuento?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Controller
                  name="isNewProduct"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Producto nuevo"
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Controller
                  name="isTrending"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="En tendencia"
                    />
                  )}
                />
              </Grid>

              {/* Stock por talla */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
                  <Typography variant="h6">
                    Stock por talla
                  </Typography>
                  <Button variant="outlined" onClick={handleAddSizeStock}>
                    Agregar talla
                  </Button>
                </Box>
              </Grid>

              {stockPorTalla.map((item, index) => (
                <React.Fragment key={index}>
                  <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel>Talla</InputLabel>
                      <Select
                        value={item.talla}
                        onChange={(e) => handleSizeStockChange(index, 'talla', Number(e.target.value))}
                        label="Talla"
                      >
                        {sizes.map((size) => (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                    <TextField
                      label="Stock"
                      type="number"
                      fullWidth
                      value={item.stock}
                      onChange={(e) => handleSizeStockChange(index, 'stock', Number(e.target.value))}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveSizeStock(index)}
                      fullWidth
                    >
                      Eliminar
                    </Button>
                  </Grid>
                </React.Fragment>
              ))}

              {errors.stockPorTalla && (
                <Grid size={{ xs: 12 }}>
                  <FormHelperText error>{errors.stockPorTalla.message}</FormHelperText>
                </Grid>
              )}

              {/* Imágenes */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Imágenes del producto
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 8, md: 6 }}>
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
              </Grid>

              <Grid size={{ xs: 12 }}>
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
                        width={100}
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

              {/* Botones */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ minWidth: 200 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      isEditing ? 'Actualizar Producto' : 'Crear Producto'
                    )}
                  </Button>
                  
                  {onCancel && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={onCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  )}
                </Box>
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

export default ProductForm;