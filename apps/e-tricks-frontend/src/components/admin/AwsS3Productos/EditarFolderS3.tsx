'use client';

import { useAuth } from '@clerk/nextjs';
import AWSService from '@/services/AWS';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import Image from 'next/image';

interface ImageItem {
  fileName: string;
  key: string;
  url: string;
  signedUrl: string;
}

const EditFolderComponent = () => {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const folderName = decodeURIComponent(params.folderName as string);

  const [newName, setNewName] = useState(folderName);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
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
      setImages((prev) => prev.filter((img) => img.fileName !== fileName));
    } catch (error) {
      console.error('Error eliminando imagen:', error);
    } finally {
      setLoadingDelete(null);
    }
  };

  return (
    <Box p={3}>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Button
                variant="outlined"
                color="secondary"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
                sx={{ mb: 2, color: 'primary.main' }}
            >
                Volver
            </Button>
            
        </Box>
        <Typography variant="h5" mb={2}>
                Editar carpeta: {folderName}
            </Typography>
        {/* aqui la seccion del nombre */}
        <Grid container spacing={2} alignItems="center" mb={2}>
            <Grid size={{xs:12, md:6}}>
                <TextField
                fullWidth
                label="Nuevo nombre"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                />
            </Grid>
            <Grid size={{xs:12, md:"auto"}}>
                <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={loading}
                sx={{ height: '100%' }}
                >
                {loading ? <CircularProgress size={20} /> : 'Guardar cambios'}
                </Button>
            </Grid>
        </Grid>
        <Typography variant="h6" mb={2}>
            Imágenes en la carpeta
        </Typography>

        <Grid container spacing={2}>
            {images.length === 0 && (
            <Typography variant="body2" color="text.secondary">
                No hay imágenes en esta carpeta.
            </Typography>
            )}

            {images.map((img) => (
            <Grid key={img.fileName} size={{ xs: 6, sm: 6, md: 3 }}>
                <Box
                    sx={{
                        border: '1px solid #ddd',
                        borderRadius: 2,
                        p: 1,
                        position: 'relative',
                        height: { xs: 300, sm: 400, md: 500 },
                    }}
                >
                <Image
                    src={img.url}
                    alt={img.fileName}
                    fill
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                />
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteImage(img.fileName)}
                    sx={{ position: 'absolute', top: 5, right: 5 }}
                >
                    {loadingDelete === img.fileName ? (
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
