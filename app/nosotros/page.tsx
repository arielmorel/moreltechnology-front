import { ShieldCheck, Users, Trophy, Target } from "lucide-react";
import Image from "next/image";

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

      </div>
    </div>
  );
}
