'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
// MUI THEME CREATION METHOD
import { createCustomTheme } from './create-theme';
// SITE SETTINGS CUSTOM DEFINED HOOK
import useSettings from '@/hooks/useSettings';
export default function CustomThemeProvider({
  children
}) {
  const {
    settings
  } = useSettings();
  const theme = createCustomTheme(settings);
  return <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </LocalizationProvider>;
}