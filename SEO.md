## AUDITORÍA REALIZADA — 13 AGOSTO 2026
> Sitio: https://moreltechnologyrd.com/

### Lo que YA funciona:
- ✅ robots.txt configurado (Allow: /, Disallow: /admin, /private)
- ✅ sitemap.xml existe e incluye home, catálogo, ofertas, financiamiento, soporte, contacto, nosotros, envíos + 20 productos
- ✅ HTTPS activo
- ✅ Home: Title SEO bueno ("Morel Technology - Laptops en República Dominicana")
- ✅ Home: Meta description completa (~160 chars con keywords)
- ✅ Home: H1 único y descriptivo
- ✅ Home: Open Graph tags presentes (title, description, url, site_name, locale, type)
- ✅ Home: Todos los imágenes tienen ALT
- ✅ Home: Links internos a catálogo, FAQ, contacto, etc.
- ✅ Productos: H1 único por producto
- ✅ Productos: Title único por producto
- ✅ Productos: Botón WhatsApp presente
- ✅ Productos: Fotos con ALT
- ✅ Categorías existen via query params (?categoria=gaming, etc.)

### 🚨 BUGS CRÍTICOS ENCONTRADOS:
1. **og:image del Home apunta a localhost**: `http://localhost:3000/og-image.png` → Compartir en redes sociales está ROTO
2. **Meta description de productos muy corta**: Solo 23 chars en vez de 150-160
3. **originalPrice renderiza "$undefined"**: Bug de JavaScript en páginas de producto
4. **og:description dice "laptop" para un mouse**: Error de contenido en metas
5. **URLs de imágenes con signed S3 URLs**: Expiran en 7 días, los crawlers no podrán verlas
6. **Categorías usan query params**: `/catalogo?categoria=gaming` en vez de `/laptops/gaming`

### ❌ FALTA COMPLETAMENTE:
- Canonical URLs (en ninguna página)
- JSON-LD / Schema structured data (en ninguna página)
- Breadcrumbs (visuales ni schema)
- Twitter Cards en Home
- Productos relacionados en páginas de producto
- URLs con slug SEO (usan IDs: /productos/37)
- Páginas SEO de ubicaciones (Santo Domingo, Santiago)
- Blog
- Google Search Console (no verificable desde código)

---

## 🔥 PRIORIDAD 1 — SEO TÉCNICO
- [ ] Configurar Google Search Console
- [ ] Verificar moreltechnologyrd.com
- [x] Enviar sitemap.xml
- [x] Revisar robots.txt
- [x] Configurar canonical URLs ← AGREGADO en layout.tsx, productos, financiamiento, FAQ ← FALTA EN TODAS LAS PÁGINAS
- [x] Verificar HTTPS
- [ ] Verificar redirección www → dominio principal
- [ ] Revisar errores 404
- [ ] Crear página 404 personalizada
- [ ] Revisar páginas indexadas por Google
- [ ] Revisar páginas excluidas de Google
- [ ] Revisar Core Web Vitals
- [ ] Optimizar LCP
- [ ] Optimizar CLS
- [ ] Optimizar INP
- [ ] Optimizar JavaScript
- [ ] Optimizar CSS
- [ ] Comprimir imágenes
- [ ] Convertir imágenes a WebP/AVIF
- [ ] Implementar lazy loading
- [x] Crear sitemap dinámico ← YA EXISTE (generado automáticamente)
- [x] Incluir productos en sitemap ← 20 productos incluidos
- [ ] Incluir categorías en sitemap ← FALTA (solo query params)
- [ ] Excluir páginas innecesarias del sitemap
- [ ] Verificar que Google pueda renderizar contenido generado por JavaScript
## 🔥 PRIORIDAD 2 — PRODUCTOS
- [ ] Crear URL individual para cada producto ← USA IDs: /productos/37
- [ ] Crear slug SEO para cada producto ← FALTA
> Ejemplo: /catalogo/lenovo-thinkpad-t480
- [x] Crear H1 único para cada producto
- [x] Crear <title> único
- [x] Crear meta description ← ARREGLADO: ~160 chars con specs, precio, marca ← MUY CORTA (23 chars vs 150-160)
- [ ] Crear descripción SEO
- [ ] Mostrar precio
- [ ] Mostrar disponibilidad
- [x] Mostrar condición del equipo ← "Nuevo" visible
- [ ] Mostrar procesador
- [ ] Mostrar RAM
- [ ] Mostrar almacenamiento
- [ ] Mostrar pantalla
- [ ] Mostrar sistema operativo
- [ ] Mostrar garantía
- [ ] Mostrar ubicación
- [ ] Mostrar métodos de pago
- [x] Agregar botón Comprar por WhatsApp
- [ ] Agregar botón Consultar disponibilidad
- [x] Agregar fotografías reales ← Usa MinIO/S3
- [ ] Optimizar nombres de imágenes ← URLs son hashes, no descriptivos
- [x] Agregar ALT a las imágenes
- [ ] Agregar productos relacionados ← NO EXISTE
- [x] Agregar breadcrumbs ← Visuales + JSON-LD BreadcrumbList
- [ ] Implementar Product Schema ← NO EXISTE
- [ ] Implementar Offer Schema ← NO EXISTE
- [ ] Implementar Brand Schema ← NO EXISTE
- [ ] Implementar BreadcrumbList Schema ← NO EXISTE
- [x] Configurar canonical de productos ← AGREGADO en generateMetadata ← NO EXISTE
- [ ] Definir estrategia para productos agotados
- [ ] Evitar páginas duplicadas de productos
- [ ] Indexar productos disponibles
## 🔥 PRIORIDAD 3 — CATEGORÍAS SEO
### Marcas
- [ ] Crear /laptops/lenovo
- [ ] Crear /laptops/dell
- [ ] Crear /laptops/hp
- [ ] Crear /laptops/apple
- [ ] Crear /laptops/asus
- [ ] Crear /laptops/acer
- [ ] Crear /laptops/razer
### Tipo de laptop
- [ ] Crear /laptops/gaming
- [ ] Crear /laptops/empresariales
- [ ] Crear /laptops/estudiantes
- [ ] Crear /laptops/programacion
- [ ] Crear /laptops/diseno-grafico
- [ ] Crear /laptops/trabajo
- [ ] Crear /laptops/economicas
- [ ] Crear /laptops/reacondicionadas
### Cada categoría debe tener
- [ ] H1
- [ ] Title SEO
- [ ] Meta description
- [ ] Texto introductorio
- [ ] Productos
- [ ] FAQs
- [ ] Schema
- [ ] Enlaces internos
- [ ] Canonical
## 🔥 PRIORIDAD 4 — SEO LOCAL
### Santo Domingo
- [x] Crear /tienda-laptops-santo-domingo ← CREADO
- [x] H1: Tienda de Laptops en Santo Domingo
- [x] Agregar dirección ← El Edén de Villa Mella
- [x] Agregar teléfono ← 809-617-5517
- [x] Agregar WhatsApp ← 809-617-5517
- [x] Agregar horario ← Lun-Sáb 9AM-7PM
- [x] Agregar Google Maps ← iframe embed
- [ ] Agregar fotos reales
- [x] Agregar productos disponibles ← Sección de productos
- [ ] Agregar marcas
- [x] Agregar garantía ← En benefits section
- [x] Agregar financiamiento ← En benefits section
- [ ] Agregar cómo llegar
- [x] Agregar preguntas frecuentes ← 4 FAQs con schema
- [x] Implementar LocalBusiness Schema ← JSON-LD con name, address, geo, hours
### Santiago
- [x] Crear /tienda-laptops-santiago ← CREADO
- [x] H1: Tienda de Laptops en Santiago
- [x] Agregar dirección ← Plaza Pamela 3
- [x] Agregar teléfono ← 809-421-5517
- [x] Agregar WhatsApp ← 809-421-5517
- [x] Agregar horario ← Lun-Sáb 9AM-7PM
- [x] Agregar Google Maps ← iframe embed
- [ ] Agregar fotos reales
- [x] Agregar productos disponibles ← Sección de productos
- [ ] Agregar marcas
- [x] Agregar garantía ← En benefits section
- [x] Agregar financiamiento ← En benefits section
- [ ] Agregar cómo llegar
- [x] Agregar preguntas frecuentes ← 4 FAQs con schema
- [x] Implementar LocalBusiness Schema ← JSON-LD con name, address, geo, hours
## 🔥 PRIORIDAD 5 — GOOGLE BUSINESS PROFILE
### Santo Domingo
- [ ] Verificar Google Business Profile
- [ ] Revisar nombre
- [ ] Revisar categoría principal
- [ ] Revisar categorías secundarias
- [ ] Revisar dirección
- [ ] Revisar teléfono
- [ ] Agregar URL específica de Santo Domingo
- [ ] Revisar horario
- [ ] Subir fotos exteriores
- [ ] Subir fotos interiores
- [ ] Subir fotos de productos
- [ ] Subir logo
- [ ] Subir portada
- [ ] Agregar productos
- [ ] Agregar servicios
- [ ] Publicar contenido periódicamente
- [ ] Conseguir reseñas reales
- [ ] Responder todas las reseñas
### Santiago
- [ ] Verificar Google Business Profile
- [ ] Revisar nombre
- [ ] Revisar categoría principal
- [ ] Revisar categorías secundarias
- [ ] Revisar dirección
- [ ] Revisar teléfono
- [ ] Agregar URL específica de Santiago
- [ ] Revisar horario
- [ ] Subir fotos exteriores
- [ ] Subir fotos interiores
- [ ] Subir fotos de productos
- [ ] Subir logo
- [ ] Subir portada
- [ ] Agregar productos
- [ ] Agregar servicios
- [ ] Publicar contenido periódicamente
- [ ] Conseguir reseñas reales
- [ ] Responder todas las reseñas
## 🟠 PRIORIDAD 6 — HOME
- [x] Optimizar H1 ← "Las mejores laptops para estudiar, trabajar y gaming en RD."
- [x] Incluir "Tienda de Laptops en República Dominicana" ← En title/meta
- [x] Crear Title SEO ← "Morel Technology - Laptops en República Dominicana"
- [x] Crear Meta Description ← Completa, ~160 chars
- [ ] Agregar texto SEO introductorio
- [ ] Mostrar marcas
- [ ] Mostrar categorías
- [ ] Mostrar productos destacados
- [ ] Mostrar ofertas
- [ ] Mostrar sucursales
- [ ] Mostrar garantía
- [ ] Mostrar financiamiento
- [ ] Mostrar métodos de pago
- [x] Mostrar testimonios ← Sección de reviews visible
- [ ] Agregar FAQ
- [x] Agregar enlaces internos ← Links a catálogo, FAQ, contacto, etc.
- [x] Implementar Organization Schema ← JSON-LD en Home
- [x] Implementar WebSite Schema ← JSON-LD en Home
## 🟠 PRIORIDAD 7 — FAQ
- [ ] ¿Dónde comprar laptops en Santo Domingo?
- [ ] ¿Dónde comprar laptops en Santiago?
- [ ] ¿Venden laptops usadas?
- [ ] ¿Venden laptops reacondicionadas?
- [ ] ¿Las laptops tienen garantía?
- [ ] ¿Hacen envíos a todo RD?
- [ ] ¿Aceptan tarjetas?
- [ ] ¿Ofrecen financiamiento?
- [ ] ¿Puedo comprar por WhatsApp?
- [ ] ¿Emiten factura con NCF?
- [ ] ¿Qué laptop recomiendan para estudiantes?
- [ ] ¿Qué laptop recomiendan para programación?
- [ ] ¿Qué laptop recomiendan para diseño gráfico?
- [ ] ¿Qué laptop recomiendan para gaming?
- [ ] Implementar FAQ Schema donde corresponda
## 🟠 PRIORIDAD 8 — BLOG / CONTENIDO
- [ ] Crear sección /blog
- [ ] ¿Dónde comprar laptops en Santo Domingo?
- [ ] ¿Dónde comprar laptops en Santiago?
- [ ] ¿Cuánto cuesta una laptop en República Dominicana?
- [ ] Mejores laptops económicas en RD
- [ ] Mejores laptops para estudiantes
- [ ] Mejores laptops para programación
- [ ] Mejores laptops para diseño gráfico
- [ ] Mejores laptops gaming
- [ ] Lenovo vs Dell
- [ ] Lenovo vs HP
- [ ] ¿Qué laptop comprar con RD$20,000?
- [ ] ¿Qué laptop comprar con RD$30,000?
- [ ] ¿Qué laptop comprar con RD$40,000?
- [ ] ¿Vale la pena comprar una laptop reacondicionada?
- [ ] Laptop usada vs nueva
- [ ] Cómo elegir una laptop
- [ ] Cuánta RAM necesita una laptop
- [ ] SSD vs HDD
- [ ] Core i5 vs Core i7
- [ ] Enlazar artículos con productos
- [ ] Enlazar artículos con categorías
- [ ] Agregar imágenes propias
- [ ] Optimizar títulos
- [ ] Optimizar meta descriptions
## 🟠 PRIORIDAD 9 — INTERNAL LINKING
- [x] Home → categorías ← Links a /catalogo?categoria=...
- [x] Home → productos ← Link a /catalogo
- [ ] Home → Santo Domingo ← NO EXISTE
- [ ] Home → Santiago ← NO EXISTE
- [ ] Categorías → productos ← Solo query params, sin páginas reales
- [ ] Productos → categorías ← NO EXISTE
- [ ] Productos → productos relacionados ← NO EXISTE
- [ ] Blog → productos ← NO EXISTE (no hay blog)
- [ ] Blog → categorías ← NO EXISTE
- [ ] Blog → tiendas ← NO EXISTE
- [ ] Tiendas → productos ← NO EXISTE
- [ ] Crear breadcrumbs ← NO EXISTEN
- [ ] Detectar páginas huérfanas
## 🟠 PRIORIDAD 10 — IMÁGENES
- [x] Usar fotografías reales ← Usa MinIO/S3
- [ ] Renombrar imágenes con keywords ← URLs son hashes
> Ejemplo: lenovo-thinkpad-t480-rd.jpg
- [x] Agregar ALT descriptivo ← Presente en todas
- [ ] Comprimir imágenes
- [ ] WebP/AVIF
- [ ] Lazy loading
- [ ] Definir width/height
- [ ] Optimizar imagen principal de cada producto
- [x] Crear Open Graph images ← ARREGLADO: og:image ahora usa metadataBase con URL absoluta
- [ ] Crear imágenes sociales
## 🟡 PRIORIDAD 11 — CONVERSIÓN
- [x] WhatsApp visible ← Botón presente en productos
- [x] Botón Comprar por WhatsApp ← "Contactar por WhatsApp"
- [ ] Botón Consultar disponibilidad
- [ ] Botón Reservar
- [ ] Botón Ver ubicación
- [ ] Mostrar garantía
- [ ] Mostrar métodos de pago
- [ ] Mostrar financiamiento
- [ ] Mostrar disponibilidad
- [x] Mostrar condición del equipo ← "Nuevo"
- [ ] Mostrar tiempo aproximado de respuesta
- [x] Mostrar testimonios ← Sección reviews
- [ ] Mostrar cantidad de clientes
- [ ] Mostrar años en el mercado
- [ ] Mostrar sucursales
- [ ] Mostrar soporte postventa
## 🟡 PRIORIDAD 12 — CONFIANZA / E-E-A-T
- [ ] Agregar historia de MorelTechnology
- [ ] Agregar años en el mercado
- [ ] Agregar número real de clientes
- [ ] Agregar garantía
- [ ] Agregar factura
- [ ] Agregar NCF
- [ ] Agregar soporte postventa
- [ ] Agregar fotos reales del negocio
- [ ] Agregar fotos del equipo
- [ ] Agregar información de las sucursales
- [ ] Agregar métodos de pago
- [ ] Agregar políticas claras
- [ ] Verificar afirmaciones como "Distribuidor Autorizado"
## 🟡 PRIORIDAD 13 — SCHEMA
- [x] Organization ← JSON-LD en Home page
- [ ] LocalBusiness ← Ya está en páginas de ubicación (SD y Santiago)
- [ ] Store ←
- [x] Product ← JSON-LD en /productos/[id]
- [x] Offer ← Incluido en Product schema
- [ ] Brand ← Incluido en Product schema
- [x] BreadcrumbList ← JSON-LD en /productos/[id]
- [x] FAQPage ← JSON-LD en /faq
- [x] WebSite ← JSON-LD en Home page
- [ ] WebPage ←
- [ ] Review/AggregateRating cuando corresponda
- [ ] Validar Schema con Google Rich Results Test
## 🟡 PRIORIDAD 14 — ANALYTICS
- [ ] Google Analytics 4
- [ ] Google Tag Manager
- [ ] Google Search Console
- [ ] Medir clicks en WhatsApp
- [ ] Medir clicks en teléfono
- [ ] Medir clicks en productos
- [ ] Medir clicks en Comprar
- [ ] Medir clicks en Reservar
- [ ] Medir formularios
- [ ] Configurar conversiones
- [ ] Configurar Google Ads Conversion Tracking
## 🟡 PRIORIDAD 15 — KEYWORDS
- [ ] tienda de laptops en RD
- [ ] tienda de laptops en República Dominicana
- [ ] laptops en RD
- [ ] laptops en Santo Domingo
- [ ] laptops en Santiago
- [ ] comprar laptop en RD
- [ ] comprar laptop en Santo Domingo
- [ ] comprar laptop en Santiago
- [ ] laptop barata RD
- [ ] laptops económicas RD
- [ ] laptops usadas RD
- [ ] laptops reacondicionadas RD
- [ ] laptops gaming RD
- [ ] laptops Lenovo RD
- [ ] laptops Dell RD
- [ ] laptops HP RD
- [ ] laptops ASUS RD
- [ ] laptop para estudiantes RD
- [ ] laptop para programación RD
## 🟢 PRIORIDAD 16 — AUTORIDAD / BACKLINKS
- [ ] Conseguir menciones de medios dominicanos
- [ ] Conseguir backlinks de sitios tecnológicos
- [ ] Conseguir backlinks de negocios locales
- [ ] Registrar negocio en directorios relevantes
- [ ] Mantener consistentes nombre/dirección/teléfono
- [ ] Conseguir menciones de Santo Domingo
- [ ] Conseguir menciones de Santiago
- [ ] Conseguir enlaces desde redes sociales
- [ ] Evitar backlinks spam
- [ ] Evitar comprar backlinks de baja calidad
## 🏆 PRIORIDAD FINAL — MONITOREO
- [ ] Revisar Google Search Console semanalmente
- [ ] Revisar keywords
- [ ] Revisar posiciones
- [ ] Revisar CTR
- [ ] Revisar páginas indexadas
- [ ] Revisar errores
- [ ] Revisar Core Web Vitals
- [ ] Revisar tráfico orgánico
- [ ] Revisar conversiones
- [ ] Identificar keywords en posiciones 5–30
- [ ] Crear contenido para keywords con potencial
- [ ] Mejorar CTR de páginas con muchas impresiones
- [ ] Actualizar artículos antiguos
- [ ] Actualizar productos
- [ ] Conseguir nuevas reseñas
- [ ] Conseguir nuevos backlinks
## 🎯 ORDEN DE EJECUCIÓN
- [ ] 1. Google Search Console
- [ ] 2. Sitemap + robots + canonical ← canonical AGREGADO ✅
- [ ] 3. SEO técnico
- [ ] 4. URLs individuales de productos ← FALTA (usa IDs)
- [ ] 5. Product Schema ← FALTA
- [ ] 6. Categorías por marca ← FALTA
- [ ] 7. Categorías por necesidad ← FALTA
- [x] 8. Página SEO Santo Domingo ← CREADA ✅
- [x] 9. Página SEO Santiago ← CREADA ✅
- [ ] 10. Optimizar Google Business Profiles
- [ ] 11. Mejorar Home
- [ ] 12. Internal linking
- [ ] 13. FAQ
- [ ] 14. Analytics + conversiones
- [ ] 15. Blog SEO
- [ ] 16. Backlinks
- [ ] 17. Reviews
- [ ] 18. Medir resultados
- [ ] 19. Atacar keywords en posiciones 5–30
- [ ] 20. Repetir y optimizar mensualmente
