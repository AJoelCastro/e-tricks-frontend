import { createTheme } from '@mui/material/styles';
// THEME SHADOWS LIST
import shadows from './shadows';
// MUI COMPONENTS OVERRIDE
import componentsOverride from './components';
// LIGHT & DARK THEME OPTIONS
import themesOptions from './themeOptions';
// CUSTOM HELPERS
import { merge } from '@/utils/helpers';
import { THEMES } from '@/utils/constants';
// INTER FONTS
import { publicSans } from '@/utils/font';
const baseOptions = {
  direction: 'ltr',
  typography: {
    fontFamily: publicSans.style.fontFamily,
    body1: {
      fontSize: 16
    },
    body2: {
      fontSize: 14
    },
    h1: {
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.5
    },
    h2: {
      fontSize: 40,
      fontWeight: 700,
      lineHeight: 1.5
    },
    h3: {
      fontSize: 36,
      fontWeight: 700,
      lineHeight: 1.5
    },
    h4: {
      fontSize: 32,
      fontWeight: 600
    },
    h5: {
      fontSize: 28,
      fontWeight: 600,
      lineHeight: 1
    },
    h6: {
      fontSize: 18,
      fontWeight: 500
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
};

// ==============================================================

// ==============================================================

export const createCustomTheme = settings => {
  /**
   * settings.theme value is 'light' or 'dark'
   * update settings in contexts/settingsContext.tsx
   */
  let themeOption = themesOptions[settings.theme];
  if (!themeOption) {
    themeOption = themesOptions[THEMES.LIGHT];
  }
  const mergedThemeOptions = merge({}, baseOptions, themeOption, {
    direction: settings.direction
  });
  const theme = createTheme(mergedThemeOptions);

  // OVERRIDE SHADOWS
  theme.shadows = shadows(theme);

  // OVERRIDE COMPONENTS
  theme.components = componentsOverride(theme);
  return theme;
};