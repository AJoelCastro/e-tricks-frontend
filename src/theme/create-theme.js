// theme/create-theme.ts
import { createTheme } from '@mui/material/styles';

// ► tu fuente Google Font (next/font)
import { comicNeue } from '@/utils/font';

// ► paleta de colores clara que ya definiste
import { lightPalette } from './colors';

// ► sombras y overrides existentes
import shadows from './shadows';

const theme = createTheme({
  palette: lightPalette,      // #fff, primarios, etc.
  direction: 'ltr',           // fijo, sin settings
  typography: {
    fontFamily: comicNeue.style.fontFamily,
    body1: { fontSize: 16 },
    body2: { fontSize: 14 },
    h1: { fontSize: 48, fontWeight: 700, lineHeight: 1.5 },
    h2: { fontSize: 40, fontWeight: 600, lineHeight: 1.5 },
    h3: { fontSize: 36, fontWeight: 700, lineHeight: 1.5 },
    h4: { fontSize: 32, fontWeight: 600 },
    h5: { fontSize: 28, fontWeight: 600, lineHeight: 1 },
    hEspecial: { fontSize: 24, fontWeight: 550, lineHeight: 1 },
    h6: { fontSize: 18, fontWeight: 500 },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
});

// ► aplicamos tus personalizaciones
theme.shadows = shadows(theme);

export default theme;
