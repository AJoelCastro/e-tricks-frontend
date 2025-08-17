'use client';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { useAuth } from '@clerk/nextjs';
import AWSService from '@/services/AWS';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // para refrescar la lista de carpetas al terminar
}

const CreateFolderDialog: React.FC<Props> = ({ open, onClose, onSuccess }) => {
    const { getToken } = useAuth();
    const [folderName, setFolderName] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!open) {
            setFolderName('');
            setFiles([]);
        }
    }, [open]);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        setFiles(Array.from(e.target.files));
        }
    };

    const handleCreate = async () => {
        if (!folderName || files.length === 0) {
        alert("Debes ingresar un nombre y al menos una imagen");
        return;
        }
        try {
        setLoading(true);
        const token = await getToken();
        await AWSService.createFolder(token!, folderName, files);
        onSuccess();
        onClose();
        } catch (error) {
        alert("Error al crear carpeta");
        } finally {
        setLoading(false);
        }
    };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear nueva carpeta de producto</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nombre de la carpeta"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" component="label">
            Seleccionar imágenes
            <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
          </Button>
          {files.length > 0 && (
            <Typography variant="body2">{files.length} archivo(s) seleccionado(s)</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button onClick={handleCreate} variant="contained" disabled={loading}>
          {loading ? "Subiendo..." : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderDialog;
