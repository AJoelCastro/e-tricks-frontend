import { Comic_Neue } from 'next/font/google';
export const comicNeue = Comic_Neue({
  subsets: ['latin'],
  weight: ['300', '400', '700'], // <- debes especificarlos
  display: 'swap'
});