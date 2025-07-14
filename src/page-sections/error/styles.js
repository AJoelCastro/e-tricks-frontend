import { styled } from '@mui/material/styles';
export const MainContent = styled('div')(({
  theme
}) => ({
  textAlign: 'center',
  paddingBlock: '3rem',
  '& .img-wrapper': {
    maxWidth: 500,
    margin: 'auto',
    paddingBlock: '5rem',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 300,
      paddingBlock: '3rem'
    }
  }
}));