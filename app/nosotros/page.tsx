import { ShieldCheck, Users, Trophy, Target } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros - Morel Technology República Dominicana",
  description: "Morel Technology: 8+ años vendiendo laptops en RD. 10k+ clientes, 2 sucursales, garantía y financiamiento.",
  alternates: {
    canonical: "/nosotros",
  },
};

export default function NosotrosPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="max-w-3xl mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Liderando la tecnología en <span className="text-primary">República Dominicana.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            En Morel Technology, no solo vendemos laptops. Ofrecemos las herramientas que impulsan el éxito de estudiantes, profesionales y gamers en todo el país.
          </p>
        </div>

        {/* Stats/Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { icon: Users, label: "Clientes Satisfechos", value: "10k+" },
            { icon: ShieldCheck, label: "Equipos Garantizados", value: "100%" },
            { icon: Trophy, label: "Años de Experiencia", value: "8+" },
            { icon: Target, label: "Sucursales", value: "2" },
          ].map((stat, i) => (
            <div key={i} className="p-8 bg-card border border-border/50 rounded-3xl text-center space-y-2">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/team.png?q=80&w=2070&auto=format&fit=crop"
              alt="Equipo MorelTechnology"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Nuestra Misión</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Democratizar el acceso a tecnología de alta gama en la República Dominicana, ofreciendo equipos de calidad mundial con garantía local y financiamiento accesible para todos.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-lg h-fit">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">Confianza Total</h4>
                  <p className="text-sm text-muted-foreground">Cada equipo que sale de nuestras tiendas pasa por una rigurosa inspección técnica.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-lg h-fit">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">Enfoque al Cliente</h4>
                  <p className="text-sm text-muted-foreground">No vendemos por vender; asesoramos para que te lleves el equipo que realmente necesitas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 lg:order-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              Nuestro Fundador
            </div>
            <h2 className="text-3xl font-bold">Ariel Morel</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Fundador y CEO de Morel Technology. Con más de 8 años de experiencia en el mercado tecnológico dominicano, Ariel fundó la empresa con la visión de hacer accesible la tecnología de alta gama para todos los dominicanos.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Bajo su liderazgo, Morel Technology se ha convertido en una de las tiendas de laptops más confiables del país, con más de 10,000 clientes satisfechos y dos sucursales en Santo Domingo y Santiago.
            </p>
            <div className="flex gap-4 pt-4">
              <a
                href="https://instagram.com/arielmorel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted hover:bg-primary/10 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a
                href="https://tiktok.com/@arielmorel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted hover:bg-primary/10 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3.77-1.59V6.69h3.77z"/>
                </svg>
                TikTok
              </a>
              <a
                href="https://www.linkedin.com/in/arielmoreld/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted hover:bg-primary/10 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/arielmorel.jpeg"
                alt="Ariel Morel - Fundador y CEO de Morel Technology"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>

      </div>
    </div>
  );
}
