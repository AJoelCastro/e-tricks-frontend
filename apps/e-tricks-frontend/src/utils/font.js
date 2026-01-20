import { Montserrat } from 'next/font/google';
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '500', '600', '700'],       // pesos que usarás
  style: ['normal', 'italic'], 
  display: 'swap'
});