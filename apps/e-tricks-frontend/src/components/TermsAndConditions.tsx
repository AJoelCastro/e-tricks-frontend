import React from 'react';
import { 
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TermsAndConditions = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4,  textAlign: 'center' }}>
        TÉRMINOS DEL SERVICIO
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          TRICKS S.A.C gestiona este sitio web. En todo el sitio, los términos "nosotros", "nos" y "nuestro" se refieren en lo sucesivo a TRICKS S.A.C. TRICKS S.A.C ofrece esta página web, incluida toda la información, las herramientas y los servicios que se ponen en este sitio a disposición suya, el usuario, siempre y cuando acepte la totalidad de los términos, condiciones, políticas y avisos contemplados aquí.
        </Typography>
        <Typography variant="body1" paragraph>
          Al visitar nuestro sitio y/o compramos algo, usted interactúa con nuestro "Servicio" y reconoce como vinculantes los siguientes términos y condiciones (denominados en lo sucesivo "Términos del servicio", "Términos"), incluidos aquellos términos y condiciones adicionales y las políticas que se mencionan aquí y/o disponibles por medio de hipervínculo. Estos Términos del servicio se aplican a todos los usuarios del sitio, incluyendo de manera enunciativa mas no limitativa los usuarios que son navegadores, proveedores, clientes, comerciantes y/o que aporten contenido.
        </Typography>
        <Typography variant="body1" paragraph>
          Lea estos Términos del servicio detenidamente antes de acceder o utilizar nuestra página web. Al acceder o utilizar cualquier parte del sitio, usted acepta estos Términos del servicio. Si no acepta la totalidad de los términos y condiciones de este acuerdo, no podrá acceder al sitio web ni utilizar ningún servicio. Si estos Términos del servicio se considerasen una oferta, la aceptación se limita expresamente a los presentes Términos del servicio.
        </Typography>
        <Typography variant="body1" paragraph>
          Las nuevas funciones o herramientas que se agreguen a la tienda actual también estarán sujetas a los Términos del servicio. Puede revisar la versión más reciente de los Términos del servicio en cualquier momento en esta página. Nos reservamos el derecho de actualizar, cambiar o reemplazar cualquier parte de los presentes Términos del servicio mediante la publicación de actualizaciones o cambios en nuestra página web. Es su responsabilidad revisar esta página periódicamente para ver los cambios. Su uso de la página web o el acceso a ella de forma continuada después de la publicación de cualquier cambio constituye la aceptación de dichos cambios.
        </Typography>
        <Typography variant="body1" paragraph>
          Nuestra tienda está alojada en Shopify Inc. Nos proporcionan la plataforma de comercio electrónico en línea que nos permite venderle nuestros productos y servicios.
        </Typography>
      </Box>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 1: TÉRMINOS DE LA TIENDA ONLINE</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Al aceptar los presentes Términos del servicio, usted declara que tiene la mayoría de edad en su estado o provincia de residencia, o que es mayor de edad en su estado o provincia de residencia y que nos ha dado su consentimiento para permitir que cualquiera de las personas menores que dependen de usted utilice este sitio.
          </Typography>
          <Typography variant="body1" paragraph>
            No puede utilizar nuestros productos para ningún fin ilegal o no autorizado ni puede, al hacer uso del Servicio, infringir las leyes de su jurisdicción (incluyendo de manera enunciativa más no limitativa, las leyes de derechos de autor).
          </Typography>
          <Typography variant="body1" paragraph>
            No transmitirá ningún gusano o virus informáticos ni ningún código de naturaleza destructiva.
          </Typography>
          <Typography variant="body1" paragraph>
            El incumplimiento o violación de cualquiera de los Términos dará como resultado la rescisión inmediata de sus Servicios.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 2: CONDICIONES GENERALES</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Nos reservamos el derecho de rechazar el servicio a cualquier persona, por cualquier motivo, en cualquier momento.
          </Typography>
          <Typography variant="body1" paragraph>
            Usted comprende que su contenido (sin incluir la información de la tarjeta de crédito) puede transferirse sin cifrar e implicar (a) transmisiones en varias redes; y (b) cambios para adaptarse a los requisitos técnicos de conexión de redes o dispositivos y cumplir con ellos. La información de la tarjeta de crédito siempre se cifra durante la transferencia a través de las redes.
          </Typography>
          <Typography variant="body1" paragraph>
            Usted acepta no reproducir, duplicar, copiar, vender, revender ni aprovechar ninguna parte del Servicio, uso del Servicio o acceso al Servicio o cualquier contacto en el sitio web a través de la cual se presta el servicio, sin nuestro permiso expreso por escrito.
          </Typography>
          <Typography variant="body1" paragraph>
            Los encabezados utilizados en este acuerdo se incluyen solo para facilitar la lectura y no limitarán ni afectarán los presentes Términos.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 3: EXACTITUD, TOTALIDAD Y CRONOLOGÍA DE LA INFORMACIÓN</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            No nos responsabilizamos si la información disponible en este sitio no es precisa, completa o actualizada. El material presentado en este sitio se proporciona solo para información general y no se debe confiar en él ni utilizarlo como la única base para tomar decisiones sin consultar fuentes de información primarias, más precisas, más completas o más actualizadas.
          </Typography>
          <Typography variant="body1" paragraph>
            Este sitio puede contener cierta información histórica. La información histórica, inevitablemente, no es actual y se proporciona únicamente como referencia. Nos reservamos el derecho de modificar el contenido de este sitio en cualquier momento, pero no tenemos la obligación de actualizar ninguna información en nuestro sitio. Usted acepta que es su responsabilidad controlar los cambios en nuestro sitio.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 4: MODIFICACIONES AL SERVICIO Y PRECIOS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Los precios de nuestros productos están sujetos a cambios sin previo aviso.
          </Typography>
          <Typography variant="body1" paragraph>
            Nos reservamos el derecho de modificar o discontinuar el Servicio (o cualquier parte o contenido del mismo) sin previo aviso en cualquier momento.
          </Typography>
          <Typography variant="body1" paragraph>
            No seremos responsables ante usted ni ante ningún tercero por ninguna modificación, cambio de precio, suspensión o interrupción del Servicio.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 5: PRODUCTOS O SERVICIOS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Ciertos productos o servicios pueden estar disponibles exclusivamente online a través del sitio web. Estos productos o servicios pueden tener cantidades limitadas y están sujetos a devolución o cambio solo de acuerdo con nuestra Política de devolución.
          </Typography>
          <Typography variant="body1" paragraph>
            Hemos hecho todo lo viable para mostrar con la mayor precisión posible los colores y las imágenes de nuestros productos que aparecen en la tienda. No podemos garantizar que la visualización de cualquier color en el monitor de su computadora sea precisa.
          </Typography>
          <Typography variant="body1" paragraph>
            Nos reservamos el derecho, pero no estamos obligados, de limitar las ventas de nuestros productos o servicios a cualquier persona, región geográfica o jurisdicción. Podemos ejercer este derecho caso por caso. Nos reservamos el derecho de limitar las cantidades de cualquier producto o servicio que ofrecemos. Todas las descripciones de los productos o los precios de los productos están sujetos a cambios en cualquier momento y sin previo aviso, a nuestra entera discreción. Nos reservamos el derecho de discontinuar cualquier producto en cualquier momento. Cualquier oferta de cualquier producto o servicio que se realice en este sitio no tiene validez donde dicho producto o servicio esté prohibido.
          </Typography>
          <Typography variant="body1" paragraph>
            No garantizamos que la calidad de cualquier producto, servicio, información u otro material que usted haya comprado u obtenido cumplirá con sus expectativas, o que cualquier error en el Servicio se corregirá.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 6: EXACTITUD DE LA FACTURACIÓN Y DE LA INFORMACIÓN DE LA CUENTA</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Nos reservamos el derecho de rechazar cualquier pedido que realice en nuestra tienda. Podemos, a nuestro exclusivo criterio, limitar o cancelar las cantidades compradas por persona, por hogar o por pedido. Estas restricciones pueden incluir pedidos realizados con la misma cuenta de cliente, la misma tarjeta de crédito o pedidos que usen la misma dirección de facturación o de envío. En el caso de que realicemos un cambio o cancelemos un pedido, intentaremos notificarle vía correo electrónico o la dirección de facturación / número de teléfono proporcionados en el momento en que se realizó el pedido. Nos reservamos el derecho de limitar o prohibir los pedidos que, a nuestra entera discreción, parezcan haber sido realizados por comerciantes, revendedores o distribuidores.
          </Typography>
          <Typography variant="body1" paragraph>
            Usted acepta suministrar información completa y precisa de la compra y cuenta actual, para todas las compras realizadas en nuestra tienda. Usted acepta actualizar rápidamente su cuenta y demás informaciones, entre ellas, su dirección de correo electrónico, los números de tarjeta de crédito y las fechas de vencimiento, para que podamos completar sus transacciones y contactarlo según sea necesario.
          </Typography>
          <Typography variant="body1" paragraph>
            Para obtener más información, consulte nuestra Política de devoluciones.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 7: HERRAMIENTAS OPCIONALES</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Podemos proporcionarle acceso a herramientas de terceros que no supervisamos, ni tenemos ningún control sobre ellas, ni tampoco contribuimos.
          </Typography>
          <Typography variant="body1" paragraph>
            Usted reconoce y acepta que brindamos acceso a dichas herramientas "tal como se encuentran" y "según disponibilidad" sin garantías, representaciones ni condiciones de ningún tipo y sin ningún tipo de respaldo. No tendremos ninguna responsabilidad como consecuencia del uso que haga de herramientas opcionales de terceros o en relación a ellas.
          </Typography>
          <Typography variant="body1" paragraph>
            Cualquier uso que haga de las herramientas opcionales ofrecidas a través del sitio es por su cuenta y riesgo, y debe asegurarse de estar familiarizado con los términos según los cuales los proveedores externos relevantes suministran dichas herramientas y aprobarlos.
          </Typography>
          <Typography variant="body1" paragraph>
            También podemos, en el futuro, ofrecer nuevos servicios o funciones a través del sitio web (incluido el lanzamiento de nuevas herramientas y recursos). Estas nuevas funciones o servicios también estarán sujetos a los presentes Términos de servicio.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 8: ENLACES DE TERCEROS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Algunos contenidos, productos y servicios disponibles a través de nuestro Servicio pueden incluir recursos de terceros.
          </Typography>
          <Typography variant="body1" paragraph>
            Los enlaces de terceros en este sitio pueden dirigirlo a páginas web de terceros que no están afiliadas a nosotros. No somos responsables de examinar o evaluar el contenido o la exactitud, ni garantizamos ni asumiremos ninguna obligación ni responsabilidad por los recursos o páginas web de terceros, ni por ningún otro material, producto o servicio de terceros.
          </Typography>
          <Typography variant="body1" paragraph>
            No somos responsables de ningún daño o perjuicio relacionado con la compra o el uso de bienes, servicios, recursos, contenido o cualquier otra transacción realizada en conexión con sitios web de terceros. Revise cuidadosamente las políticas y prácticas de terceros, y asegúrese de comprenderlas antes de participar en cualquier transacción. Las quejas, reclamos, inquietudes o preguntas referentes a productos de terceros deben dirigirse a estos.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 9: COMENTARIOS DE LOS USUARIOS, OPINIONES Y OTRAS COMUNICACIONES</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Si, a petición nuestra, usted envía ciertas comunicaciones específicas (por ejemplo, participaciones en un concurso) o, sin una solicitud nuestra, envía ideas creativas, sugerencias, propuestas, planes u otros materiales, ya sea online, por correo electrónico, por correo postal, o de otro modo (denominado en lo sucesivo y de manera colectiva, "comentarios"), usted acepta que podemos, en cualquier momento, sin restricción: editar, copiar, publicar, distribuir, traducir y usar en cualquier medio cualquier comentario que usted nos envíe. No tenemos ni tendremos ninguna obligación (1) de mantener ningún comentario de manera confidencial; (2) pagar alguna compensación por cualquier comentario; o (3) responder a cualquier comentario.
          </Typography>
          <Typography variant="body1" paragraph>
            Podemos, pero no tenemos la obligación de monitorear, editar o eliminar contenido que a nuestra entera discreción determinemos que es ilegal, ofensivo, amenazante, calumnioso, difamatorio, pornográfico, obsceno u objetable, o que infrinja la propiedad intelectual de cualquiera de las partes o de los presentes Términos del servicio.
          </Typography>
          <Typography variant="body1" paragraph>
            Usted acepta que sus comentarios no infringirán ningún derecho de terceros, incluidos los derechos de autor, marca registrada, privacidad, personalidad u otro derecho personal o de propiedad. Además, acepta que sus comentarios no contendrán material difamatorio, ilegítimo, abusivo u obsceno, ni contendrán ningún virus informático ni otro software dañino que pueda afectar de cualquier manera el funcionamiento del Servicio o de cualquier sitio web relacionado. No puede utilizar una dirección de correo electrónico falsa, simular ser otra persona o engañarnos o engañar a terceros sobre el origen de los comentarios. Usted es el único responsable de los comentarios que realice y de su exactitud. No asumimos ninguna responsabilidad ni ninguna obligación por los comentarios publicados por usted o por un tercero.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 10: INFORMACIÓN PERSONAL</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            El envío de la información personal que haga a través de la tienda se rige por nuestra Política de privacidad.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 11: ERRORES, INEXACTITUDES Y OMISIONES</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Puede haber información en nuestro sitio o en el Servicio que, ocasionalmente, contenga errores tipográficos, inexactitudes u omisiones que puedan relacionarse con descripciones de productos, precios, promociones, ofertas, cargos por envío de productos, tiempos de tránsito y disponibilidad. Nos reservamos el derecho de corregir cualquier error, inexactitud u omisión, de cambiar o actualizar información, o cancelar pedidos si alguna información en el Servicio o en cualquier página web relacionada es inexacta en cualquier momento sin previo aviso (incluso después de haber enviado su pedido).
          </Typography>
          <Typography variant="body1" paragraph>
            No asumimos ninguna obligación de actualizar, modificar o aclarar la información en el Servicio o en cualquier sitio web relacionado, incluyendo de manera enunciativa pero no limitativa, la información de precios, excepto cuando lo exija la ley. Ninguna actualización especificada o fecha de actualización aplicada en el Servicio o en cualquier sitio web relacionado debe tomarse para indicar que toda la información en el Servicio o en cualquier sitio web relacionado se modificó o actualizó.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 12: USOS PROHIBIDOS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Además de las prohibiciones establecidas en los Términos del servicio, se le prohíbe utilizar el sitio o su contenido (a) para cualquier propósito ilegal; (b) para solicitar a otros que realicen o participen en cualquier acto ilegal; (c) para infringir cualquier reglamento, norma, ley u ordenanza local internacional, federal, provincial o estatal; (d) para infringir o violar nuestros derechos de propiedad intelectual o los derechos de propiedad intelectual de otros; (e) acosar, abusar, insultar, dañar, difamar, calumniar, denigrar, intimidar o discriminar por motivos de género, orientación sexual, religión, etnia, raza, edad, nacionalidad o discapacidad; (f) enviar información falsa o engañosa;
          </Typography>
          <Typography variant="body1" paragraph>
            (g) cargar o transmitir virus o cualquier otro tipo de código dañino que afecte o pueda afectar a la funcionalidad o el funcionamiento del Servicio o de cualquier sitio web relacionado, de otros sitios web o de Internet; (h) recopilar o rastrear la información personal de otros; (i) enviar correo no deseado, phishing, pharm, pretexto, spider, rastrear o extraer; (j) para cualquier propósito obsceno o inmoral; o (k) para interferir o eludir las funciones de seguridad del Servicio o de cualquier sitio web relacionado, o de otros sitios web o de Internet. Nos reservamos el derecho de dar por terminado su uso del Servicio o de cualquier sitio web relacionado por infringir cualquiera de los usos prohibidos.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 13: DESCARGO DE RESPONSABILIDAD DE GARANTÍAS; LIMITACIÓN DE RESPONSABILIDAD</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            No garantizamos, representamos ni aseguramos que el uso que haga de nuestro servicio será sin interrupciones, oportuno, seguro o sin errores.
          </Typography>
          <Typography variant="body1" paragraph>
            No garantizamos que los resultados que se puedan obtener del uso del servicio sean exactos o confiables.
          </Typography>
          <Typography variant="body1" paragraph>
            Usted acepta que periódicamente, podamos eliminar el servicio por lapsos de tiempo indefinidos o cancelar el servicio en cualquier momento, sin notificarla.
          </Typography>
          <Typography variant="body1" paragraph>
            Usted acepta expresamente que su uso del servicio o la imposibilidad de utilizarlo corre por su riesgo. El servicio y todos los productos y servicios que se le entregan a través del servicio (salvo que así lo especifiquemos nosotros) se ofrecen "tal como están" y "según disponibilidad" para su uso, sin ninguna representación, garantía o condición de ningún tipo, ya sea expresa o implícita, entre las que se incluyen todas las garantías implícitas o condiciones de comercialalidad, calidad comercial, idoneidad para un propósito particular, durabilidad, título y no violación.
          </Typography>
          <Typography variant="body1" paragraph>
            En ningún caso TRICKS S.A.C, nuestros directores, funcionarios, empleados, afiliados, agentes, contratistas, pasantes, proveedores, proveedores de servicios o licenciantes serán responsables de cualquier lesión, pérdida, reclamo o cualquier daño directo, indirecto, incidental, punitivo, especial o consecuente de cualquier tipo, incluyendo de manera enunciativa más no limitativa; la pérdida de beneficios, pérdida de ingresos, pérdida de ahorros, pérdida de datos, costos de reemplazo o daños similares, ya sea por contrato, perjuicio (incluida la negligencia), responsabilidad estricta o de otro tipo, que surjan del uso que haga de cualquiera de los servicios o de cualquier producto adquirido por medio del servicio, o para cualquier otro reclamo relacionado de alguna manera con su uso del servicio o de cualquier producto, incluidos, entre otros, cualquier error u omisión en cualquier contenido, o cualquier pérdida o daño de cualquier tipo en el que se haya incurrido como resultado del uso del servicio o de cualquier contenido (o producto) publicado, transmitido o puesto a disposición a través del servicio, incluso si se informa de su posibilidad.
          </Typography>
          <Typography variant="body1" paragraph>
            Debido a que algunos estados o jurisdicciones no permiten la exclusión o la limitación de la responsabilidad por daños consecuentes o incidentales, en dichos estados o jurisdicciones, nuestra responsabilidad se limitará a la extensión máxima de lo permitido por la ley.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 14: INDEMNIZACIÓN</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            Usted acepta indemnizar, defender y mantener indemne a TRICKS S.A.C y a nuestra empresa matriz, subsidiarias, afiliadas, asociados, funcionarios, directores, agentes, contratistas, licenciantes, proveedores de servicios, subcontratistas, proveedores, pasantes y empleados, de cualquier reclamo o demanda, incluidos los honorarios razonables de abogados, en los que un tercero haya incurrido debido a su incumplimiento de los presentes Términos del servicio o de los documentos que incorporan como referencia o que surjan por su incumplimiento de los mismos, o por la violación de cualquier ley o derechos de un tercero que haga.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" component="h2">SECCIÓN 15: DIVISIBILIDAD</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            En caso de que se determine que alguna disposición de los presentes Términos del servicio sea ilegal, nula o inaplicable, dicha disposición será, no obstante, ejecutable en la medida en que lo permita la legislación aplicable, y la parte inaplicable se considerará separada de los presentes Términos.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Con tecnología de <Link href="https://es.shopify.com" target="_blank" rel="noopener">Shopify</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsAndConditions;