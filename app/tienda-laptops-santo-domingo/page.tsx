import { Metadata } from "next";
import { MapPin, Phone, Clock, ShieldCheck, Truck, CreditCard, MessageCircle } from "lucide-react";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/api";
import { branches } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const branch = branches.find(b => b.id === "moreltechnology")!;

export const metadata: Metadata = {
  title: "Tienda de Laptops en Santo Domingo | Morel Technology",
  description: "Compra laptops nuevas y usadas en Santo Domingo. Lenovo, Dell, HP, ASUS con garantía certificada. Financiamiento disponible. Visítanos en Villa Mella.",
  alternates: {
    canonical: "/tienda-laptops-santo-domingo",
  },
  openGraph: {
    title: "Tienda de Laptops en Santo Domingo | Morel Technology",
    description: "Laptops nuevas y usadas con garantía en Santo Domingo. Financiamiento y envío express.",
  },
};

export default async function TiendaSantoDomingoPage() {
  const { products } = await getProducts(0, 20);

  const faqs = [
    {
      q: "¿Dónde están ubicados en Santo Domingo?",
      a: "Estamos en El Edén de Villa Mella, Calle Ceuta frente a la Calle 7. Una ubicación estratégica con fácil acceso y parqueo.",
    },
    {
      q: "¿Tienen laptops usadas en Santo Domingo?",
      a: "Sí, contamos con una amplia selección de laptops usadas certificadas (Grado A) de marcas como Lenovo, Dell y HP. Todas con garantía de 3 a 6 meses.",
    },
    {
      q: "¿Puedo comprar por WhatsApp desde Santo Domingo?",
      a: "¡Por supuesto! Escríbenos al 809-617-5517 y te asesoramos personalmente. También puedes hacer tu pedido por ahí y lo recibes en tu domicilio.",
    },
    {
      q: "¿Ofrecen financiamiento en la sucursal?",
      a: "Sí, trabajamos con varias entidades financieras. Solo necesitas tu cédula, cuenta bancaria activa y comprobante de ingresos.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 opacity-10">
          <MapPin className="w-full h-full scale-150 -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest mb-6">
              <MapPin className="w-4 h-4" />
              Santo Domingo
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
              Tienda de Laptops en <span className="text-black/30">Santo Domingo</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed mb-8">
              Tu tienda de tecnología de confianza en el Distrito Nacional. Equipos nuevos y usados con garantía real, financiamiento accesible y atención personalizada por WhatsApp.
            </p>
            <div className="flex flex-wrap gap-4">
              <WhatsAppDropdown
                message="Hola, estoy interesado en una laptop en la sucursal de Santo Domingo."
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
              <h3 className="font-bold">Dirección</h3>
              <p className="text-sm text-muted-foreground">{branch.address}</p>
            </div>
            <div className="p-6 bg-card border border-border/50 rounded-3xl space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold">Teléfono</h3>
              <p className="text-sm text-muted-foreground">809-617-5517</p>
            </div>
            <div className="p-6 bg-card border border-border/50 rounded-3xl space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold">Horario</h3>
              <p className="text-sm text-muted-foreground">Lun - Sáb: 9:00 AM - 7:00 PM</p>
            </div>
            <div className="p-6 bg-card border border-border/50 rounded-3xl space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">Respuesta inmediata</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-[2.5rem] overflow-hidden border border-border/50 shadow-xl">
            <iframe
              src={branch.embedLink}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Morel Technology Santo Domingo"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black tracking-tight mb-12 text-center">¿Por qué comprar en <span className="text-primary">Santo Domingo</span>?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Garantía Certificada", desc: "Todos nuestros equipos incluyen garantía real. Los usados tienen 3-6 meses; los nuevos hasta 1 año." },
              { icon: Truck, title: "Envío Express", desc: "Recibe tu equipo hoy mismo en Santo Domingo. Servicio de delivery en el mismo día." },
              { icon: CreditCard, title: "Financiamiento", desc: "Aparta tu laptop con cuotas cómodas. Aprobación rápida con solo tu cédula." },
            ].map((b, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-card border border-border/50 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                  <b.icon className="w-8 h-8" />
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
              <h2 className="text-3xl font-black tracking-tight">Laptops disponibles en <span className="text-primary">Santo Domingo</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Equipos disponibles para recogida inmediata en sucursal o envío express.</p>
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
          <h2 className="text-3xl font-black tracking-tight mb-12 text-center">Preguntas frecuentes en <span className="text-primary">Santo Domingo</span></h2>
          <Accordion className="space-y-4">
            {faqs.map((faq, i) => (
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
          <h2 className="text-3xl font-bold">Visítanos en Santo Domingo</h2>
          <p className="text-muted-foreground">Nuestro equipo está listo para asesorarte y ayudarte a encontrar la laptop perfecta para ti.</p>
          <WhatsAppDropdown
            message="Hola, quiero visitar la sucursal de Santo Domingo. ¿Cuál es el horario?"
            className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-green-600/20"
          >
            Chatear con un asesor
          </WhatsAppDropdown>
        </div>
      </section>

      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Morel Technology - Santo Domingo",
            description: "Tienda de laptops nuevas y usadas en Santo Domingo con garantía certificada",
            url: "https://moreltechnologyrd.com/tienda-laptops-santo-domingo",
            telephone: "+1-809-617-5517",
            address: {
              "@type": "PostalAddress",
              streetAddress: "El Edén de Villa Mella, Calle Ceuta frente a la Calle 7",
              addressLocality: "Santo Domingo",
              addressCountry: "DO",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 18.5354915,
              longitude: -69.8955395,
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
          }),
        }}
      />
    </div>
  );
}
