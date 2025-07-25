'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
} from '@mui/material';
import { IAddress } from '@/interfaces/Address';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StoreIcon from '@mui/icons-material/Store';

type Props = {
  address: IAddress;
  selected: boolean;
  onSelect: () => void;
  isPickup?: boolean; // <- nueva prop
};

const SelectableAddressCard: React.FC<Props> = ({ address, selected, onSelect, isPickup = false }) => {
  return (
    <Card
      onClick={onSelect}
      sx={{
        height: '100%',
        position: 'relative',
        border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        cursor: 'pointer',
        boxShadow: selected ? 3 : 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
        },
        p: 1,
        backgroundColor: isPickup ? '#fbfbfbff' : 'white', // azul suave si es pickup
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {isPickup ? (
            <StoreIcon sx={{ color: '#1976d2' }} />
          ) : (
            <LocationOnIcon color="primary" />
          )}
          <Typography variant="h6" component="div">
            {address.name}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body1" gutterBottom>
          {address.street} {address.number}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {address.city}, {address.state}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {address.zipCode}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {address.country}
        </Typography>

        {!isPickup && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tel: {address.phone}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectableAddressCard;
