import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { getProducts, getProductsByBrand, PAGE_SIZE_ALL } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, Truck, CheckCircle2, Tag } from "lucide-react";

const brands: Record<string, {
  name: string;
  title: string;
  description: string;
  longDescription: string;
  faqs: { q: string; a: string }[];
}> = {
  lenovo: {
    name: "Lenovo",
    title: "Laptops Lenovo en República Dominicana | Morel Technology",
    description: "Compra laptops Lenovo en RD. ThinkPad, IdeaPad, Legion y más. Garantía certificada, financiamiento y envío a todo el país.",
    longDescription: "Lenovo es una de las marcas líderes en tecnología a nivel mundial, reconocida por la durabilidad y rendimiento de sus equipos. En Morel Technology ofrecemos una amplia gama de laptops Lenovo para cada necesidad: desde la serie ThinkPad para profesionales, hasta la serie Legion para gaming.",
    faqs: [
      { q: "¿Qué series de Lenovo tienen?", a: "Trabajamos con ThinkPad (profesional), IdeaPad (uso general), Legion (gaming) y Yoga (convertibles). Cada serie está diseñada para un perfil de usuario específico." },
      { q: "¿Las laptops Lenovo tienen garantía?", a: "Sí, todos nuestros equipos Lenovo incluyen garantía. Los nuevos tienen hasta 1 año y los usados 6 meses." },
      { q: "¿Puedo financiar una laptop Lenovo?", a: "¡Por supuesto! Ofrecemos financiamiento con varias entidades financieras. Aparta tu laptop Lenovo con cuotas cómodas." },
    ],
  },
  dell: {
    name: "Dell",
    title: "Laptops Dell en República Dominicana | Morel Technology",
    description: "Compra laptops Dell en RD. Inspiron, XPS, Latitude, Alienware. Garantía certificada, financiamiento y envío a todo el país.",
    longDescription: "Dell es sinónimo de innovación y calidad en el mundo de las computadoras. En Morel Technology encontrarás las mejores laptops Dell para trabajo, diseño y gaming. La serie XPS es ideal para profesionales creativos, mientras que Alienware ofrece el máximo rendimiento gaming.",
    faqs: [
      { q: "¿Cuál es la mejor laptop Dell para trabajo?", a: "La serie Dell XPS es la preferida por profesionales por su pantalla InfinityEdge, ligereza y potencia. La serie Latitude es ideal para empresas." },
      { q: "¿Tienen Dell Alienware?", a: "Sí, contamos con laptops Alienware de alta gama para gaming. Consulta disponibilidad por WhatsApp." },
      { q: "¿Dell ofrece buenas opciones usadas?", a: "Las Dell Latitude y XPS son excelentes opciones usadas. Pasan por riguroso control de calidad antes de venderse." },
    ],
  },
  hp: {
    name: "HP",
    title: "Laptops HP en República Dominicana | Morel Technology",
    description: "Compra laptops HP en RD. Spectre, Envy, Pavilion, Omen. Garantía certificada, financiamiento y envío a todo el país.",
    longDescription: "HP (Hewlett-Packard) ofrece una de las líneas de laptops más completas del mercado. En Morel Technology tenemos laptops HP para todos los presupuestos y necesidades, desde la serie Pavilion para uso diario hasta la serie Omen para gaming de alta gama.",
    faqs: [
      { q: "¿HP es buena marca de laptops?", a: "HP es una de las marcas más confiables del mundo. Ofrece desde opciones económicas hasta equipos de alta gama con excelente relación calidad-precio." },
      { q: "¿Qué es la serie HP Omen?", a: "HP Omen es la línea gaming de HP, con procesadores potentes, tarjetas gráficas dedicadas y sistemas de enfriamiento avanzados." },
      { q: "¿Tienen laptops HP para estudiantes?", a: "Sí, la serie HP Pavilion es perfecta para estudiantes: ligera, con buena batería y precio accesible." },
    ],
  },
  apple: {
    name: "Apple",
    title: "MacBooks en República Dominicana | Morel Technology",
    description: "Compra MacBook Air y MacBook Pro en RD. Chips M1, M2, M3. Garantía certificada, financiamiento y envío a todo el país.",
    longDescription: "Los MacBook de Apple son la preferida de profesionales creativos, programadores y diseñadores. En Morel Technology ofrecemos MacBook Air y MacBook Pro con los últimos chips Apple Silicon (M1, M2, M3) a precios competitivos en República Dominicana.",
    faqs: [
      { q: "¿MacBook Air o MacBook Pro?", a: "El MacBook Air es ideal para uso general y portabilidad. El MacBook Pro es para profesionales que necesitan más potencia para edición de video, 3D o desarrollo pesado." },
      { q: "¿Los MacBook son compatibles con software de Windows?", a: "Sí, con software como Parallels o Boot Camp puedes ejecutar aplicaciones de Windows en tu Mac." },
      { q: "¿Aceptan macOS para programación?", a: "macOS es una de las mejores plataformas para programar, especialmente para desarrollo iOS, web y con Python." },
    ],
  },
  asus: {
    name: "ASUS",
    title: "Laptops ASUS en República Dominicana | Morel Technology",
    description: "Compra laptops ASUS en RD. ROG, ZenBook, Vivobook, TUF Gaming. Garantía certificada, financiamiento y envío a todo el país.",
    longDescription: "ASUS es una marca taiwanesa reconocida por la innovación en tecnología gaming y productividad. En Morel Technology encontrarás laptops ASUS ROG para gaming extremo, ZenBook para profesionales y Vivobook para uso diario.",
    faqs: [
      { q: "¿Qué es ASUS ROG?", a: "ASUS ROG (Republic of Gamers) es la línea gaming premium de ASUS, con los mejores componentes y diseños agresivos para gamers exigentes." },
      { q: "¿ASUS ZenBook es bueno para trabajar?", a: "Sí, los ZenBook son ultrabooks delgados y potentes, perfectos para profesionales que necesitan portabilidad sin sacrificar rendimiento." },
      { q: "¿Tienen laptops ASUS gaming?", a: "Sí, contamos con series ROG y TUF Gaming. ASUS es una de las mejores marcas para gaming en RD." },
    ],
  },
  acer: {
    name: "Acer",
    title: "Laptops Acer en República Dominicana | Morel Technology",
    description: "Compra laptops Acer en RD. Predator, Nitro, Aspire, Swift. Garantía certificada, financiamiento y envío a todo el país.",
    longDescription: "Acer ofrece laptops para todos los presupuestos, desde la serie Predator para gaming de alta gama hasta la serie Aspire para uso diario. En Morel Technology tenemos las mejores laptops Acer con garantía local.",
    faqs: [
      { q: "¿Acer Predator es buena para gaming?", a: "Sí, la serie Predator es la línea gaming premium de Acer, con componentes de alto rendimiento y sistemas de enfriamiento avanzados." },
      { q: "¿Qué es la serie Nitro?", a: "Acer Nitro es la línea gaming de rango medio, ofreciendo excelente relación calidad-precio para gamers que buscan potencia sin gastar de más." },
      { q: "¿Tienen laptops Acer económicas?", a: "Sí, la serie Aspire ofrece opciones accesibles para estudiantes y uso doméstico sin sacrificar calidad." },
    ],
  },
  razer: {
    name: "Razer",
    title: "Laptops Razer en República Dominicana | Morel Technology",
    description: "Compra laptops Razer en RD. Razer Blade, Razer Blade Stealth. Garantía certificada, financiamiento y envío a todo el país.",
    longDescription: "Razer es la marca premium del gaming, conocida por sus laptops con diseño elegante y componentes de última generación. En Morel Technology ofrecemos las exclusivas laptops Razer Blade para gamers que buscan lo mejor de lo mejor.",
    faqs: [
      { q: "¿Por qué Razer es tan caro?", a: "Razer utiliza materiales premium (aluminio CNC), componentes de máxima gama y diseños exclusivos. Es la marca Apple del gaming." },
      { q: "¿Razer es solo para gaming?", a: "Aunque Razer se especializa en gaming, sus laptops son excelentes para creadores de contenido gracias a sus pantallas calibradas y potencia bruta." },
      { q: "¿Tienen Razer en RD?", a: "Sí, en Morel Technology somos distribuidores de laptops Razer. Consulta disponibilidad por WhatsApp." },
    ],
  },
};

const categories: Record<string, {
  name: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  faqs: { q: string; a: string }[];
}> = {
  gaming: {
    name: "Gaming",
    title: "Laptops Gaming en República Dominicana | Morel Technology",
    description: "Compra las mejores laptops gaming en RD. ASUS ROG, Razer, Alienware y más. Garantía certificada, financiamiento y envío a todo el país.",
    longDescription: "El mundo del gaming ha evolucionado y hoy en día, una laptop gaming en República Dominicana no es solo para jugar; es una estación de trabajo móvil para creadores de contenido, ingenieros y arquitectos. La potencia de procesamiento que ofrecen marcas como ASUS ROG, Razer y Dell Alienware supera a muchas computadoras de escritorio tradicionales.",
    tags: ["gamer", "gaming"],
    faqs: [
      { q: "¿Qué specs necesita una laptop gaming?", a: "Mínimo 16GB RAM, procesador Intel i7 o AMD Ryzen 7, y tarjeta gráfica dedicada (NVIDIA RTX 3060 o superior). Para gaming competitivo recomendamos 32GB RAM y RTX 4070." },
      { q: "¿Las laptops gaming son buenas para trabajo?", a: "Sí! La potencia de una laptop gaming la hace ideal para edición de video, diseño 3D, programación pesada y cualquier tarea que requiera alto rendimiento." },
      { q: "¿Ofrecen garantía en laptops gaming?", a: "Sí, todas nuestras laptops gaming incluyen garantía de 6 meses a 1 año según el estado del equipo." },
    ],
  },
  programacion: {
    name: "Programación",
    title: "Laptops para Programar en República Dominicana | Morel Technology",
    description: "Laptops para desarrollo de software en RD. 16GB+ RAM, procesadores potentes. Docker, VS Code y más.",
    longDescription: "Sabemos que como desarrollador, tu laptop no es un gasto, es tu herramienta de producción. Encuentra equipos que soporten Docker, VS Code y compilación pesada sin despeinarse. En Morel Technology tenemos las mejores laptops para programar en RD con garantía local.",
    tags: ["programacion", "developer"],
    faqs: [
      { q: "¿Cuánta RAM necesito para programar?", a: "Mínimo 16GB para desarrollo web. Si usas Docker, VMs o Android Studio, recomendamos 32GB para un flujo de trabajo sin interrupciones." },
      { q: "¿Mac o Windows para programar?", a: "Depende de tu stack. macOS es ideal para iOS/web development. Windows/Linux es mejor para .NET, game development y DevOps. Ambas opciones son excelentes." },
      { q: "¿Qué procesador es mejor para desarrollo?", a: "Intel Core i7/i9 o Apple Silicon M1/M2/M3. Para compilación pesada y containers, los chips Apple Silicon ofrecen mejor rendimiento por vatio." },
    ],
  },
  estudiantes: {
    name: "Estudiantes",
    title: "Laptops para Estudiantes en República Dominicana | Morel Technology",
    description: "Laptops económicas para estudiantes en RD. Garantía, financiamiento y envío a todo el país.",
    longDescription: "En Morel Technology sabemos que un estudiante necesita una laptop confiable sin romper el presupuesto. Ofrecemos laptops para estudiantes en RD que combinan portabilidad, batería duradera y rendimiento suficiente para tareas académicas, investigaciones y proyectos.",
    tags: ["estudiantes", "estudio"],
    faqs: [
      { q: "¿Cuánto debe costar una laptop para estudiantes?", a: "Desde RD$15,000 hasta RD$35,000 puedes encontrar excelentes opciones. Lo importante es que tenga al menos 8GB de RAM y SSD para que sea rápida." },
      { q: "¿Necesito una laptop potente para la universidad?", a: "Depende de la carrera. Para derecho, administración o humanidades, con 8GB RAM y un procesador i5 es suficiente. Para ingeniería o arquitectura, necesitarás más potencia." },
      { q: "¿Tienen opciones de financiamiento para estudiantes?", a: "Sí! Ofrecemos facilidades de pago para que puedas tener tu laptop sin esperar. Consulta las opciones disponibles." },
    ],
  },
  diseno: {
    name: "Diseño y Arquitectura",
    title: "Laptops para Diseño y Arquitectura en República Dominicana | Morel Technology",
    description: "Laptops para diseño gráfico, arquitectura y edición en RD. Pantallas de alta calidad y GPU potente.",
    longDescription: "Los diseñadores gráficos, arquitectos y creadores de contenido necesitan laptops con pantallas de color preciso y tarjetas gráficas potentes para ejecutar Adobe Creative Suite, AutoCAD, Revit y Blender sin problemas. En Morel Technology tenemos las mejores laptops para diseño en RD.",
    tags: ["diseno", "arquitectura", "diseño"],
    faqs: [
      { q: "¿Qué GPU necesito para diseño?", a: "Para diseño gráfico 2D, con Intel Iris X o AMD Radeon es suficiente. Para 3D, video editing y arquitectura, necesitas NVIDIA RTX con al menos 6GB VRAM." },
      { q: "¿Son buenas las MacBook para diseño?", a: "Excelentes. Los chips Apple Silicon ofrecen rendimiento excepcional para Adobe Creative Suite y la pantalla Retina tiene excelente reproducción de color." },
      { q: "¿Puedo correr AutoCAD en una laptop?", a: "Sí, con al menos 16GB RAM y una GPU dedicada. Para renderizado 3D en Revit, recomendamos 32GB RAM y RTX 3060 o superior." },
    ],
  },
  oficina: {
    name: "Oficina",
    title: "Laptops de Oficina en República Dominicana | Morel Technology",
    description: "Laptops para trabajo de oficina en RD. Excelente batería, portabilidad y rendimiento para productividad.",
    longDescription: "Para el día a día en la oficina, necesitas una laptop que combine portabilidad, batería duradera y rendimiento suficiente para multitarea con Excel, Word, PowerPoint y navegadores. En Morel Technology ofrecemos laptops de oficina en RD con garantía local.",
    tags: ["oficina", "productividad", "trabajo"],
    faqs: [
      { q: "¿Qué specs para una laptop de oficina?", a: "8GB RAM mínimo (16GB recomendado), procesador Intel i5 o superior, SSD de 256GB y buena batería. No necesitas GPU dedicada." },
      { q: "¿Cuánto dura la batería?", a: "Nuestras laptops de oficina ofrecen entre 6 y 12 horas de batería, dependiendo del modelo y uso. Las series Dell Latitude y Lenovo ThinkPad tienen la mejor duración." },
      { q: "¿Cuál es la mejor laptop para oficina?", a: "Depende del presupuesto. Dell Latitude, Lenovo ThinkPad y HP EliteBook son las más confiables para entornos corporativos." },
    ],
  },
};

function isBrand(slug: string): boolean {
  return slug in brands;
}

function isCategory(slug: string): boolean {
  return slug in categories;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const brandSlugs = Object.keys(brands);
  const categorySlugs = Object.keys(categories);
  return [...brandSlugs, ...categorySlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brandData = brands[slug];
  const categoryData = categories[slug];

  if (brandData) {
    return {
      title: brandData.title,
      description: brandData.description,
      alternates: { canonical: `/laptops/${slug}` },
      openGraph: { title: brandData.title, description: brandData.description },
    };
  }

  if (categoryData) {
    return {
      title: categoryData.title,
      description: categoryData.description,
      alternates: { canonical: `/laptops/${slug}` },
      openGraph: { title: categoryData.title, description: categoryData.description },
    };
  }

  return { title: "No encontrada | Morel Technology" };
}

export default async function LaptopSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const brandData = brands[slug];
  const categoryData = categories[slug];

  if (!brandData && !categoryData) {
    notFound();
  }

  const isBrandPage = !!brandData;
  const data = brandData || categoryData!;

  const products = isBrandPage
    ? await getProductsByBrand(brandData!.name)
    : (await getProducts(0, PAGE_SIZE_ALL, undefined, undefined, categoryData!.tags[0])).products;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://moreltechnologyrd.com" },
      { "@type": "ListItem", position: 2, name: "Laptops", item: "https://moreltechnologyrd.com/catalogo" },
      { "@type": "ListItem", position: 3, name: data.name, item: `https://moreltechnologyrd.com/laptops/${slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map(faq => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const whatsappMessage = isBrandPage
    ? `Hola, estoy interesado en una laptop ${data.name}. ¿Qué tienen disponible?`
    : `Hola, estoy buscando una laptop para ${data.name.toLowerCase()}. ¿Qué tienen disponible?`;

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-muted/30 pt-16 pb-4">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-primary transition-colors">Laptops</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{data.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Tag className="w-4 h-4" />
              {data.name}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              {isBrandPage ? `Laptops ${data.name}` : `Laptops ${data.name}`} en <span className="text-primary">República Dominicana</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {data.longDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <WhatsAppDropdown
                message={whatsappMessage}
                className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-green-600/20"
              >
                Consultar Inventario
              </WhatsAppDropdown>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="border-y border-border/50 py-6 bg-muted/20">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Equipos Certificados</div>
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Garantía Real</div>
          <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-blue-500" /> Envío Nacional</div>
        </div>
      </div>

      {/* Products */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                {isBrandPage ? `Laptops ${data.name} Disponibles` : `Laptops para ${data.name} Disponibles`}
              </h2>
              <p className="text-muted-foreground mt-2">
                {products.length > 0
                  ? `${products.length} equipo${products.length > 1 ? "s" : ""} encontrado${products.length > 1 ? "s" : ""}`
                  : "Consulta disponibilidad por WhatsApp"}
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-muted/30 rounded-[2rem] border border-dashed border-border/50 space-y-4">
              <p className="text-xl font-bold">
                No tenemos {isBrandPage ? `laptops ${data.name}` : `laptops para ${data.name.toLowerCase()}`} en stock actualmente
              </p>
              <p className="text-muted-foreground">Contáctanos por WhatsApp y te ayudamos a encontrar el equipo ideal.</p>
              <WhatsAppDropdown
                message={whatsappMessage}
                className="h-12 px-6 rounded-xl font-bold"
              >
                Consultar Disponibilidad
              </WhatsAppDropdown>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight mb-12 text-center">
            {isBrandPage
              ? `Preguntas Frecuentes sobre ${data.name}`
              : `Preguntas Frecuentes sobre Laptops para ${data.name}`}
          </h2>
          <Accordion className="space-y-4">
            {data.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border/50 bg-card rounded-2xl px-6 overflow-hidden">
                <AccordionTrigger className="hover:no-underline py-6 font-semibold text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold">¿No encontraste lo que buscas?</h2>
          <p className="text-primary-foreground/80">
            {isBrandPage
              ? `Escríbenos y te ayudamos a encontrar la laptop ${data.name} perfecta para ti.`
              : `Escríbenos y te ayudamos a encontrar la laptop ideal para ${data.name.toLowerCase()}.`}
          </p>
          <WhatsAppDropdown
            message={whatsappMessage}
            className="h-14 px-8 rounded-2xl text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-xl"
          >
            Hablar con un asesor
          </WhatsAppDropdown>
        </div>
      </section>

      {/* Schemas */}
      <Script id="laptop-breadcrumb-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="laptop-faq-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}
