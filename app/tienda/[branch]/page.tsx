import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { MapPin, Phone, Clock, ShieldCheck, Truck, CreditCard, MessageCircle } from "lucide-react";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { ProductCard } from "@/components/product-card";
import { getProducts, PAGE_SIZE_DEFAULT } from "@/lib/api";
import { branches } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const branchData: Record<string, {
  title: string;
  description: string;
  canonical: string;
  phone: string;
  benefits: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  schema: {
    telephone: string;
    streetAddress: string;
    latitude: number;
    longitude: number;
  };
}> = {
  moreltechnology: {
    title: "Tienda de Laptops en Santo Domingo | Morel Technology",
    description: "Laptops nuevas y usadas en Santo Domingo con garantía. Lenovo, Dell, HP, ASUS. Financiamiento y envío express.",
    canonical: "/tienda/moreltechnology",
    phone: "809-617-5517",
    benefits: [
      { title: "Garantía Certificada", desc: "Todos nuestros equipos incluyen garantía real. Los usados tienen 6 meses; los nuevos hasta 1 año." },
      { title: "Envío Express", desc: "Envío el mismo día en Santo Domingo. También realizamos envíos a todo el país." },
      { title: "Financiamiento", desc: "Aparta tu laptop con cuotas cómodas. Aprobación rápida con solo tu cédula." },
    ],
    faqs: [
      { q: "¿Dónde están ubicados?", a: "Estamos en El Edén de Villa Mella, Calle Ceuta frente a la Calle 7. Fácil acceso desde Santo Domingo Norte." },
      { q: "¿Tienen laptops usadas?", a: "Sí, tenemos una excelente selección de laptops usadas certificadas de marcas como Lenovo, Dell y HP. Todas con garantía de 6 meses." },
      { q: "¿Puedo comprar por WhatsApp?", a: "¡Claro! Escríbenos al 809-617-5517 y te atendemos de inmediato." },
      { q: "¿Hacen envíos a otras provincias?", a: "Sí, realizamos envíos a todo el país a través de servicios de transporte confiables." },
    ],
    schema: {
      telephone: "+1-809-617-5517",
      streetAddress: "El Edén de Villa Mella, Calle Ceuta frente a la Calle 7",
      latitude: 18.5354915,
      longitude: -69.8955395,
    },
  },
  mts: {
    title: "Tienda de Laptops en Santiago | Morel Technology",
    description: "Laptops nuevas y usadas en Santiago con garantía. Lenovo, Dell, HP, ASUS. Financiamiento disponible.",
    canonical: "/tienda/mts",
    phone: "809-421-5517",
    benefits: [
      { title: "Garantía Certificada", desc: "Todos nuestros equipos incluyen garantía real. Los usados tienen 6 meses; los nuevos hasta 1 año." },
      { title: "Envío a todo el Cibao", desc: "Realizamos envíos a todas las provincias del Cibao en 24-48 horas a través de servicios de transporte confiables." },
      { title: "Financiamiento", desc: "Aparta tu laptop con cuotas cómodas. Aprobación rápida con solo tu cédula." },
    ],
    faqs: [
      { q: "¿Dónde están ubicados en Santiago?", a: "Estamos en Plaza Pamela 3, Carrera Buena Vista, Santiago. Fácil acceso desde cualquier punto de la ciudad." },
      { q: "¿Tienen laptops usadas en Santiago?", a: "Sí, tenemos una excelente selección de laptops usadas certificadas de marcas como Lenovo, Dell y HP. Todas con garantía de 6 meses." },
      { q: "¿Puedo comprar por WhatsApp desde Santiago?", a: "¡Claro! Escríbenos al 809-421-5517 y te atendemos de inmediato." },
      { q: "¿Hacen envíos a otras provincias del Cibao?", a: "Sí, realizamos envíos a todas las provincias del Cibao a través de MetroPac, Caribe Pack y BM Cargo." },
    ],
    schema: {
      telephone: "+1-809-421-5517",
      streetAddress: "Plaza Pamela 3, Carr. Buena Vista",
      latitude: 19.4804643,
      longitude: -70.6834893,
    },
  },
};

interface PageProps {
  params: Promise<{ branch: string }>;
}

export async function generateStaticParams() {
  return Object.keys(branchData).map((branch) => ({ branch }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { branch } = await params;
  const data = branchData[branch];

  if (!data) {
    return { title: "Sucursal no encontrada | Morel Technology" };
  }

  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: data.canonical },
    openGraph: { title: data.title, description: data.description },
  };
}

export default async function TiendaBranchPage({ params }: PageProps) {
  const { branch } = await params;
  const data = branchData[branch];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Sucursal no encontrada</h1>
          <Link href="/" className="text-primary hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const branchInfo = branches.find(b => b.id === branch);
  const { products } = await getProducts(0, PAGE_SIZE_DEFAULT, undefined, branch);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Morel Technology - ${branchInfo?.name.replace("Sucursal ", "") || branch}`,
    description: data.description,
    url: `https://moreltechnologyrd.com${data.canonical}`,
    telephone: data.schema.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.schema.streetAddress,
      addressLocality: branchInfo?.name.replace("Sucursal ", "") || branch,
      addressCountry: "DO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: data.schema.latitude,
      longitude: data.schema.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    brand: {
      "@type": "Brand",
      name: "Morel Technology",
    },
    priceRange: "$$",
  };

  const city = branchInfo?.name.replace("Sucursal ", "") || branch;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-white">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-2xl" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-sm font-bold uppercase tracking-widest mb-6 border border-white/20">
              <MapPin className="w-4 h-4" />
              {city}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
              Tienda de Laptops en <br className="hidden md:block" />
              <span className="text-white/60">{city}</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-8 max-w-xl">
              La mejor tienda de tecnología {branch === "mts" ? "del Cibao" : "de Santo Domingo"}. Equipos nuevos y usados con garantía real, financiamiento accesible y envío a toda {branch === "mts" ? "la región norte" : "la ciudad"}.
            </p>
            <div className="flex flex-wrap gap-4">
              <WhatsAppDropdown
                message={`Hola, estoy interesado en una laptop en la sucursal de ${city}.`}
                className="h-14 px-8 rounded-2xl text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-xl"
              >
                Consultar por WhatsApp
              </WhatsAppDropdown>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-card border border-border/50 rounded-3xl space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="font-bold">Dirección</h2>
              <p className="text-sm text-muted-foreground">{branchInfo?.address}</p>
            </div>
            <div className="p-6 bg-card border border-border/50 rounded-3xl space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="font-bold">Teléfono</h2>
              <p className="text-sm text-muted-foreground">{data.phone}</p>
            </div>
            <div className="p-6 bg-card border border-border/50 rounded-3xl space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="font-bold">Horario</h2>
              <p className="text-sm text-muted-foreground">Lun - Sáb: 9:00 AM - 7:00 PM</p>
            </div>
            <div className="p-6 bg-card border border-border/50 rounded-3xl space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h2 className="font-bold">WhatsApp</h2>
              <p className="text-sm text-muted-foreground">Respuesta inmediata</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      {branchInfo?.embedLink && (
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="rounded-[2.5rem] overflow-hidden border border-border/50 shadow-xl">
              <iframe
                src={branchInfo.embedLink}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Ubicación Morel Technology ${city}`}
              />
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black tracking-tight mb-12 text-center">
            ¿Por qué comprar en <span className="text-primary">{city}</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.benefits.map((b, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-card border border-border/50 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                  {i === 0 && <ShieldCheck className="w-8 h-8" />}
                  {i === 1 && <Truck className="w-8 h-8" />}
                  {i === 2 && <CreditCard className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold">{b.title}</h3>
                <p className="text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      {products.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl font-black tracking-tight">
                Laptops disponibles en <span className="text-primary">{city}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Equipos disponibles para recogida inmediata en sucursal o envío a {branch === "mts" ? "todo el Cibao" : "toda la ciudad"}.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight mb-12 text-center">
            Preguntas frecuentes en <span className="text-primary">{city}</span>
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
      <section className="py-20 text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold">Visítanos en {city}</h2>
          <p className="text-muted-foreground">Nuestro equipo está listo para asesorarte y ayudarte a encontrar la laptop perfecta para ti.</p>
          <WhatsAppDropdown
            message={`Hola, quiero visitar la sucursal de ${city}. ¿Cuál es el horario?`}
            className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-green-600/20"
          >
            Chatear con un asesor
          </WhatsAppDropdown>
        </div>
      </section>

      {/* Schema */}
      <Script
        id={`tienda-${branch}-schema`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </div>
  );
}
