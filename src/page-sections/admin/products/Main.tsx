'use client';
import React, { useEffect, useState } from 'react';
import { IProduct } from '@/interfaces/Product';
import ProductService from '@/services/ProductService';
import NavbarComponent from '@/components/principal/NavbarComponent';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  TextField,
  InputAdornment,
  Skeleton,
  Alert,
  Badge,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  LocalOffer as OfferIcon,
  TrendingUp as TrendingIcon,
  FiberNew as NewIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import LeftSideAdmin from '@/components/admin/LeftSideAdmin';

const MainProductsPageSection = () => {
  const [products, setProducts] = useState<Array<IProduct>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null as IProduct | null });
  const [viewDialog, setViewDialog] = useState({ open: false, product: null as IProduct | null });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const router = useRouter();

  const getProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.GetProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: IProduct) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleDeleteClick = (product: IProduct) => {
    setDeleteDialog({ open: true, product });
    handleMenuClose();
  };

  const handleViewClick = (product: IProduct) => {
    router.push(`/admin/productos/detalle/${product._id}`);
    handleMenuClose();
  };

  const handleEditClick = (product: IProduct) => {
    // Aquí implementarías la lógica de edición
    router.push(`/admin/productos/editar/${product._id}`);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.product) {
      try {
        // Aquí implementarías la lógica de eliminación
        console.log('Eliminar producto:', deleteDialog.product);
        // await ProductService.DeleteProduct(deleteDialog.product._id);
        // getProducts(); // Recargar productos
        setDeleteDialog({ open: false, product: null });
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  const getTotalStock = (stockPorTalla: { talla: number; stock: number }[]) => {
    return stockPorTalla.reduce((total, item) => total + item.stock, 0);
  };

 

  return (
    <>
      <NavbarComponent />
      <Box sx={{ height: '64px' }} />
      <Grid container spacing={1} sx={{minHeight:'100vh'}}>
        <Grid size={{
          xs:12, sm:5, md:3
        }}>
          <LeftSideAdmin/>
        </Grid>
        <Grid size={{
          xs:12, sm:7, md:9
        }}>
          <Box sx={{  bgcolor: '#f5f5f5', p: 3 }}>

            {/* Controles */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              flexWrap: 'wrap',
            }}>
                {/* Header */}
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                        Sección de Productos
                    </Typography>
                </Box>
              
                <Box sx={{ display: 'flex', alignItems: 'center' , gap:2}}>
                    <TextField
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        }}
                        sx={{ minWidth: 300 }}
                    />
                    <Fab
                        color="primary"
                        aria-label="add"
                        onClick={() => router.push('/admin/productos/crear')}
                    >
                        <AddIcon />
                    </Fab>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {products.length}
                  </Typography>
                  <Typography variant="body2">
                    Total Productos
                  </Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {products.filter(p => p.isNewProduct).length}
                  </Typography>
                  <Typography variant="body2">
                    Productos Nuevos
                  </Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {products.filter(p => p.isTrending).length}
                  </Typography>
                  <Typography variant="body2">
                    En Tendencia
                  </Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {products.filter(p => p.descuento && p.descuento > 0).length}
                  </Typography>
                  <Typography variant="body2">
                    Con Descuento
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Products Grid */}
            <Grid container spacing={3}>
              {loading ? (
                // Skeleton loading
                Array.from(new Array(6)).map((_, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                    <Card>
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="60%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : filteredProducts.length === 0 ? (
                <Grid size={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      No se encontraron productos
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primer producto'}
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                filteredProducts.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.images[0] || '/placeholder-image.jpg'}
                          alt={product.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        
                        {/* Badges */}
                        <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {product.isNewProduct && (
                            <Box
                              sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              <NewIcon sx={{ fontSize: '0.8rem' }} />
                              Nuevo
                            </Box>
                          )}
                          {product.isTrending && (
                            <Box
                              sx={{
                                bgcolor: 'warning.main',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              <TrendingIcon sx={{ fontSize: '0.8rem' }} />
                              Tendencia
                            </Box>
                          )}
                          {product.descuento && product.descuento > 0 && (
                            <Box
                              sx={{
                                bgcolor: 'error.main',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              <OfferIcon sx={{ fontSize: '0.8rem' }} />
                              -{product.descuento}%
                            </Box>
                          )}
                        </Box>

                        {/* Menu Button */}
                        <IconButton
                          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                          onClick={(e) => handleMenuOpen(e, product)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom noWrap>
                          {product.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip label={product.brand.name} size="small" variant="outlined" />
                          <Chip label={product.category.name} size="small" variant="outlined" />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {product.description.length > 60 
                            ? `${product.description.substring(0, 60)}...` 
                            : product.description}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {formatPrice(product.price)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Stock: {getTotalStock(product.stockPorTalla)}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewClick(product)}
                        >
                          Ver
                        </Button>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(product)}
                        >
                          Editar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>

            {/* Menu contextual */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => selectedProduct && handleViewClick(selectedProduct)}>
                <ViewIcon sx={{ mr: 1 }} />
                Ver detalles
              </MenuItem>
              <MenuItem onClick={() => selectedProduct && handleEditClick(selectedProduct)}>
                <EditIcon sx={{ mr: 1 }} />
                Editar
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => selectedProduct && handleDeleteClick(selectedProduct)} sx={{ color: 'error.main' }}>
                <DeleteIcon sx={{ mr: 1 }} />
                Eliminar
              </MenuItem>
            </Menu>

            {/* Dialog para eliminar */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, product: null })}>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogContent>
                <Typography>
                  ¿Estás seguro de que quieres eliminar el producto "{deleteDialog.product?.name}"?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialog({ open: false, product: null })}>
                  Cancelar
                </Button>
                <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                  Eliminar
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default MainProductsPageSection;