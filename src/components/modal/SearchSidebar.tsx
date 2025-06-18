'use client';
import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  IconButton,
  InputBase,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const SearchSidebar = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const quickLinks = ['Outlet', 'Nuevo', 'Sigue tu pedido', 'Tiendas'];

  const suggestedProducts = [/* tu array de productos igual */];

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', md: 600 },
          maxWidth: '100%',
          p: 2,
        },
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Box flex={1} display="flex" alignItems="center" px={1} py={0.5} sx={{ backgroundColor: '#f3f4f6', borderRadius: 1 }}>
          <SearchIcon color="action" sx={{ mr: 1 }} />
          <InputBase
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            autoFocus
          />
        </Box>
        <IconButton onClick={handleClose} sx={{ ml: 1 }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box display="flex" mt={2}>
        <Box flex="1 1 30%" pr={2}>
          <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
            Enlaces Rápidos
          </Typography>
          <List dense>
            {quickLinks.map((link) => (
              <ListItemButton key={link} onClick={() => { console.log('Navegando a:', link); handleClose(); }}>
                <ListItemText primary={link} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Box flex="1 1 70%" pl={2} overflow="auto">
          <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
            Productos Sugeridos
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))" gap={2}>
            {suggestedProducts.map((product) => (
              <Box
                key={product.id}
                onClick={() => { console.log('Producto seleccionado:', product.name); handleClose(); }}
                sx={{
                  border: 1,
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 2 },
                }}
              >
                <Box sx={{ width: '100%', pt: '100%', bgcolor: 'grey.100', borderRadius: 1, mb: 1 }} />
                <Typography variant="caption" color="text.secondary" display="block">
                  {product.brand}
                </Typography>
                <Typography variant="body2" noWrap title={product.name}>
                  {product.name}
                </Typography>
                {product.originalPrice && (
                  <Box display="flex" alignItems="center">
                    <Typography variant="caption" color="text.disabled" sx={{ textDecoration: 'line-through', mr: 1 }}>
                      {product.currency} {product.originalPrice}
                    </Typography>
                    {product.discount && (
                      <Typography variant="caption" color="error" sx={{ bgcolor: 'error.main', color: '#fff', px: 0.5, borderRadius: 1 }}>
                        {product.discount}
                      </Typography>
                    )}
                  </Box>
                )}
                <Typography variant="subtitle1" color="error">
                  {product.currency} {product.price}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SearchSidebar;
