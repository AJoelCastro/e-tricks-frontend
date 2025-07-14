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
          <SectionTitle centered title="Page Not Found!" />

          <Typography variant="body1" fontSize={18} color="text.secondary">
            Whoops! It seems like we've unplugged this page by accident. 🔌🙈
            <br />
            <br /> <strong>#404NotFound</strong>
          </Typography>

          <div className="img-wrapper">
            <img src="/static/pages/error.svg" alt="error" width="100%" />
          </div>

          <Button size="large" LinkComponent={Link} href="/">
            Go Home
          </Button>
        </MainContent>
      </Container>
    </GradientBackground>;
}