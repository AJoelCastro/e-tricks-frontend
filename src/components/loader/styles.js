import { styled, keyframes } from '@mui/material/styles';

// KEYFRAME CSS ANIMATION
const loader = keyframes`
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }`;

// STYLED COMPONENT
export const RootStyle = styled('div')(({
  theme
}) => ({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'grid',
  position: 'fixed',
  placeItems: 'center',
  backgroundColor: theme.palette.background.default,
  '.loading-content': {
    width: 170,
    height: 170,
    borderRadius: '50%',
    position: 'relative',
    border: '5px solid transparent',
    borderTopColor: theme.palette.primary[300],
    borderBottomColor: theme.palette.primary[300],
    animation: `${loader} 2s linear infinite`,
    '&:after': {
      inset: 15,
      content: "''",
      position: 'absolute',
      border: '5px solid transparent',
      borderTopColor: theme.palette.primary[100],
      borderBottomColor: theme.palette.primary[100],
      animation: `${loader} 1.5s linear infinite`,
      borderRadius: '50%'
    },
    '&:before': {
      inset: 5,
      content: "''",
      borderRadius: '50%',
      position: 'absolute',
      border: '5px solid transparent',
      borderTopColor: theme.palette.primary[200],
      borderBottomColor: theme.palette.primary[200],
      animation: `${loader} 3s linear infinite`
    }
  },
  '.logo': {
    inset: 0,
    width: 90,
    height: 90,
    margin: 'auto',
    display: 'grid',
    borderRadius: '50%',
    placeItems: 'center',
    position: 'absolute',
    img: {
      width: '100%',
      height: '100%'
    }
  }
}));