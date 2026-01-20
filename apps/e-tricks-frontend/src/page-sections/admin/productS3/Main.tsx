'use client';

import LeftSideAdmin from '@/components/admin/LeftSideAdmin'
import NavbarComponent from '@/components/principal/NavbarComponent'
import AWSService from '@/services/AWS';
import CreateFolderDialog from '@/components/admin/CreateFolderDialog';
import { useAuth } from '@clerk/nextjs';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress
} from '@mui/material'
import { Edit, Delete, Info, Add } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

interface IFolder {
  folderName: string;
}

const MainProductS3PageSection = () => {
    const [folders, setFolders] = useState<IFolder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<IFolder | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [editName, setEditName] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const router = useRouter();
    const { getToken } = useAuth();

    const getFolders = async () => {
        try {
        setLoading(true);
        const token = await getToken();
        const response = await AWSService.getFolderNames(token!);
        setFolders(response.folders);
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        getFolders();
    }, []);

    const handleViewDetails = (folder: IFolder) => {
        setSelectedFolder(folder);
        router.push(`/admin/productosS3/${encodeURIComponent(folder.folderName)}/detalle`);
    };

    const handleEditClick = (folder: IFolder) => {
        setSelectedFolder(folder);
        router.push(`/admin/productosS3/${encodeURIComponent(folder.folderName)}/editar`);
    };

    const handleDeleteClick = (folder: IFolder) => {
        setSelectedFolder(folder);
        setOpenDelete(true);
    };

    const handleConfirmDelete = async () => {
        try {
        if (!selectedFolder) return;
        setLoadingDelete(true);
        const token = await getToken();
        await AWSService.deleteFolder(token!, selectedFolder.folderName);
        setOpenDelete(false);
        getFolders();
        } catch (error) {
        console.error(error);
        } finally {
        setLoadingDelete(false);
        }
    };

    return (
        <>
        <NavbarComponent />
        <Box sx={{ height: '64px' }} />
        <Grid container spacing={1} >
            <Grid size={{ xs: 12, sm: 5, md: 3 }}>
                <LeftSideAdmin />
            </Grid>
            <Grid size={{ xs: 12, sm: 7, md: 9 }}>
            <Box p={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Carpetas de Productos</Typography>
                    <Button
                        startIcon={<Add />}
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                    >
                        Agregar
                    </Button>
                </Box>

                {/* Loader general */}
                {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
                ) : (
                <Grid container spacing={2}>
                    {folders.map((folder) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={folder.folderName}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            >
                            <Typography variant="subtitle1" noWrap>
                                {folder.folderName}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <IconButton
                                color="primary"
                                onClick={() => handleViewDetails(folder)}
                                >
                                <Info />
                                </IconButton>
                                <IconButton
                                color="primary"
                                onClick={() => handleEditClick(folder)}
                                >
                                <Edit />
                                </IconButton>
                                <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(folder)}
                                >
                                <Delete />
                                </IconButton>
                            </Stack>
                            </Stack>
                        </CardContent>
                        </Card>
                    </Grid>
                    ))}
                </Grid>
                )}
            </Box>
            </Grid>
        </Grid>

        {/* Modal Editar */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
            <DialogTitle>Editar carpeta</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                fullWidth
                margin="dense"
                label="Nuevo nombre"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
            </DialogActions>
        </Dialog>

        {/* Modal Eliminar */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
            <DialogTitle>Eliminar carpeta</DialogTitle>
            <DialogContent>
            <DialogContentText>
                ¿Estás seguro de eliminar la carpeta "{selectedFolder?.folderName}"?
                Esta acción eliminará también sus imágenes en S3.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
            <Button
                color="error"
                variant="contained"
                onClick={handleConfirmDelete}
                disabled={loadingDelete}
            >
                {loadingDelete ? <CircularProgress size={24} color="inherit" /> : 'Eliminar'}
            </Button>
            </DialogActions>
        </Dialog>
        {/* Dialog para subir imágenes */}
        <CreateFolderDialog 
            open={openDialog} 
            onClose={() => setOpenDialog(false)} 
            onSuccess={getFolders} 
        />
        </>
    );
};

export default MainProductS3PageSection;
