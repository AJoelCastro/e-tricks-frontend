// theme/create-theme.ts
import { createTheme } from '@mui/material/styles';

// ► tu fuente Google Font (next/font)
import { montserrat } from '@/utils/font';

// ► paleta de colores clara que ya definiste
import { lightPalette } from './colors';

// ► sombras y overrides existentes
import shadows from './shadows';

const theme = createTheme({
  palette: lightPalette,      // #fff, primarios, etc.
  direction: 'ltr',           // fijo, sin settings
  typography: {
    fontFamily: montserrat.style.fontFamily,
    body1: { fontSize: 16 },
    body2: { fontSize: 14 },
    h1: { fontSize: 48, fontWeight: 700, lineHeight: 1.5 },
    h2: { fontSize: 40, fontWeight: 600, lineHeight: 1.5 },
    h3: { fontSize: 36, fontWeight: 700, lineHeight: 1.5 },
    h4: { fontSize: 32, fontWeight: 600 },
    h5: { fontSize: 28, fontWeight: 600, lineHeight: 1 },
    hEspecial: { fontSize: 24, fontWeight: 550, lineHeight: 1 },
    h6: { fontSize: 18, fontWeight: 500 },
    h7: { fontSize: 14, fontWeight: 500 },
    marcaCard: { fontSize: 12, fontWeight: 600 },
    nameCard: { fontSize: 20, fontWeight: 500 },
    reseniasCard: { fontSize: 13, fontWeight: 500 },
    priceCard: { fontSize: 17, fontWeight: 500 },
    marcaDetail: { fontSize: 13, fontWeight: 600 },
    nameDetail: { fontSize: 22, fontWeight: 500 },
    reseniasDetail: { fontSize: 13, fontWeight: 500 },
    priceDetail: { fontSize: 19, fontWeight: 500 },
    navbar: { fontSize: 14, fontWeight: 600, lineHeight: 1 },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
});

// ► aplicamos tus personalizaciones
theme.shadows = shadows(theme);

export default theme;
