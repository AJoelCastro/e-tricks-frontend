'use client';

import { useAuth } from '@clerk/nextjs';
import AWSService from '@/services/AWS';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress
} from '@mui/material';

interface IImage {
  fileName: string;
  signedUrl: string;
  size: number;
  lastModified: string;
}

const FolderDetailComponent = () => {
  const { getToken } = useAuth();
  const params = useParams();
  const folderName = decodeURIComponent(params.folderName as string);
  const [images, setImages] = useState<IImage[]>([]);
  const [loading, setLoading] = useState(true);

  const getFolderDetails = async () => {
    try {
      const token = await getToken();
      const response = await AWSService.getFolderDetails(token!, folderName);
      setImages(response.images);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFolderDetails();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Detalle de carpeta: {folderName}
      </Typography>
      <Grid container spacing={2}>
        {images.map((img) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={img.fileName}>
            <Card sx={{ borderRadius: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={img.signedUrl}
                alt={img.fileName}
              />
              <CardContent>
                <Typography noWrap>{img.fileName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(img.size / 1024)} KB
                </Typography>
                <Typography variant="caption" display="block">
                  {new Date(img.lastModified).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FolderDetailComponent;
