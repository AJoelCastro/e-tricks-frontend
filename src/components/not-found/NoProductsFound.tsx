import { Box, Typography, Button } from '@mui/material';

const NoProductsFound = ({ onReset }: { onReset?: () => void }) => {
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
      }}
    >
      <img
        src="https://tricks-bucket.s3.us-east-2.amazonaws.com/loading.svg"
        alt="No se encontraron productos"
        style={{ maxWidth: 400, marginBottom: 24 }}
      />

      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3f3f40ff' }}>
        No se encontraron productos
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, color: '#666', maxWidth: 400 }}>
        Parece que no hay productos disponibles para esta categoría. Intenta modificar tus filtros o vuelve más tarde.
      </Typography>

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

export default NoProductsFound;
