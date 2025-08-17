'use client';
import React, { useEffect, useState } from 'react';
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
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import { Add, Delete, Settings } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ProductService from '@/services/ProductService';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { IProduct, ICaracteristica } from '@/interfaces/Product';
import { IMaterial } from '@/interfaces/Material';
import MaterialService from '@/services/MaterialService';
import { IBrand } from '@/interfaces/Brand';
import BrandService from '@/services/BrandService';
import { IProductCategory } from '@/interfaces/ProductCategory';
import ProductCategoryService from '@/services/ProductCategoryService';
import { ISubCategory } from '@/interfaces/SubCategory';
import SubCategoryService from '@/services/SubCategoryService';
import { IGroupCategory } from '@/interfaces/GroupCategory';
import GroupCategoryService from '@/services/GroupCategoryService';
import AWSService from '@/services/AWS';

interface CreateProductFormProps {
  onSuccess?: (product: IProduct) => void;
  onCancel?: () => void;
}

// Esquema de validación actualizado
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
  caracteristicas: yup.array().of(
    yup.object().shape({
      nombre: yup.string().required('El nombre de la característica es obligatorio'),
      valor: yup.string().required('El valor de la característica es obligatorio'),
    })
  ).optional(),
});

// Datos estáticos
const sizes = [34, 35, 36, 37, 38, 39, 40, 41, 42];
const seasons = ['Primavera', 'Verano', 'Otoño', 'Invierno', 'Todas las temporadas'];

// Características predefinidas comunes
const commonCharacteristics = [
  'Color',
  'Talla',
  'Peso',
  'Dimensiones',
  'Género',
  'Estilo',
  'Ocasión',
  'Cuidado',
  'Origen',
  'Garantía'
];

const CreateProductForm: React.FC<CreateProductFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [stockPorTalla, setStockPorTalla] = useState<{ talla: number; stock: number }[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<ICaracteristica[]>([]);
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [groupCategories, setGroupCategories] = useState<IGroupCategory[]>([]);
  const [folders, setFolders] = useState<{ folderName: string }[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [folderImages, setFolderImages] = useState<any[]>([]);
  const [loadingFolderImages, setLoadingFolderImages] = useState(false);
  const getFolders = async () => {
    try {
      const token = await getToken();
      const res = await AWSService.getFolderNames(token!);
      setFolders(res.folders || []);
    } catch (err) {
      console.error(err);
    }
  };
  const handleSelectFolder = async (folderName: string) => {
    setSelectedFolder(folderName);
    if (!folderName) {
      setFolderImages([]);
      return;
    }
    try {
      setLoadingFolderImages(true);
      const token = await getToken();
      const res = await AWSService.getFolderDetails(token!, folderName);
      // asumo res.images es el array que mostraste
      setFolderImages(res.images || []);
    } catch (err) {
      console.error('Error al obtener imágenes de carpeta:', err);
      setFolderImages([]);
    } finally {
      setLoadingFolderImages(false);
    }
  };

  // Alternar selección de imagen (añade/remueve de imageUrls y del form)
  const toggleSelectImage = (imageUrl: string) => {
    const exists = imageUrls.includes(imageUrl);
    const updated = exists ? imageUrls.filter(u => u !== imageUrl) : [...imageUrls, imageUrl];
    setImageUrls(updated);
    setValue('images', updated);
  };

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
      caracteristicas: [],
    },
  });

  // Funciones para obtener datos de los servicios
  const getMaterials = async () => {
    try {
      const response = await MaterialService.getAllMaterials();
      setMaterials(response)
    } catch (error) {
      throw error
    }
  }

  const getBrands = async () => {
    try {
      const response = await BrandService.getBrands();
      setBrands(response)
    } catch (error) {
      throw error
    }
  }

  const getCategories = async () => {
    try {
      const response = await ProductCategoryService.getCategories();
      setCategories(response)
    } catch (error) {
      throw error
    }
  }

  const getSubCategories = async () => {
    try {
      const response = await SubCategoryService.getSubCategories();
      setSubCategories(response)
    } catch (error) {
      throw error
    }
  }

  const getGroupCategories = async () => {
    try {
      const response = await GroupCategoryService.getGroupCategories(true);
      setGroupCategories(response.filter((gc: IGroupCategory) => gc.routeLink !== "marcas"))
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    getGroupCategories();
    getSubCategories();
    getCategories()
    getBrands();
    getMaterials();
    getFolders();
  }, [])

  // Funciones para manejar imágenes
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

  // Funciones para manejar stock por talla
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

  // Funciones para manejar características
  const handleAddCaracteristica = () => {
    const newCaracteristica: ICaracteristica = { nombre: '', valor: '' };
    const updatedCaracteristicas = [...caracteristicas, newCaracteristica];
    setCaracteristicas(updatedCaracteristicas);
    setValue('caracteristicas', updatedCaracteristicas);
  };

  const handleRemoveCaracteristica = (index: number) => {
    const updatedCaracteristicas = caracteristicas.filter((_, i) => i !== index);
    setCaracteristicas(updatedCaracteristicas);
    setValue('caracteristicas', updatedCaracteristicas);
  };

  const handleCaracteristicaChange = (index: number, field: 'nombre' | 'valor', value: string) => {
    const updatedCaracteristicas = [...caracteristicas];
    updatedCaracteristicas[index][field] = value;
    setCaracteristicas(updatedCaracteristicas);
    setValue('caracteristicas', updatedCaracteristicas);
  };

  const handleAddPresetCharacteristic = (characteristicName: string) => {
    const exists = caracteristicas.some(c => c.nombre === characteristicName);
    if (!exists) {
      const newCaracteristica: ICaracteristica = { nombre: characteristicName, valor: '' };
      const updatedCaracteristicas = [...caracteristicas, newCaracteristica];
      setCaracteristicas(updatedCaracteristicas);
      setValue('caracteristicas', updatedCaracteristicas);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const productData = {
        ...data,
        stockPorTalla: stockPorTalla,
        caracteristicas: caracteristicas.filter(c => c.nombre.trim() && c.valor.trim()), // Solo incluir características completas
      };
      
      const result = await ProductService.CreateProduct(token as string, productData);
      
      setSnackbar({
        open: true,
        message: 'Producto creado exitosamente',
        severity: 'success',
      });
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      // Resetear el formulario
      reset();
      setImageUrls([]);
      setStockPorTalla([]);
      setCaracteristicas([]);
      
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
      <Box sx={{ padding: 2 }} minHeight={'100vh'}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Crear Nuevo Producto
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Registra nuevos productos para la tienda
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
                          <MenuItem key={brand._id} value={brand._id}>
                            {brand.name}
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
                          <MenuItem key={material._id} value={material._id}>
                            {material.name}
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
                          <MenuItem key={category._id} value={category._id}>
                            {category.name}
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
                          <MenuItem key={subCategory._id} value={subCategory._id}>
                            {subCategory.name}
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
                          <MenuItem key={group._id} value={group._id}>
                            {group.name}
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

              {/* Características del producto */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Settings sx={{ mr: 1 }} />
                    Características del producto
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<Add />}
                    onClick={handleAddCaracteristica}
                  >
                    Agregar característica
                  </Button>
                </Box>
              </Grid>

              {/* Características predefinidas */}
              {caracteristicas.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Características comunes (clic para agregar):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {commonCharacteristics.map((char) => (
                        <Button
                          key={char}
                          variant="outlined"
                          size="small"
                          onClick={() => handleAddPresetCharacteristic(char)}
                          sx={{ textTransform: 'none' }}
                        >
                          + {char}
                        </Button>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              )}

              {/* Lista de características */}
              {caracteristicas.map((caracteristica, index) => (
                <React.Fragment key={index}>
                  <Grid size={{ xs: 12, sm: 5, md: 4 }}>
                    <TextField
                      label="Nombre de la característica"
                      fullWidth
                      value={caracteristica.nombre}
                      onChange={(e) => handleCaracteristicaChange(index, 'nombre', e.target.value)}
                      placeholder="Ej: Color, Talla, Material..."
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 5, md: 4 }}>
                    <TextField
                      label="Valor"
                      fullWidth
                      value={caracteristica.valor}
                      onChange={(e) => handleCaracteristicaChange(index, 'valor', e.target.value)}
                      placeholder="Ej: Rojo, XL, Algodón..."
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 2, md: 2 }}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveCaracteristica(index)}
                      sx={{ mt: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </React.Fragment>
              ))}

              {errors.caracteristicas && (
                <Grid size={{ xs: 12 }}>
                  <FormHelperText error>{errors.caracteristicas.message}</FormHelperText>
                </Grid>
              )}

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
              {/* Selector de carpeta */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Carpeta (S3)</InputLabel>
                  <Select
                    value={selectedFolder}
                    label="Carpeta (S3)"
                    onChange={(e) => handleSelectFolder(String(e.target.value))}
                  >
                    {folders.map((f) => (
                      <MenuItem key={f.folderName} value={f.folderName}>
                        {f.folderName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Opcional: botón para refrescar */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={() => handleSelectFolder(selectedFolder)} disabled={!selectedFolder || loadingFolderImages}>
                  {loadingFolderImages ? 'Cargando...' : 'Refrescar carpeta'}
                </Button>
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

              {/* Mostrar imágenes de la carpeta para seleccionar */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 2 }}>
                  {folderImages.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">Selecciona una carpeta para ver sus imágenes</Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {folderImages.map((img, index) => {
                        // usa img.url o img.signedUrl según lo que devuelva tu backend
                        const imageUrl = img.url || img.signedUrl || img.key;
                        const selected = imageUrls.includes(imageUrl);
                        return (
                          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                            <Box
                              onClick={() => toggleSelectImage(imageUrl)}
                              sx={{
                                position: 'relative',
                                border: selected ? '3px solid #1976d2' : '1px solid #ddd',
                                borderRadius: 2,
                                overflow: 'hidden',
                                cursor: 'pointer',
                              }}
                            >
                              <Image
                                src={imageUrl}
                                alt={img.fileName || `img-${index}`}
                                width={300}
                                height={200}
                                style={{ width: '100%', height: 180, objectFit: 'cover' }}
                              />
                              {selected && (
                                <Box sx={{
                                  position: 'absolute',
                                  top: 6,
                                  right: 6,
                                  backgroundColor: 'rgba(25,118,210,0.9)',
                                  color: '#fff',
                                  borderRadius: '50%',
                                  width: 28,
                                  height: 28,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 14
                                }}>
                                  ✓
                                </Box>
                              )}
                            </Box>
                            <Typography variant="caption" noWrap>{img.fileName}</Typography>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
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
                      'Crear Producto'
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

export default CreateProductForm;