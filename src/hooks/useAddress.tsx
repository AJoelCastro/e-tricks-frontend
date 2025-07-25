import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useCart } from '../page-sections/cart/CartContext';
import UserService from '@/services/UserService';
import { IAddress } from '@/interfaces/Address';
import { IPickUp } from '@/interfaces/PickUp';

interface UseAddressReturn {
  selectedAddress: IAddress | null;
  deliveryType: 'pickup' | 'address' | null;
  addresses: IAddress[];
  pickUps: IPickUp[];
  isLoading: boolean;
  error: string | null;
}

export const useAddress = (addressId?: string | null, type?: string | null): UseAddressReturn => {
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'address' | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [pickUps, setPickUps] = useState<IPickUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();
  const { pickUps: contextPickUps } = useCart();

  useEffect(() => {
    const loadAddressData = async () => {
      if (!addressId || !type) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const token = await getToken();
        if (!token) {
          throw new Error('No se pudo obtener el token de autenticación');
        }

        // Para direcciones de domicilio
        if (type === 'address') {
          const userData = await UserService.getUserByUserId(token, 'current-user-id');
          const userAddresses = userData.data.addresses || [];
          setAddresses(userAddresses);
          
          const address = userAddresses.find((addr: IAddress) => addr._id === addressId);
          if (address) {
            setSelectedAddress(address);
            setDeliveryType('address');
          }
        }
        
        // Para pickups
        else if (type === 'pickup') {
          setPickUps(contextPickUps);
          const pickup = contextPickUps.find((p: IPickUp) => p._id === addressId);
          
          if (pickup) {
            // Convertir pickup a formato IAddress para consistencia
            const pickupAsAddress: IAddress = {
              _id: pickup._id,
              name: `${pickup.city} - ${pickup.cc}`,
              street: pickup.address,
              number: pickup.stand,
              city: pickup.city,
              state: pickup.cc,
              zipCode: '',
              country: 'Perú',
              phone: pickup.contactNumber
            };
            
            setSelectedAddress(pickupAsAddress);
            setDeliveryType('pickup');
          }
        }
      } catch (err) {
        console.error('Error loading address data:', err);
        setError(err instanceof Error ? err.message : 'Error cargando dirección');
      } finally {
        setIsLoading(false);
      }
    };

    loadAddressData();
  }, [addressId, type, getToken, contextPickUps]);

  return {
    selectedAddress,
    deliveryType,
    addresses,
    pickUps,
    isLoading,
    error
  };
};