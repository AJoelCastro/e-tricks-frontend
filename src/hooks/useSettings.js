import { use } from 'react';
import { SettingsContext } from '@/contexts/settingsContext';
export default function useSettings() {
  const context = use(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within an SettingsProvider');
  }
  return context;
}