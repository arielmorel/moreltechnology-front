import Image from "next/image";
import Link from "next/link";
import { 
  Terminal, 
  Cpu, 
  MemoryStick, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Code2,
  Database,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { getProducts } from "@/lib/api";

export const metadata = {
  title: "Laptops para Programar en RD | Morel Technology",
  description: "Encuentra las mejores laptops para desarrollo de software, Docker y VS Code en República Dominicana. Equipos con 16GB+ RAM y procesadores de alto rendimiento.",
};

export default async function LaptopsProgramarPage() {
  const { products } = await getProducts(0, 100);
  
  // Filter for coding-ready laptops (16GB+ RAM or high-end processors)
  const codingProducts = products.filter(p => 
    p.ram.includes("16GB") || p.ram.includes("32GB") || p.ram.includes("36GB") ||
    p.processor.includes("i7") || p.processor.includes("i9") || p.processor.includes("M2") || p.processor.includes("M3")
  ).slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero SEO Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#0a0a0a] text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image 
            src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop"
            alt="Programming Background"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-500/30">
              <Terminal className="w-4 h-4" />
              Dev Environment RD
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
              Laptops para <span className="text-blue-500">Programar</span> en República Dominicana
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-10">
              Sabemos que como desarrollador, tu laptop no es un gasto, es tu herramienta de producción. Encuentra equipos que soporten Docker, VS Code y compilación pesada sin despeinarse.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-14 px-8 text-lg font-bold shadow-xl shadow-blue-500/20" 
                render={<Link href="#equipos" />}
              >
                Ver Equipos Recomendados
              </Button>
              <WhatsAppDropdown 
                className="h-14 rounded-full px-8 text-lg font-bold border-white/10 text-white hover:bg-white/5"
                variant="outline"
              >
                Consultar con un Experto
              </WhatsAppDropdown>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Requirements */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 italic tracking-tight">¿QUÉ NECESITA UN DEVELOPER?</h2>
            <div className="w-24 h-1.5 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2rem] bg-background border border-border/50 hover:border-blue-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <MemoryStick className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">16GB RAM (Mínimo)</h3>
              <p className="text-muted-foreground">Olvida los problemas de memoria con Chrome y VS Code abiertos. Para Docker y VMs recomendamos 32GB.</p>
            </div>

            <div className="p-8 rounded-[2rem] bg-background border border-border/50 hover:border-blue-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Procesadores de Alta Gama</h3>
              <p className="text-muted-foreground">Core i7, i9 o Apple Silicon (M1/M2/M3) para tiempos de compilación instantáneos.</p>
            </div>

            <div className="p-8 rounded-[2rem] bg-background border border-border/50 hover:border-blue-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pantallas de Calidad</h3>
              <p className="text-muted-foreground">Resolución Retina o Full HD con protección ocular para largas jornadas de código.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section id="equipos" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none">
                SELECCIÓN <span className="text-blue-500">PRO-LEVEL</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Equipos configurados y probados para el flujo de trabajo moderno de desarrollo.
              </p>
            </div>
            <Button 
              render={<Link href="/catalogo" />}
              variant="outline" 
              className="rounded-full font-bold group border-blue-500/20 text-blue-500 hover:bg-blue-500/5"
            >
              Ver todos los equipos 
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {codingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Local Support */}
      <section className="py-20 bg-blue-600 text-white rounded-[3rem] mx-4 mb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight italic">¿POR QUÉ COMPRAR EN MOREL TECHNOLOGY?</h2>
              <div className="space-y-4">
                {[
                  "Garantía real y local en Santo Domingo y Santiago.",
                  "Asesoría técnica real (hablamos el mismo idioma que tú).",
                  "Equipos grado A+ certificados y probados.",
                  "Envío express el mismo día."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-lg font-medium">
                    <CheckCircle2 className="w-6 h-6 text-blue-300" />
                    {item}
                  </div>
                ))}
              </div>
              <WhatsAppDropdown className="bg-white text-blue-600 hover:bg-white/90 h-14 px-8 rounded-full text-lg font-bold">
                Consultar Stock por WhatsApp
              </WhatsAppDropdown>
            </div>
            <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
              <Image 
                src="https://images.unsplash.com/photo-1580894732230-283896303e3a?q=80&w=2070&auto=format&fit=crop"
                alt="Support Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
