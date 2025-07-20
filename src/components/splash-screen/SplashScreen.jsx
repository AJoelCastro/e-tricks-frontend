'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// STYLED COMPONENT
import { GradientBox, RootStyle } from './styles';
export default function SplashScreen() {
  return <RootStyle>
      <GradientBox>
        <Box p={4} zIndex={1} width={150} height={150} component={Card} borderRadius="50%" position="relative" boxSizing="border-box">
          <Box component="img" src="https://tricks-bucket.s3.us-east-2.amazonaws.com/logos/logo_splashScreen.svg" alt="tricks" width="100%" />
        </Box>
      </GradientBox>
    </RootStyle>;
}