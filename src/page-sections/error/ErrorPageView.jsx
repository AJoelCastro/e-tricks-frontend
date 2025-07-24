'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import Link from '@/components/link';
import SectionTitle from '@/components/section-title';
import GradientBackground from '@/components/gradient-background';
// STYLED COMPONENT
import { MainContent } from './styles';
export default function ErrorPageView() {
  return <GradientBackground>
      <Container>
        <MainContent>
          <SectionTitle centered title="Pagina no encontrada!" />

          <Typography variant="body1" fontSize={18} color="text.secondary">
            Oops! Parece que la p&aacute;gina que est&aacute;s buscando no existe 🔌🙈
            <br />
            <br /> <strong>#404NotFound</strong>
          </Typography>

          <div className="img-wrapper">
            <img src="/static/pages/error.svg" alt="error" width="100%" />
          </div>

          <Button size="large" LinkComponent={Link} href="/">
            Ir a inicio
          </Button>
        </MainContent>
      </Container>
    </GradientBackground>;
}