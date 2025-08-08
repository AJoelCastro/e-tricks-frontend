import { Geist, Geist_Mono } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';

import Script from 'next/script'; // 👈 importa Script
import { GA_MEASUREMENT_ID } from '@/lib/gtag'; // 👈 importa tu ID

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Tricks Peru | Calzados y accesorios para mujer',
    template: '%s | Tricks Peru'
  },
  description: 'Descubre la mejor colección de calzados y accesorios para mujer en Tricks Peru. Productos de calidad, diseño y comodidad para el día a día.',
  keywords: ['calzados mujer', 'zapatos mujer peru', 'accesorios mujer', 'calzado femenino', 'zapatos lima', 'tienda calzados'],
  authors: [{ name: 'Tricks Peru' }],
  creator: 'Tricks Peru',
  publisher: 'Tricks Peru',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://tricks.pe',
    title: 'Tricks Peru | Calzados y accesorios para mujer',
    description: 'Descubre la mejor colección de calzados y accesorios para mujer en Tricks Peru. Productos de calidad, diseño y comodidad para el día a día.',
    siteName: 'Tricks Peru',
    images: [
      {
        url: 'https://tricks-bucket.s3.us-east-2.amazonaws.com/logos/tricks-calzados-logo.jpg',
        width: 500,
        height: 500,
        alt: 'Tricks Peru - Calzados y accesorios para mujer',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Tricks Peru | Calzados y accesorios para mujer',
    description: 'Descubre la mejor colección de calzados y accesorios para mujer en Tricks Peru.',
    images: ['https://tricks-bucket.s3.us-east-2.amazonaws.com/logos/tricks-calzados-logo.jpg'],
    creator: '@calzadostricks',
  },
  
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  

  // Otros
  alternates: {
    canonical: 'https://tricks.pe',
  },
  
  // Verificación de redes sociales
  verification: {
    // google: 'tu-codigo-de-google-search-console',
  },
  other: {
    // Meta tags para redes sociales
    'social:instagram': 'https://www.instagram.com/calzadostricks',
    'social:tiktok': 'https://www.tiktok.com/@tricks.calzados',
    
    'business:contact_data:street_address': 'Av España 1050',
    'business:contact_data:locality': 'Trujillo',
    'business:contact_data:region': 'La Libertad',
    'business:contact_data:country_name': 'Peru',
    'business:contact_data:phone_number': '+51-954-236-150',
    
    'breadcrumb': 'Inicio > Calzados para Mujer',
    
    // Información adicional de la tienda
    'store:category': 'Calzados y Accesorios',
    'store:payment_methods': 'Visa, Mastercard, Efectivo',
    'store:shipping': 'Envío gratuito a partir de S/150',
    
    // Para mejor indexación
    'theme-color': '#000000',
    'msapplication-TileColor': '#000000',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  }
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
        <head>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
