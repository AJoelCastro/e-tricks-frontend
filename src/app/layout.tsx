import { Geist, Geist_Mono } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';

import Script from 'next/script'; // 👈 importa Script
import { GA_MEASUREMENT_ID } from '@/lib/gtag'; // 👈 importa tu ID

// SEO NEXT
import { DefaultSeo } from 'next-seo'
import SEO from '../../next-seo.config'
import OrganizationSchema from '@/components/OrganizationSchema'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Tricks Peru | Calzados y accesorios para mujer',
//   description: 'Calzados y accesorios para mujer',
// }

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
          <DefaultSeo {...SEO} />
          <OrganizationSchema />
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
