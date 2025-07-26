// theme.d.ts o src/theme/theme.d.ts

import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    marcaCard: React.CSSProperties;
    nameCard: React.CSSProperties;
    reseniasCard: React.CSSProperties;
    priceCard: React.CSSProperties;
    marcaDetail: React.CSSProperties;
    nameDetail: React.CSSProperties;
    reseniasDetail: React.CSSProperties;
    priceDetail: React.CSSProperties;
    navbar: React.CSSProperties;
    leftside: React.CSSProperties;
    yapeSteps: React.CSSProperties;
    yapeTitle: React.CSSProperties;
    subtitleMain: React.CSSProperties;
    hEspecial: React.CSSProperties;
    h7: React.CSSProperties;
    sideBarSubCategories: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    marcaCard?: React.CSSProperties;
    nameCard?: React.CSSProperties;
    reseniasCard?: React.CSSProperties;
    priceCard?: React.CSSProperties;
    marcaDetail?: React.CSSProperties;
    nameDetail?: React.CSSProperties;
    reseniasDetail?: React.CSSProperties;
    priceDetail?: React.CSSProperties;
    navbar?: React.CSSProperties;
    leftside?: React.CSSProperties;
    yapeSteps?: React.CSSProperties;
    yapeTitle?: React.CSSProperties;
    subtitleMain?: React.CSSProperties;
    hEspecial?: React.CSSProperties;
    h7?: React.CSSProperties;
    sideBarSubCategories?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    marcaCard: true;
    nameCard: true;
    reseniasCard: true;
    priceCard: true;
    marcaDetail: true;
    nameDetail: true;
    reseniasDetail: true;
    priceDetail: true;
    navbar: true;
    leftside: true;
    yapeSteps: true;
    yapeTitle: true;
    subtitleMain: true;
    hEspecial: true;
    h7: true;
    sideBarSubCategories: true;
    productCategory: true;
  }
}
