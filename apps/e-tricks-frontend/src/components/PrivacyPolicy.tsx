import React from 'react';
import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        POLÍTICA DE PRIVACIDAD
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          En TRICKS S.A.C (en adelante, "nosotros", "nuestro" o "la Empresa"), valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos, compartimos y protegemos su información personal cuando utiliza nuestro sitio web y servicios (colectivamente, el "Servicio").
        </Typography>
        <Typography variant="body1" paragraph>
          Al acceder o utilizar nuestro Servicio, usted acepta las prácticas descritas en esta Política de Privacidad. Si no está de acuerdo con nuestros términos, por favor no utilice nuestro Servicio.
        </Typography>
      </Box>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">1. INFORMACIÓN QUE RECOPILAMOS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Recopilamos varios tipos de información para proporcionar y mejorar nuestro Servicio:
          </Typography>
          
          <Typography variant="h6" gutterBottom>Información Personal Identificable:</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Nombre completo" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Dirección de correo electrónico" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Número de teléfono" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Dirección postal (para envíos)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Datos de identificación (DNI, CUIT/CUIL cuando sea necesario)" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Información de Pago:</Typography>
          <Typography variant="body1" paragraph>
            Para procesar pagos utilizamos MercadoPago como procesador de pagos. No almacenamos directamente los datos de su tarjeta de crédito/débito. MercadoPago recopila:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Información de la tarjeta de crédito/débito (almacenada de forma segura por MercadoPago)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Historial de transacciones" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Datos de facturación" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Datos de Autenticación:</Typography>
          <Typography variant="body1" paragraph>
            Para el registro y autenticación de usuarios utilizamos Clerk, que puede recopilar:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Credenciales de acceso (email y contraseña)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Datos de inicio de sesión (fechas, horas, dispositivos)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Métodos de autenticación multifactor" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Datos Automáticos:</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Dirección IP" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Tipo de navegador y versión" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Páginas visitadas y tiempo en el sitio" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Cookies y datos de seguimiento" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">2. CÓMO UTILIZAMOS SU INFORMACIÓN</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Utilizamos la información recopilada para los siguientes propósitos:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Procesar y completar sus pedidos" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Gestionar el envío de productos a su dirección" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Proporcionar soporte al cliente y responder a sus consultas" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Autenticar su identidad y proteger su cuenta" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Mejorar y personalizar su experiencia de usuario" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Detectar y prevenir fraudes y actividades ilegales" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Cumplir con obligaciones legales y regulatorias" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Enviar comunicaciones sobre su cuenta, pedidos y promociones (si ha dado su consentimiento)" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">3. COMPARTICIÓN DE INFORMACIÓN</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Podemos compartir su información personal en las siguientes circunstancias:
          </Typography>

          <Typography variant="h6" gutterBottom>Proveedores de Servicios:</Typography>
          <Typography variant="body1" paragraph>
            Compartimos información con terceros que prestan servicios en nuestro nombre:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• MercadoPago: Para procesar pagos y prevenir fraudes" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Clerk: Para gestión de autenticación y seguridad de cuentas" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Empresas de transporte: Para entregar sus pedidos (nombre, dirección, teléfono)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Proveedores de hosting y análisis: Para operar y mejorar nuestro sitio" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Requisitos Legales:</Typography>
          <Typography variant="body1" paragraph>
            Podemos divulgar su información cuando sea requerido por ley o en respuesta a solicitudes válidas de autoridades públicas.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Transferencias Empresariales:</Typography>
          <Typography variant="body1" paragraph>
            En caso de fusión, adquisición o venta de activos, sus datos pueden transferirse como parte de la transacción.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 2, fontStyle: 'italic' }}>
            No vendemos ni alquilamos su información personal a terceros con fines de marketing.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">4. SEGURIDAD DE LOS DATOS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Cifrado de datos en tránsito (SSL/TLS)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Almacenamiento seguro con acceso restringido" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Autenticación multifactor para accesos administrativos" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Revisiones periódicas de seguridad" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Protección contra accesos no autorizados" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            A pesar de nuestras medidas, ninguna transmisión por Internet o método de almacenamiento electrónico es 100% seguro. Le recomendamos:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• No compartir sus credenciales de acceso" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Utilizar contraseñas fuertes y únicas" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Cerrar sesión al usar dispositivos compartidos" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">5. RETENCIÓN DE DATOS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Conservamos su información personal solo durante el tiempo necesario para los fines descritos en esta política, a menos que la ley requiera o permita un período de retención más largo.
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="• Datos de pedidos: 5 años (requisitos fiscales y de garantía)" 
                secondary="Incluye información de facturación, productos comprados y datos de envío" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Datos de cuenta: Mientras su cuenta esté activa + 2 años" 
                secondary="Podemos retener cierta información incluso después del cierre de cuenta para cumplir con obligaciones legales" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Registros de transacciones: 5 años" 
                secondary="Según requerimientos legales y financieros" 
              />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Los datos anonimizados pueden conservarse indefinidamente para análisis estadísticos.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">6. SUS DERECHOS DE PRIVACIDAD</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Usted tiene derechos respecto a sus datos personales:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="• Acceso: Solicitar una copia de sus datos personales" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Rectificación: Corregir información inexacta o incompleta" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Eliminación: Solicitar la eliminación de sus datos cuando ya no sean necesarios" 
                secondary="Sujeto a ciertas excepciones legales" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Limitación: Restringir el procesamiento en ciertas circunstancias" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Portabilidad: Recibir sus datos en formato estructurado" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Oposición: Oponerse al procesamiento para fines de marketing directo" 
              />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Para ejercer estos derechos, contáctenos a través de los medios indicados al final de esta política. Podemos solicitar información adicional para verificar su identidad antes de responder a su solicitud.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">7. COOKIES Y TECNOLOGÍAS SIMILARES</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Utilizamos cookies y tecnologías similares para:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Funcionamiento básico del sitio (cookies esenciales)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Recordar sus preferencias" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Analizar el tráfico y uso del sitio" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Personalizar contenido y anuncios" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Puede gestionar sus preferencias de cookies a través de la configuración de su navegador. Tenga en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">8. TRANSFERENCIAS INTERNACIONALES</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Su información puede transferirse y procesarse en países distintos al suyo, donde las leyes de protección de datos pueden diferir. Tomamos medidas para garantizar que estas transferencias cumplan con las leyes aplicables:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="• Cláusulas contractuales estándar" 
                secondary="Para transferencias fuera del EEE" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Proveedores certificados" 
                secondary="Como MercadoPago y Clerk que cumplen con marcos de privacidad adecuados" 
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">9. PRIVACIDAD INFANTIL</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Nuestro Servicio no está dirigido a menores de 16 años. No recopilamos conscientemente información personal de menores sin el consentimiento verificable de los padres. Si descubrimos que hemos recopilado datos de un menor sin dicho consentimiento, tomaremos medidas para eliminar esa información.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">10. CAMBIOS A ESTA POLÍTICA</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos publicando la nueva política en este sitio con una fecha de actualización revisada. En algunos casos, podemos proporcionar un aviso más prominente (como un correo electrónico para ciertos cambios).
          </Typography>
          <Typography variant="body1" paragraph>
            Le recomendamos que revise esta Política de Privacidad regularmente para estar informado sobre cómo protegemos su información.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">11. CONTÁCTENOS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Si tiene preguntas sobre esta Política de Privacidad o sus derechos de privacidad, puede contactarnos a través de:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Correo electrónico: privacidad@trickssac.com" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Dirección postal: [Inserte dirección física de la empresa]" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Formulario de contacto en nuestro sitio web" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Fecha de última actualización: [Inserte fecha]
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default PrivacyPolicy;