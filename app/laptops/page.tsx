import { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { productUrl } from "@/lib/utils";
import { brands, needsCategories } from "@/lib/data";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LaptopsClient } from "./laptops-client";
import { CheckCircle2, ChevronRight, Laptop, ShieldCheck, Tag, Truck } from "lucide-react";

const SITE_URL = "https://moreltechnologyrd.com";
const CATEGORY_LAPTOPS = "Laptops";
const PAGE_SIZE = 12;

function isLaptopCategory(category: string): boolean {
  const c = category.toLowerCase();
  return c === "laptop" || c === "laptops" || c === "portatiles" || c === "port\u00e1tiles";
}

const faqs = [
  {
    q: "¿Dónde comprar laptops en República Dominicana?",
    a: "En Morel Technology, tu tienda de tecnología en Santo Domingo con envío a todo el país. Tenemos laptops nuevas y usadas certificadas de Lenovo, Dell, HP, Apple, ASUS, Acer y Razer, con garantía real y atención por WhatsApp.",
  },
  {
    q: "¿Cuánto cuesta una laptop en Santo Domingo?",
    a: "Contamos con opciones para todos los presupuestos, desde laptops baratas para estudiantes hasta equipos gaming de alta gama. El precio depende del procesador, la memoria RAM y el almacenamiento. Consulta disponibilidad y precios actualizados por WhatsApp.",
  },
  {
    q: "¿Tienen laptops en oferta?",
    a: "Sí. Publicamos ofertas frecuentes con los mejores precios del mercado en República Dominicana. Activa el filtro de Ofertas en nuestro catálogo para ver solo los equipos con descuento.",
  },
  {
    q: "¿Qué laptop necesito para estudiar o trabajar?",
    a: "Para estudiantes recomendamos laptops ligeras con 8GB de RAM y disco SSD. Para trabajo o programación, al menos 16GB de RAM y un procesador Intel i5 o AMD Ryzen 5. Para diseño y gaming, una tarjeta gráfica dedicada y 16GB+ de RAM. Nuestros asesores te ayudan a elegir el equipo ideal.",
  },
  {
    q: "¿Ofrecen garantía, financiamiento y envío?",
    a: "Sí. Todas las laptops incluyen garantía local por escrito, financiamiento con varias entidades financieras y envío a todo el país, incluidos Santo Domingo y Santiago.",
  },
];

export const metadata: Metadata = {
  title: "Laptops en Santo Domingo, República Dominicana | Morel Technology",
  description:
    "Compra laptops en República Dominicana: nuevas y usadas certificadas en Santo Domingo. Lenovo, Dell, HP, Apple, ASUS, Acer y Razer con garantía, financiamiento y envío a todo el país.",
  keywords: [
    "laptops en republica dominicana",
    "laptops en santo domingo",
    "comprar laptop en RD",
    "laptops baratas en RD",
    "laptops en oferta",
    "laptops para estudiantes",
    "laptops para trabajo",
    "laptops gaming",
  ],
  alternates: {
    canonical: "/laptops",
  },
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: `${SITE_URL}/laptops`,
    title: "Laptops en Santo Domingo, República Dominicana | Morel Technology",
    description:
      "Compra laptops en República Dominicana: nuevas y usadas certificadas en Santo Domingo. Garantía, financiamiento y envío a todo el país.",
    siteName: "Morel Technology",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laptops en Santo Domingo, República Dominicana | Morel Technology",
    description:
      "Compra laptops en República Dominicana: nuevas y usadas certificadas en Santo Domingo. Garantía, financiamiento y envío a todo el país.",
  },
};

export default async function LaptopsPage() {
  const { products, total } = await getProducts(0, PAGE_SIZE, CATEGORY_LAPTOPS);

  // Keep only laptops from the API response, falling back to the raw list
  // if the catalog uses a different category label.
  const categorized = products.filter(p => isLaptopCategory(p.category));
  const initialProducts = categorized.length > 0 ? categorized : products;
  const initialTotal = Math.max(total, initialProducts.length);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Laptops en Santo Domingo, República Dominicana",
    numberOfItems: initialTotal,
    itemListElement: initialProducts.map((product, index) => {
      const lowestOfferPrice = product.prices.length > 0
        ? Math.min(...product.prices.map(p => (p.offerPrice && p.offerPrice > 0 ? p.offerPrice : p.priceOut)))
        : product.price;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: product.images[0],
          description: product.description,
          brand: { "@type": "Brand", name: product.brand },
          sku: product.id,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: product.prices[0]?.currency || "DOP",
            lowPrice: lowestOfferPrice,
            highPrice: product.price,
            availability: product.quantity > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${SITE_URL}${productUrl(product.slug)}`,
          },
        },
      };
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Laptops", item: `${SITE_URL}/laptops` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-muted/30 pt-16 pb-4">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Ruta de navegación">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Laptops</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Laptop className="w-4 h-4" />
              Catálogo de Laptops
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Laptops en <span className="text-primary">Santo Domingo, República Dominicana</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              En Morel Technology encontrarás las mejores laptops en Santo Domingo, República Dominicana: equipos nuevos y usados certificados de marcas como Lenovo, Dell, HP, Apple, ASUS, Acer y Razer. Ya sea que busques una laptop para estudiantes, para trabajo, para programar o una laptop gaming en oferta, tenemos el equipo ideal con garantía real, financiamiento y envío a todo el país.
            </p>
            <div className="flex flex-wrap gap-4">
              <WhatsAppDropdown
                message="Hola, estoy buscando una laptop. ¿Qué tienen disponible?"
                className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-green-600/20"
              >
                Consultar Inventario
              </WhatsAppDropdown>
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center h-14 px-8 rounded-2xl text-lg font-bold border border-border bg-card text-foreground hover:bg-muted transition-colors"
              >
                Ver disponibilidad
              </a>
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

      {/* Catalog (interactive) */}
      <div id="catalogo">
        <LaptopsClient initialProducts={initialProducts} initialTotal={initialTotal} />
      </div>

      {/* Explora por uso / categoría */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Laptops por uso</h2>
              <p className="text-muted-foreground text-sm mt-1">Encuentra la laptop ideal según lo que necesitas.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {needsCategories.map((need) => (
              <Link
                key={need.id}
                href={need.href}
                className="group bg-card rounded-2xl border border-border/50 p-6 hover:border-blue-600 hover:shadow-[0_8px_30px_-5px_rgba(0,102,204,0.25)] transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors duration-300">
                      Laptops para {need.name.toLowerCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{need.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Explora por marca */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Laptops por marca</h2>
              <p className="text-muted-foreground text-sm mt-1">Las marcas más confiables del mercado, con garantía local.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/laptops/${brand.slug}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-card text-sm font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors duration-300"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brand.color }} />
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-12 text-center">
            Preguntas frecuentes sobre laptops en RD
          </h2>
          <Accordion className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border/50 bg-card rounded-2xl px-6 overflow-hidden"
              >
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
          <h2 className="text-3xl font-bold">¿No encuentras la laptop perfecta?</h2>
          <p className="text-primary-foreground/80">
            Escríbenos por WhatsApp y un asesor te ayudará a elegir el equipo ideal según tu presupuesto y necesidades.
          </p>
          <WhatsAppDropdown
            message="Hola, necesito ayuda para elegir una laptop. ¿Me pueden asesorar?"
            className="h-14 px-8 rounded-2xl text-lg font-bold bg-card text-primary hover:bg-card/90 shadow-xl"
          >
            Hablar con un asesor
          </WhatsAppDropdown>
        </div>
      </section>

      {/* Structured data */}
      <script id="laptops-itemlist-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script id="laptops-breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script id="laptops-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}