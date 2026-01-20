import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

const NoFavoritesFound = ({ onReset }: { onReset?: () => void }) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 2,
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
      
    >
      <img
        src="https://tricks-bucket.s3.us-east-2.amazonaws.com/favorites.svg"
        alt="No se encontraron productos"
        style={{ maxWidth: 250, marginBottom: 24 }}
      />

      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3f3f40ff' }}>
        No se encontraron favoritos agregados
      </Typography>
      <Link href={'/'}>
        <Typography variant="body1" sx={{ mt: 1, color: '#666', maxWidth: 400 }}>
            Ir a la sección de productos para registrar favoritos.
        </Typography>
      </Link>      
      

      {onReset && (
        <Button
          variant="contained"
          sx={{ mt: 3, backgroundColor: '#3f3f40ff' }}
          onClick={onReset}
        >
          Restablecer filtros
        </Button>
      )}
    </Box>
  );
};

export default NoFavoritesFound;
