'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
// MUI THEME CREATION METHOD
import theme from './create-theme';
// SITE SETTINGS CUSTOM DEFINED HOOK
export default function ThemeProvider1({
  children
}) {
  console.log("theme provider")
  return <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </LocalizationProvider>;
}