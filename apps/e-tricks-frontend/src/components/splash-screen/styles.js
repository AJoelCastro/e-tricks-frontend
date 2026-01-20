import { styled, keyframes } from '@mui/material/styles';

// KEYFRAME CSS ANIMATION
const animated = keyframes`
0% {
	background-position: 0 0;
}
50% {
  background-position: 400% 0%;
}
100% {
	background-position: 0 0;
}
`;

// STYLED COMPONENT
export const GradientBox = styled('div')(({
  theme
}) => {
  const color = `${theme.palette.primary[600]}, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.error.main}, ${theme.palette.primary[400]}`;
  const COMMON_STYLE = {
    top: -2,
    left: -2,
    content: "''",
    borderRadius: '50%',
    background: `linear-gradient(45deg, ${color})`,
    position: 'absolute',
    backgroundSize: '300%',
    width: 'calc(100% + 4px)',
    height: 'calc(100% + 4px)',
    animation: `${animated} 20s linear infinite`
  };
  return {
    position: 'relative',
    ':before': {
      ...COMMON_STYLE
    },
    ':after': {
      ...COMMON_STYLE,
      filter: 'blur(30px)',
      opacity: 0.65
    }
  };
});
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
  backgroundColor: theme.palette.background.default
}));