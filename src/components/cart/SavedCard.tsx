import { Box, Typography, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Image from "next/image";

interface SavedCardProps {
  last4: string;
  brandLogoUrl: string;
  selected: boolean;
  onSelect: () => void;
  onRemove?: () => void;
}

const SavedCard = ({ last4, brandLogoUrl, selected, onSelect, onRemove }: SavedCardProps) => {
  return (
    <Paper
      elevation={selected ? 4 : 1}
      onClick={onSelect}
      sx={{
        borderRadius: 2,
        p: 2,
        border: selected ? '2px solid #7950f2' : '1px solid #e0e0e0',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'relative',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Image src={brandLogoUrl} alt="card logo" width={32} height={32} />
        <Typography variant="leftside">
          Débito **** {last4}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton size="small" onClick={(e) => {
          e.stopPropagation(); // evitar que seleccione al hacer clic en cerrar
          onRemove?.();
        }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Advertencia */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
        <InfoOutlinedIcon fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          Recuerda activar tu tarjeta para compras por internet desde la plataforma de tu banco.
        </Typography>
      </Box>
    </Paper>
  );
};

export default SavedCard;
