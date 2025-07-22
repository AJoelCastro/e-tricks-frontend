import * as React from 'react';
import {
  Box, Card, CardContent, CardMedia, Typography, IconButton,
  Grid, Rating, Modal, Button, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { IProduct } from '@/interfaces/Product';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

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
  const [selectedSize, setSelectedSize] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const promedio =
    products.resenias && products.resenias.length
      ? products.resenias.map(r => r.valoracion).reduce((a, b) => a + b, 0) / products.resenias.length
      : 0;

  const { isSignedIn } = useUser();
  const handleAddFav = React.useCallback(
    async () => {
      handleAddFavorite?.(products._id);
    },
    [handleAddFavorite, products._id],
  );

  const handleRemoveFav = React.useCallback(
    async () => {
      handleRemoveFavorite?.(products._id);
    },
    [handleRemoveFavorite, products._id],
  );

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSize('');
    setQuantity(1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCartClick = async () => {
    if (selectedSize && handleAddToCart) {
      await handleAddToCart(products._id, selectedSize, quantity);
      handleCloseModal();
    }
  };

  const handleRemoveFromCartClick = async () => {
    if (handleRemoveFromCart) {
      await handleRemoveFromCart(products._id);
    }
  };

  return (
    <Box sx={{ height: '100%'}}>
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
        {
          show && (
            <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
              {
                isSignedIn ? (
                  <IconButton aria-label="add to favorites" onClick={() => {
                    if (markedFavorite) {
                      handleRemoveFav();
                    } else {
                      handleAddFav();
                    }
                  }}>
                    <FavoriteBorderIcon
                      sx={{
                        color: markedFavorite ? 'red' : 'inherit',
                        '&:hover': {
                          color: 'red',
                          cursor: 'pointer',
                        },
                      }}
                    />
                  </IconButton>
                ) : (
                  <SignInButton mode='modal'>
                    <button className='px-2'>
                      <FavoriteBorderIcon
                        sx={{
                          color: markedFavorite ? 'red' : 'inherit',
                          '&:hover': {
                            color: 'red',
                            cursor: 'pointer',
                          },
                        }}
                      />
                    </button>
                  </SignInButton>
                )
              }
            </Box>
          )
        }

        <Link href={`/product/${products._id}`}>
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
          <Link href={`/marcas/${products.brand.name.toLowerCase()}`}>
            <Typography variant="marcaCard" sx={{ color: 'text.primary' }}>
              {products.brand.name}
            </Typography>
          </Link>
          <Grid container spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Grid >
              <Link href={`/product/${products._id}`}>
                <Typography variant="nameCard" sx={{ color: 'text.primary' }}>
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
              <Typography variant="reseniasCard" color="text.secondary" >
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
                <Grid sx={{ backgroundColor: 'red', borderRadius: '6px', px: 1 }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                    -{products.descuento}%
                  </Typography>
                </Grid>
              </Grid>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'line-through',
                  fontSize: '12px',
                }}
              >
                S/ {products.price + (products.price * products.descuento) / 100}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: 'text.primary', mt: 2 }}>
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
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
              backgroundColor: isInCart ? '#f44336' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isInCart ? '#d32f2f' : '#3d8b40';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isInCart ? '#f44336' : '#4CAF50';
            }}
            onClick={isInCart ? handleRemoveFromCartClick : handleOpenModal}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginRight: '8px' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {isInCart ? 'Quitar del carro' : 'Añadir al carro'}
          </button>
        </Box>
      </Card>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="size-selection-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '85%', md: '650px' },
          maxWidth: '650px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: '8px',
          maxHeight: '90vh',
          overflowY: 'auto',
          p: 3
        }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.primary'
            }}
          >
            <CloseIcon />
          </IconButton>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4}}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}>
                <CardMedia
                  component="img"
                  image={products.images[0]}
                  alt={products.name}
                  sx={{
                    maxHeight: '180px',
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 8 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  {products.brand.name}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {products.name}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                  S/ {products.price}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{
                  fontWeight: 'bold',
                  mb: 1.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Tallas
                </Typography>
                <Grid container spacing={1}>
                  {products.stockPorTalla && Object.keys(products.stockPorTalla).map((size) => (
                    <Grid key={size}>
                      <Button
                        variant={selectedSize === size ? 'contained' : 'outlined'}
                        onClick={() => setSelectedSize(size)}
                        sx={{
                          minWidth: 0,
                          width: '70px',
                          py: 1,
                          borderRadius: '4px',
                          border: '1px solid',
                          borderColor: selectedSize === size ? 'primary.main' : 'divider',
                          color: selectedSize === size ? 'white' : 'text.primary',
                          '&:hover': {
                            borderColor: 'primary.main',
                          }
                        }}
                      >
                        {size}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>

  
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                justifyContent: 'space-between',
                maxWidth: '200px'
              }}>
                <Typography variant="subtitle2" sx={{
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Cantidad
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <IconButton
                    size="small"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '4px 0 0 4px'
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{
                    px: 2,
                    borderTop: '1px solid',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleIncreaseQuantity}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '0 4px 4px 0'
                    }}
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
                disabled={!selectedSize}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  backgroundColor: '#4CAF50',
                  '&:hover': {
                    backgroundColor: '#3d8b40',
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#9e9e9e'
                  }
                }}
              >
                Añadir al carro - S/ {(products.price * quantity).toFixed(2)}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductCard;