import { styled } from '@mui/material/styles';
const lightGradient = 'radial-gradient(circle at 90% 0%,rgba(249, 193, 250, 0.5), rgba(149,176,249,0) 50%), radial-gradient(circle at 0% 90%, rgba(217, 211, 248, 0.6), rgba(217, 211, 248, 0.2) 50%)';
const darkGradient = 'radial-gradient(circle at 90% 0%, rgba(249, 193, 250, 0.2), rgba(31, 41, 55, 0.2) 50%), radial-gradient(circle at 0% 90%, rgba(217, 211, 248, 0.2), rgba(31, 41, 55, 0.2) 50%)';
export const StyledRoot = styled('div')(({
  theme
}) => ({
  minHeight: '100vh',
  background: lightGradient,
  ...theme.applyStyles('dark', {
    background: darkGradient
  })
}));