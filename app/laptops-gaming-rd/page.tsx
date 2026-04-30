import { ProductCard } from "@/components/product-card";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { 
  Gamepad2, 
  Cpu, 
  Zap, 
  Trophy, 
  CheckCircle2, 
  ShieldCheck, 
  Truck,
  Monitor
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";
import { getProducts } from "@/lib/api";

export const metadata = {
  title: "Laptops Gaming en República Dominicana | Morel Technology",
  description: "Encuentra las mejores laptops gaming en RD. Marcas como Razer, ASUS ROG, Alienware y más. Garantía local y envío a todo el país.",
};

export default async function LaptopsGamingPage() {
  const { products } = await getProducts(0, 100);
  const gamingProducts = products.filter(p => p.category === "gaming").slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero SEO Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image 
            src="https://images.unsplash.com/photo-1600861194942-f884de50f830?q=80&w=2068&auto=format&fit=crop"
            alt="Gaming Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/30">
            <Gamepad2 className="w-4 h-4" />
            Gaming Elite RD
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">
            Laptops Gaming en <span className="text-primary">República Dominicana</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            ¿Buscas el máximo rendimiento para tus juegos favoritos? En Morel Technology te ofrecemos la selección más exclusiva de equipos de alta gama con garantía real.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <WhatsAppDropdown className="h-14 px-8 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/40">
              Consultar Inventario
            </WhatsAppDropdown>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="bg-slate-900 border-y border-white/5 py-8">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Equipos Grado A+</div>
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Garantía Morel</div>
          <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Envío a Nivel Nacional</div>
        </div>
      </div>

      {/* Main Content (SEO TEXT) */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8 space-y-12">
              {/* Content Block 1 */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-black tracking-tight mb-6">¿Por qué comprar una Laptop Gaming en 2026?</h2>
                <p>
                  El mundo del gaming ha evolucionado y hoy en día, una <strong>laptop gaming en República Dominicana</strong> no es solo para jugar; es una estación de trabajo móvil para creadores de contenido, ingenieros y arquitectos. La potencia de procesamiento que ofrecen marcas como <strong>ASUS ROG, Razer y Dell Alienware</strong> supera a muchas computadoras de escritorio tradicionales.
                </p>
                <p>
                  En Morel Technology, entendemos que el mercado dominicano es exigente. Por eso, no solo vendemos equipos, sino que asesoramos a nuestra comunidad gamer para que elija la mejor relación calidad-precio. Ya sea que busques jugar <em>Warzone, Valorant o League of Legends</em> en alta resolución, tenemos el equipo ideal para ti.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                  <div className="p-6 bg-muted/40 rounded-3xl border border-border/50">
                    <Cpu className="w-10 h-10 text-primary mb-4" />
                    <h4 className="font-bold text-xl mb-2">Procesadores de Última Gen</h4>
                    <p className="text-sm text-muted-foreground">Equipos con Intel Core i7/i9 de 13ra y 14ta generación o AMD Ryzen 7/9 serie 8000.</p>
                  </div>
                  <div className="p-6 bg-muted/40 rounded-3xl border border-border/50">
                    <Zap className="w-10 h-10 text-primary mb-4" />
                    <h4 className="font-bold text-xl mb-2">Gráficas NVIDIA RTX</h4>
                    <p className="text-sm text-muted-foreground">Disfruta del Ray Tracing y DLSS 3.5 con las series RTX 4060, 4070, 4080 y 4090.</p>
                  </div>
                </div>

                <h2 className="text-3xl font-black tracking-tight mb-6">Lo que debes saber antes de comprar</h2>
                <p>
                  Antes de invertir en una laptop gamer en Santo Domingo o Santiago, considera estos tres pilares fundamentales:
                </p>
                <ul>
                  <li><strong>Tasa de Refresco:</strong> No te conformes con menos de 144Hz. La fluidez en los movimientos es la clave para ganar en competitivo.</li>
                  <li><strong>Sistema de Enfriamiento:</strong> Las laptops potentes generan calor. Buscamos modelos con sistemas de doble ventilador y metal líquido.</li>
                  <li><strong>Capacidad de Mejora:</strong> En Morel te ayudamos a expandir tu RAM y SSD en el futuro para que tu inversión dure años.</li>
                </ul>
              </div>

              {/* Recommended Products Grid */}
              <div id="productos" className="space-y-8 pt-10">
                <div className="flex items-center gap-4">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <h3 className="text-3xl font-black">Modelos Recomendados</h3>
                </div>
                {gamingProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {gamingProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-muted/30 rounded-[2rem] border border-dashed border-border/50">
                    <p className="text-muted-foreground text-lg">Actualmente no tenemos laptops gaming en stock. ¡Contáctanos para encargar la tuya!</p>
                  </div>
                )}
              </div>

              {/* Content Block 2 */}
              <div className="prose prose-lg dark:prose-invert max-w-none pt-10">
                <h2 className="text-3xl font-black tracking-tight mb-6">Morel Technology: Tu aliado Gaming en RD</h2>
                <p>
                  Comprar por internet puede ser riesgoso. En <strong>Morel Technology</strong> eliminamos ese riesgo. Te ofrecemos equipos listos para entrega inmediata con <strong>garantía local en nuestras sucursales de Villa Mella y Santiago</strong>. Si tu equipo presenta algún inconveniente, no tienes que enviarlo a Estados Unidos; nosotros nos encargamos aquí mismo.
                </p>
                <p>
                  Además, ofrecemos facilidades de financiamiento para que no tengas que esperar para armar tu setup. Aplica hoy mismo y llévate tu laptop gamer pagando cómodas cuotas.
                </p>
              </div>

              {/* FAQ Section */}
              <div className="pt-10 space-y-8">
                <h3 className="text-3xl font-black flex items-center gap-3">
                  <Monitor className="w-8 h-8 text-primary" />
                  Preguntas Gamers
                </h3>
                <Accordion className="w-full space-y-4">
                  <AccordionItem value="item-1" className="border border-border/50 bg-card rounded-2xl px-6">
                    <AccordionTrigger className="hover:no-underline font-bold text-left">¿Tienen laptops con teclado en español?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      Sí, contamos con modelos tanto con teclado en español como en inglés (distribución US). Consulta la disponibilidad de tu modelo favorito por WhatsApp.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border border-border/50 bg-card rounded-2xl px-6">
                    <AccordionTrigger className="hover:no-underline font-bold text-left">¿Puedo probar la laptop antes de comprar?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      ¡Claro! En nuestras tiendas físicas tenemos equipos de exhibición para que compruebes la calidad de la pantalla, la respuesta del teclado y la potencia del sistema.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border border-border/50 bg-card rounded-2xl px-6">
                    <AccordionTrigger className="hover:no-underline font-bold text-left">¿Qué pasa si mi laptop gamer se calienta mucho?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      Todas las laptops gaming generan calor bajo carga pesada. Sin embargo, en Morel incluimos una limpieza preventiva y cambio de pasta térmica gratis durante los primeros 6 meses de garantía.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div className="p-8 bg-primary rounded-[2.5rem] text-primary-foreground shadow-2xl shadow-primary/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                    <Zap className="w-32 h-32" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 relative z-10">¿Listo para subir de nivel?</h3>
                  <p className="text-primary-foreground/80 mb-8 relative z-10">
                    No pierdas más tiempo. Háblanos ahora y uno de nuestros expertos te ayudará a elegir la bestia perfecta para tu presupuesto.
                  </p>
                  <WhatsAppDropdown 
                    variant="secondary" 
                    className="w-full h-14 rounded-2xl font-bold text-primary shadow-xl"
                  >
                    Hablar con un Experto
                  </WhatsAppDropdown>
                </div>

                <div className="p-8 bg-card border border-border/50 rounded-[2.5rem] space-y-6">
                  <h4 className="font-bold text-lg">¿Por qué nosotros?</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground font-medium">Soporte Técnico Especializado en Gaming</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground font-medium">Financiamiento disponible en 15 min</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground font-medium">Equipos 100% Originales y Certificados</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-slate-950 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black mb-8">El inventario más grande de RD a un clic.</h2>
          <WhatsAppDropdown className="h-16 px-10 rounded-2xl text-xl font-black shadow-2xl shadow-primary/20">
            ¡Quiero mi Laptop Gaming!
          </WhatsAppDropdown>
        </div>
      </section>
    </div>
  );
}
