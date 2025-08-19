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
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Skeleton,
  Chip,
  Divider,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { Edit, Save, Cancel, Delete, Image as ImageIcon, Inventory, Category, LocalOffer, Info } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ProductService from '@/services/ProductService';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { IProduct } from '@/interfaces/Product';

interface ProductDetailsEditProps {
  isEdit: boolean;
  productId: string;
  onSuccess?: (product: IProduct) => void;
  onCancel?: () => void;
  onDelete?: (productId: string) => void;
}

// Esquema de validación
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

// Datos estáticos
const sizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
const materials = ['Algodón', 'Poliéster', 'Cuero', 'Lino', 'Seda', 'Lana'];
const categories = ['Camisetas', 'Pantalones', 'Vestidos', 'Zapatos', 'Accesorios'];
const subCategories = ['Casual', 'Formal', 'Deportivo', 'Elegante'];
const groupCategories = ['Hombres', 'Mujeres', 'Niños', 'Unisex'];
const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Prada'];
const seasons = ['Primavera', 'Verano', 'Otoño', 'Invierno'];

const ProductDetailsEdit: React.FC<ProductDetailsEditProps> = ({ 
  isEdit,
  productId,
  onSuccess, 
  onCancel,
  onDelete
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [stockPorTalla, setStockPorTalla] = useState<{ talla: number; stock: number }[]>([]);
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

  // Cargar datos del producto
  useEffect(() => {
    if (productId) {
      loadProductData(productId);
    }
  }, [productId]);

  const loadProductData = async (id: string) => {
    try {
      setLoadingProduct(true);
      const productData = await ProductService.GetProductById(id);
      setProduct(productData);
      
      // Llenar el formulario con los datos del producto
      reset({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stockPorTalla: productData.stockPorTalla,
        material: typeof productData.material === 'object' ? productData.material.name : productData.material,
        category: typeof productData.category === 'object' ? productData.category.name : productData.category,
        subCategory: typeof productData.subCategory === 'object' ? productData.subCategory.name : productData.subCategory,
        groupCategory: typeof productData.groupCategory === 'object' ? productData.groupCategory.name : productData.groupCategory,
        brand: typeof productData.brand === 'object' ? productData.brand.name : productData.brand,
        images: productData.images,
        descuento: productData.descuento || 0,
        season: productData.season || '',
        isNewProduct: productData.isNewProduct,
        isTrending: productData.isTrending,
      });
      
      setImageUrls(productData.images);
      setStockPorTalla(productData.stockPorTalla);
      
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Si cancelamos la edición, recargar los datos originales
      if (product) {
        reset({
          name: product.name,
          description: product.description,
          price: product.price,
          stockPorTalla: product.stockPorTalla,
          material: typeof product.material === 'object' ? product.material.name : product.material,
          category: typeof product.category === 'object' ? product.category.name : product.category,
          subCategory: typeof product.subCategory === 'object' ? product.subCategory.name : product.subCategory,
          groupCategory: typeof product.groupCategory === 'object' ? product.groupCategory.name : product.groupCategory,
          brand: typeof product.brand === 'object' ? product.brand.name : product.brand,
          images: product.images,
          descuento: product.descuento || 0,
          season: product.season || '',
          isNewProduct: product.isNewProduct,
          isTrending: product.isTrending,
        });
        setImageUrls(product.images);
        setStockPorTalla(product.stockPorTalla);
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const productData = {
        ...data,
        stockPorTalla: stockPorTalla,
      };
      
      const result = await ProductService.UpdateProduct(token as string, productId, productData);
      
      setSnackbar({
        open: true,
        message: 'Producto actualizado exitosamente',
        severity: 'success',
      });
      
      setProduct(result);
      setIsEditing(false);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      setSnackbar({
        open: true,
        message:
          (error && typeof error === 'object' && 'response' in error && (error as any).response?.data?.message)
            || 'Error al actualizar el producto',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        setLoading(true);
        const token = await getToken();
        // await ProductService.DeleteProduct(token as string, productId);
        
        setSnackbar({
          open: true,
          message: 'Producto eliminado exitosamente',
          severity: 'success',
        });
        
        if (onDelete) {
          onDelete(productId);
        }
        
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        setSnackbar({
          open: true,
          message: 'Error al eliminar el producto',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount / 100);
  };

  const getTotalStock = () => {
    return stockPorTalla.reduce((total, item) => total + item.stock, 0);
  };

  // Componente para mostrar información en modo visualización
  const InfoField = ({ label, value, icon }: { label: string; value: string | number | boolean; icon?: React.ReactNode }) => (
    <Paper sx={{ p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon && <Box sx={{ mr: 1, color: 'primary.main' }}>{icon}</Box>}
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
        {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value || 'No especificado'}
      </Typography>
    </Paper>
  );

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

  if (!product) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Producto no encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {isEditing ? 'Editando Producto' : product.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {isEditing ? 'Modifica los datos del producto' : 'Detalles del producto'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {
              isEdit&&(
                <>
                  {!isEditing && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={handleEditToggle}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDelete}
                        disabled={loading}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                  {isEditing && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleEditToggle}
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={20} /> : 'Guardar'}
                      </Button>
                    </>
                  )}
                </>
              )
            }
            {onCancel && (
              <Button variant="outlined" onClick={onCancel}>
                Volver
              </Button>
            )}
          </Box>
        </Box>

        {/* Información de resumen cuando no se está editando */}
        {!isEditing && (
          <Card sx={{ p: 3, mb: 3, background: 'white' }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Info sx={{ mr: 1 }} />
                  Resumen del Producto
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip label={`$${product.price}`} color="primary" size="medium" />
                  {product.descuento! > 0 && (
                    <Chip 
                      label={`Con descuento: $${calculateDiscountedPrice(product.price, product.descuento!).toFixed(2)}`} 
                      color="secondary" 
                      size="medium"
                    />
                  )}
                  <Chip label={`Stock total: ${getTotalStock()}`} color="info" size="medium" />
                  {product.isNewProduct && <Chip label="Nuevo" color="success" size="medium" />}
                  {product.isTrending && <Chip label="Tendencia" color="warning" size="medium" />}
                </Box>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {product.description}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                {product.images.length > 0 && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={200}
                      height={200}
                      style={{ 
                        borderRadius: '12px',
                        objectFit: 'cover',
                        border: '3px solid #fff',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Contenido principal */}
        {!isEditing ? (
          // Vista de solo lectura mejorada
          <Box>
            {/* Información básica */}
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Info sx={{ mr: 1 }} />
                Información Básica
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoField label="Nombre del producto" value={product.name} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoField label="Marca" value={typeof product.brand === 'object' ? product.brand.name : product.brand} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoField label="Material" value={typeof product.material === 'object' ? product.material.name : product.material} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', display: 'block', mb: 1 }}>
                      Descripción
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', lineHeight: 1.6 }}>
                      {product.description}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Card>

            {/* Categorización */}
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Category sx={{ mr: 1 }} />
                Categorización
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <InfoField label="Categoría" value={typeof product.category === 'object' ? product.category.name : product.category} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <InfoField label="Subcategoría" value={typeof product.subCategory === 'object' ? product.subCategory.name : product.subCategory} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <InfoField label="Grupo" value={typeof product.groupCategory === 'object' ? product.groupCategory.name : product.groupCategory} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <InfoField label="Temporada" value={product.season || 'Sin temporada'} />
                </Grid>
              </Grid>
            </Card>

            {/* Precio y promociones */}
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocalOffer sx={{ mr: 1 }} />
                Precio y Promociones
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <InfoField label="Precio" value={`$${product.price}`} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <InfoField label="Descuento" value={`${product.descuento || 0}%`} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <InfoField label="Producto nuevo" value={product.isNewProduct} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <InfoField label="En tendencia" value={product.isTrending} />
                </Grid>
              </Grid>
            </Card>

            {/* Stock por talla */}
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Inventory sx={{ mr: 1 }} />
                Stock por Talla
              </Typography>
              <Grid container spacing={2}>
                {stockPorTalla.map((item, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                    <Paper sx={{ p: 2, backgroundColor: '#f0f7ff', border: '1px solid #b3d4fc', textAlign: 'center' }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        Talla {item.talla}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stock disponible
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: item.stock > 0 ? 'success.main' : 'error.main' }}>
                        {item.stock}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Paper sx={{ p: 2, mt: 2, backgroundColor: '#f8f9fa', textAlign: 'center' }}>
                <Typography variant="h6">
                  Stock Total: <span style={{ color: '#1976d2', fontWeight: 'bold' }}>{getTotalStock()}</span>
                </Typography>
              </Paper>
            </Card>

            {/* Imágenes */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ImageIcon sx={{ mr: 1 }} />
                Imágenes del Producto
              </Typography>
              <Grid container spacing={2}>
                {imageUrls.map((url, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                    <Paper sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                      <Image
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        width={200}
                        height={200}
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover', 
                          borderRadius: '8px' 
                        }}
                      />
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'text.secondary' }}>
                        Imagen {index + 1}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Box>
        ) : (
          // Vista de edición (formulario original)
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
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
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
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
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
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
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
                          width={150}
                          height={150}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <IconButton
                          color="error"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            },
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Card>
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
    </>
  );
};

export default ProductDetailsEdit;