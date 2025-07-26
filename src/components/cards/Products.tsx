import * as React from 'react';
import {
  Box, Card, CardContent, CardMedia, Typography, IconButton,
  Grid, Rating, Modal, Button, Snackbar, Alert, Chip
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { IProduct } from '@/interfaces/Product';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type Props = {
  products: IProduct;
  markedFavorite?: boolean;
  handleRemoveFavorite?: (idProduct: string) => Promise<void>;
  handleAddFavorite?: (idProduct: string) => Promise<void>;
  show: boolean;
  isInCart?: boolean;
  handleAddToCart?: (productId: string, size: string, quantity: number) => Promise<void>;
  handleRemoveFromCart?: (productId: string) => Promise<void>;
};

const ProductCard: React.FC<Props> = ({
  products,
  markedFavorite,
  handleRemoveFavorite,
  handleAddFavorite,
  show,
  isInCart = false,
  handleAddToCart,
  handleRemoveFromCart
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<number | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);

  const promedio = products.resenias?.length
    ? products.resenias.reduce((sum, r) => sum + r.valoracion, 0) / products.resenias.length
    : 0;

  const { isSignedIn } = useUser();

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const showConfirmation = () => {
    setConfirmationOpen(true);
    setTimeout(() => setConfirmationOpen(false), 4000);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleAddFav = async () => {
    try {
      await handleAddFavorite?.(products._id);
      //   showSnackbar('Producto agregado a favoritos', 'success');
    } catch (error) {
      showSnackbar('Error al agregar a favoritos', 'error');
    }
  };

  const handleRemoveFav = async () => {
    try {
      await handleRemoveFavorite?.(products._id);
      //   showSnackbar('Producto removido de favoritos', 'success');
    } catch (error) {
      showSnackbar('Error al remover de favoritos', 'error');
    }
  };

  const handleOpenModal = () => {
    // Verificar si handleAddToCart está disponible antes de abrir el modal
    if (!handleAddToCart) {
      showSnackbar('Función de carrito no disponible', 'error');
      return;
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSize(null);
    setQuantity(1);
  };

  const handleIncreaseQuantity = () => {
    if (selectedSize !== null && products.stockPorTalla) {
      const sizeStock = products.stockPorTalla.find(item => item.talla === selectedSize);
      if (sizeStock && quantity < sizeStock.stock) {
        setQuantity(prev => prev + 1);
      } else {
        showSnackbar('No puedes agregar más de lo disponible en stock', 'error');
      }
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCartClick = async () => {
    if (selectedSize === null) {
      showSnackbar('Por favor selecciona una talla', 'error');
      return;
    }

    const sizeStock = products.stockPorTalla?.find(item => item.talla === selectedSize);
    if (!sizeStock || sizeStock.stock <= 0) {
      showSnackbar('Talla no disponible', 'error');
      return;
    }

    if (quantity <= 0 || quantity > sizeStock.stock) {
      showSnackbar('Cantidad no válida', 'error');
      return;
    }

    if (!handleAddToCart) {
      showSnackbar('Función de carrito no disponible', 'error');
      return;
    }

    try {
      await handleAddToCart(products._id, selectedSize.toString(), quantity);
      // showConfirmation();
      handleCloseModal();
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      showSnackbar('Error al agregar al carrito', 'error');
    }
  };

  const handleRemoveFromCartClick = async () => {
    if (!handleRemoveFromCart) return;

    try {
      await handleRemoveFromCart(products._id);
      showSnackbar('Producto removido del carrito', 'success');
    } catch (error) {
      showSnackbar('Error al remover del carrito', 'error');
    }
  };

  const hasStock = products.stockPorTalla?.some(item => item.stock > 0);
  const selectedSizeStock = selectedSize ? products.stockPorTalla?.find(item => item.talla === selectedSize)?.stock || 0 : 0;

  return (
    <Box sx={{ height: '100%' }}>


      <Card
        sx={{
          position: 'relative',
          height: '100%',
          '&:hover .add-to-cart-container': {
            opacity: 1,
            bottom: 0,
          },
        }}
      >
        {show && (
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
            {isSignedIn ? (
              <IconButton
                aria-label="add to favorites"
                onClick={markedFavorite ? handleRemoveFav : handleAddFav}
              >
                <FavoriteBorderIcon
                  sx={{
                    color: markedFavorite ? 'red' : 'inherit',
                    '&:hover': { color: 'red', cursor: 'pointer' },
                  }}
                />
              </IconButton>
            ) : (
              <SignInButton mode='modal'>
                <IconButton aria-label="add to favorites">
                  <FavoriteBorderIcon
                    sx={{
                      color: markedFavorite ? 'red' : 'inherit',
                      '&:hover': { color: 'red', cursor: 'pointer' },
                    }}
                  />
                </IconButton>
              </SignInButton>
            )}
          </Box>
        )}
        {products.isNewProduct && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 1,
              backgroundColor: 'primary.main', // verde
              color: 'white',
              px: 1.2,
              py: 0.3,
              fontSize: '0.75rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Nuevo
          </Box>
        )}
        <Link href={`/producto/${products._id}`} passHref>
          <CardMedia
            component="img"
            height="194"
            image={isHovered && products.images[1] ? products.images[1] : products.images[0]}
            alt={products.name}
            sx={{ objectFit: 'contain', transition: 'opacity 0.3s ease-in-out' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </Link>

        <CardContent sx={{ paddingBottom: '60px' }}>
          <Link href={`/marcas/${products.brand.name.toLowerCase()}`} passHref>
            <Typography variant="marcaCard" sx={{ color: 'text.primary', cursor: 'pointer' }}>
              {products.brand.name}
            </Typography>
          </Link>

          <Grid container spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Grid >
              <Link href={`/producto/${products._id}`} passHref>
                <Typography variant="nameCard" sx={{ color: 'text.primary', cursor: 'pointer' }}>
                  {products.name}
                </Typography>
              </Link>
            </Grid>
          </Grid>

          <Grid container spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
            <Grid >
              <Rating precision={0.5} value={promedio} readOnly />
            </Grid>
            <Grid >
              <Typography variant="reseniasCard" color="text.secondary">
                {products.resenias?.length ?? 0} reseñas
              </Typography>
            </Grid>
          </Grid>

          {products.descuento ? (
            <Box mt={2}>
              <Grid container spacing={1} alignItems="center">
                <Grid >
                  <Typography variant="priceCard" sx={{ color: 'text.primary' }}>
                    S/ {products.price}
                  </Typography>
                </Grid>
                <Grid  sx={{ backgroundColor: 'red', borderRadius: '6px', px: 1 }}>
                  <Typography variant="marcaDetail" sx={{ color: 'white', fontWeight: 'bold' }}>
                    -{products.descuento}%
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="body2" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                S/ {(products.price + (products.price * products.descuento) / 100).toFixed(2)}
              </Typography>
            </Box>
          ) : (
            <Typography variant="h6" sx={{ color: 'text.primary', mt: 2 }}>
              S/ {products.price}
            </Typography>
          )}
        </CardContent>

        <Box
          className="add-to-cart-container"
          sx={{
            position: 'absolute',
            bottom: '-50px',
            left: 0,
            right: 0,
            opacity: 0,
            transition: 'all 0.3s ease',
            p: 1,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center'
          }}
        >
          <Button
            variant="contained"
            color={isInCart ? 'error' : 'primary'}
            onClick={isInCart ? handleRemoveFromCartClick : handleOpenModal}
            disabled={!hasStock || (!handleAddToCart && !isInCart)}
            startIcon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 'medium',
              backgroundColor: isInCart ? undefined : '#7950f2',
              '&:hover': {
                backgroundColor: isInCart ? undefined : '#6a40e0'
              },
              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e'
              }
            }}
          >
            {!hasStock ? 'Agotado' : isInCart ? 'Quitar del carro' : 'Añadir al carro'}
          </Button>
        </Box>
      </Card>

      {/* Modal mejorado y responsive */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '85%', md: '650px' },
          maxWidth: '650px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: '12px',
          maxHeight: '90vh',
          overflowY: 'auto',
          p: { xs: 2, sm: 3 }
        }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.primary',
              zIndex: 1
            }}
          >
            <CloseIcon />
          </IconButton>

          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid size={{xs:12, sm:4, md:4}}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: { xs: '200px', sm: '100%' }
              }}>
                <CardMedia
                  component="img"
                  image={products.images[0]}
                  alt={products.name}
                  sx={{
                    maxHeight: { xs: '180px', sm: '200px' },
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{xs:12, sm:8, md:8}} >
              <Box sx={{ mb: 1, pr: { xs: 0, sm: 4 }, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="marcaDetail" sx={{ fontWeight: 'bold' }}>
                  {products.brand.name}
                </Typography>
                <Typography variant="nameDetail" >
                  {products.name}
                </Typography>
                {products.descuento ? (
                  <Box >
                    <Grid container spacing={1} alignItems="center">
                      <Grid >
                        <Typography variant="h6" sx={{ color: 'text.primary' }}>
                          S/ {products.price}
                        </Typography>
                      </Grid>
                      <Grid  sx={{ backgroundColor: 'red', borderRadius: '6px', px: 1 }}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                          -{products.descuento}%
                        </Typography>
                      </Grid>
                    </Grid>
                    <Typography variant="body2" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                      S/ {(products.price + (products.price * products.descuento) / 100).toFixed(2)}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="h6" sx={{ color: 'text.primary', mt: 2 }}>
                    S/ {products.price}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 2}}>
                <Box sx={{mb:1}}> 
                  <Typography variant="navbar" sx={{ fontWeight: 'bold'}}>
                    Selecciona tu talla
                  </Typography>
                </Box>
                <Grid container spacing={1}>
                  {products.stockPorTalla?.map(({ talla, stock }) => (
                    <Grid  key={talla} size={{xs:4, sm:3, md:3}} >
                      <Button
                        variant={selectedSize === talla ? 'contained' : 'outlined'}
                        onClick={() => {
                          setSelectedSize(talla);
                          setQuantity(1);
                        }}
                        disabled={stock <= 0}
                        sx={{
                          width: '100%',
                          height: { xs: '45px', sm: '50px' },
                          position: 'relative',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5
                        }}
                      >
                        <span>{talla}</span>
                        {stock > 0 && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: { xs: '0.6rem', sm: '0.65rem' },
                              color: selectedSize === talla ? 'white' : 'text.secondary',
                              lineHeight: 1
                            }}
                          >
                            Stock: {stock}
                          </Typography>
                        )}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                {selectedSize && (
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={`Stock disponible: ${selectedSizeStock} unidades`}
                      color="info"
                      size="small"
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, color:'white' }}
                    />
                  </Box>
                )}
              </Box>

              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant='yapeSteps' sx={{ fontWeight: 'bold' }}>
                  Cantidad:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <IconButton
                    size="small"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    sx={{ p: { xs: 0.5, sm: 0.75 } }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography variant='yapeSteps' sx={{ mx: { xs: 1, sm: 2 }, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleIncreaseQuantity}
                    disabled={
                      selectedSize === null ||
                      !products.stockPorTalla ||
                      quantity >= selectedSizeStock
                    }
                    sx={{ p: { xs: 0.5, sm: 0.75 } }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleAddToCartClick}
                disabled={
                  selectedSize === null ||
                  !products.stockPorTalla ||
                  quantity <= 0 ||
                  quantity > selectedSizeStock ||
                  !handleAddToCart
                }
              >
                Añadir al carrito
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductCard;