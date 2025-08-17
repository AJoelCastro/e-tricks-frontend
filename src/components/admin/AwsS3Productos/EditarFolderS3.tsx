'use client';

import { useAuth } from '@clerk/nextjs';
import AWSService from '@/services/AWS';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const EditFolderComponent = () => {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const folderName = decodeURIComponent(params.folderName as string);

  const [newName, setNewName] = useState(folderName);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);

  // Obtener imágenes al cargar
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = await getToken();
        const data = await AWSService.getFolderDetails(token!, folderName);
        setImages(data.images || []);
      } catch (error) {
        console.error('Error al obtener imágenes:', error);
      }
    };
    fetchImages();
  }, [folderName, getToken]);

  // Renombrar carpeta
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      await AWSService.renameFolder(token!, folderName, newName);
      router.push(`/admin/productosS3/${encodeURIComponent(newName)}/detalle`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar imagen
  const handleDeleteImage = async (fileName: string) => {
    try {
      setLoadingDelete(fileName);
      const token = await getToken();
      await AWSService.deleteProductImage(token!, folderName, fileName);

      // actualizar lista local sin recargar
      setImages((prev) => prev.filter((img) => img !== fileName));
    } catch (error) {
      console.error('Error eliminando imagen:', error);
    } finally {
      setLoadingDelete(null);
    }
  };

  return (
    <Box p={3}>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="h5" mb={2}>
                Editar carpeta: {folderName}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={loading}
                sx={{ mb: 3 }}
            >
                {loading ? <CircularProgress size={20} /> : 'Guardar cambios'}
            </Button>
        </Box>
        <TextField
            label="Nuevo nombre"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mb: 2 }}
        />
      <Typography variant="h6" mb={2}>
        Imágenes en la carpeta
      </Typography>

      <Grid container spacing={2}>
        {images.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No hay imágenes en esta carpeta.
          </Typography>
        )}

        {images.map((fileName) => (
          <Grid key={fileName} size={{ xs: 6, sm: 4, md: 3 }}>
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: 2,
                p: 1,
                position: 'relative',
              }}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_AWS_BASE_URL}/productos/${folderName}/${fileName}`}
                alt={fileName}
                style={{ width: '100%', borderRadius: 8 }}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteImage(fileName)}
                sx={{ position: 'absolute', top: 5, right: 5 }}
              >
                {loadingDelete === fileName ? (
                  <CircularProgress size={20} />
                ) : (
                  <DeleteIcon />
                )}
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default EditFolderComponent;
