// next-seo.config.ts (crear este archivo en la raíz del proyecto)
import { DefaultSeoProps } from 'next-seo'

const config: DefaultSeoProps = {
  title: 'Tricks Peru | Calzados y accesorios para mujer',
  titleTemplate: '%s | Tricks Peru',
  description: 'Descubre la mejor colección de calzados y accesorios para mujer en Tricks Peru. Productos de calidad, diseño y comodidad para el día a día.',
  canonical: 'https://tricks.pe', // 👈 Cambia por tu dominio real
  
  // Open Graph para redes sociales
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://tricks.pe',
    siteName: 'Tricks Peru',
    title: 'Tricks Peru | Calzados y accesorios para mujer',
    description: 'Descubre la mejor colección de calzados y accesorios para mujer en Tricks Peru. Productos de calidad, diseño y comodidad para el día a día.',
    images: [
      {
        url: 'https://tricks-bucket.s3.us-east-2.amazonaws.com/logos/tricks-calzados-logo.jpg', 
        width: 500,
        height: 500,
        alt: 'Tricks Peru - Calzados y accesorios para mujer',
        type: 'image/jpg',
      },
    ],
  },
  
  // Twitter Cards (puedes usar tu Instagram como referencia)
  twitter: {
    handle: '@calzadostricks',
    site: '@calzadostricks',
    cardType: 'summary_large_image',
  },
  
  // Enlaces adicionales
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    }
  ],
  
  // Meta tags adicionales
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    {
      name: 'googlebot',
      content: 'index, follow'
    },
    {
      name: 'author',
      content: 'Tricks Peru'
    },
    {
      name: 'keywords',
      content: 'calzados mujer, zapatos mujer peru, accesorios mujer, calzado femenino, zapatos lima, tienda calzados'
    },
    // {
    //   httpEquiv: 'Content-Language',
    //   content: 'es-PE'
    // }
  ]
}

export default config