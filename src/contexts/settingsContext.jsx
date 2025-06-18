'use client';

import { createContext } from 'react';
import { THEMES } from '@/utils/constants';
import useLocalStorage from '@/hooks/useLocalStorage';

// ==============================================================

// ==============================================================

const initialSettings = {
  direction: 'ltr',
  theme: THEMES.LIGHT,
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
  const saveSettings = updateSettings => setStoreSettings(updateSettings);
  return <SettingsContext value={{
    settings,
    saveSettings
  }}>{children}</SettingsContext>;
}