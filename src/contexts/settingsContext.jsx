'use client';

import { createContext } from 'react';
import { THEMES } from '@/utils/constants';
import useLocalStorage from '@/hooks/useLocalStorage';

// ==============================================================

// ==============================================================

const initialSettings = {
  direction: 'ltr',
  theme: THEMES.LIGHT, // Siempre tema claro
  activeLayout: 'layout1',
  responsiveFontSizes: true
};
export const SettingsContext = createContext({});
export default function SettingsProvider({
  children
}) {
  const storage = useLocalStorage('settings', initialSettings);
  const {
    data: settings,
    storeData: setStoreSettings
  } = storage;
  
  // Forzar siempre el tema claro
  if (settings.theme !== THEMES.LIGHT) {
    setStoreSettings({
      ...settings,
      theme: THEMES.LIGHT
    });
  }
  
  const saveSettings = updateSettings => {
    // Asegurar que el tema siempre sea claro
    const newSettings = {
      ...updateSettings,
      theme: THEMES.LIGHT
    };
    setStoreSettings(newSettings);
  };
  
  return <SettingsContext.Provider value={{
    settings: {
      ...settings,
      theme: THEMES.LIGHT // Forzar tema claro en el contexto
    },
    saveSettings
  }}>{children}</SettingsContext.Provider>;
}