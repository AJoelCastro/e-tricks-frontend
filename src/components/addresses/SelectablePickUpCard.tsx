'use client';

import React from 'react';
import {
  Box,
  Card,
  Typography,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { IPickUp } from '@/interfaces/PickUp';

type Props = {
  address: IPickUp;
  selected: boolean;
  onSelect: () => void;
  isPickup?: boolean;
};

const SelectablePickUpCard: React.FC<Props> = ({ address, selected, onSelect, isPickup = false }) => {
  return (
    <Card
      onClick={onSelect}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: 3,
        border: selected ? '2px solid #7c3aed' : '1px solid #e0e0e0',
        boxShadow: selected ? 4 : 1,
        transition: 'all 0.2s ease-in-out',
        backgroundColor: isPickup ? '#f9f9ff' : 'white',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 5,
        },
        width: '100%',
        maxWidth: '800px',
        marginX: 'auto',
      }}
    >
      {/* Icono + Nombre */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <LocationOnIcon sx={{ color: '#7c3aed', fontSize: 26 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          C.C. {address.cc}
        </Typography>
      </Box>

      {/* Línea divisoria vertical */}
      <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

      {/* Información */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Stand:</strong> {address.stand}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Ciudad:</strong> {address.city}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Dirección:</strong> {address.address}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Tel:</strong> {address.contactNumber}
        </Typography>
      </Box>
    </Card>
  );
};

export default SelectablePickUpCard;
