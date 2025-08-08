// components/OrganizationSchema.tsx
'use client'
import { OrganizationJsonLd } from 'next-seo'

export default function OrganizationSchema() {
  return (
    <OrganizationJsonLd
      type="Organization"
      id="https://tricks.pe"
      name="Tricks Peru"
      alternateName="Calzados Tricks"
      url="https://tricks.pe"
      logo="https://tricks.pe/logo.png"
      description="Tienda especializada en calzados y accesorios para mujer en Perú. Encuentra los mejores diseños con calidad y comodidad."
      
      // Redes sociales
      sameAs={[
        "https://www.instagram.com/calzadostricks",
        "https://www.tiktok.com/@tricks.calzados"
      ]}
      
      // Información de contacto (agregar cuando tengas)
      contactPoint={[
        {
          telephone: "+51-954-236-150",
          contactType: "customer service",
          areaServed: "PE",
          availableLanguage: "Spanish"
        }
      ]}
      
      // Dirección (agregar si tienes tienda física)
      address={{
        addressCountry: "PE",
        addressLocality: "Trujillo", // 👈 Tu ciudad
        addressRegion: "La Libertad",
        streetAddress: "Av España 1050"
      }}
    />
  )
}