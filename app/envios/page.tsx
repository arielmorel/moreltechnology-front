import { Truck, MapPin, ShieldCheck, Clock, Package, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Envíos y Entregas | Morel Technology RD",
  description: "Información sobre nuestros métodos de envío a todo el territorio nacional y entregas personales en Santo Domingo.",
};

export default function EnviosPage() {
  const methods = [
    {
      icon: <Truck className="w-10 h-10" />,
      title: "Envíos Nacionales",
      description: "Utilizamos los servicios más confiables como MetroPac, Caribe Pack y BM Cargo para asegurar que tu equipo llegue intacto.",
      details: ["Llega en 24-48 horas", "Número de seguimiento", "Seguro incluido opcional"]
    },
    {
      icon: <MapPin className="w-10 h-10" />,
      title: "Delivery en Santo Domingo",
      description: "Servicio de mensajería privada para entregas en el mismo día dentro del Gran Santo Domingo.",
      details: ["Entrega express (2-4 horas)", "Pago contra entrega disponible", "Personal capacitado"]
    },
    {
      icon: <ShieldCheck className="w-10 h-10" />,
      title: "Recogida en Sucursal",
      description: "Visítanos en nuestras tiendas físicas en Santo Domingo o Santiago para probar y retirar tu equipo personalmente.",
      details: ["Sin costo adicional", "Asesoría técnica presencial", "Configuración inicial gratis"]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 opacity-10">
          <Globe className="w-full h-full scale-150 -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
              Tu equipo, <span className="text-black/30">donde lo necesites.</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed mb-8">
              En Morel Technology entendemos que tu tiempo es dinero. Por eso, hemos optimizado nuestra logística para que recibas tu herramienta de trabajo de forma rápida y segura en cualquier rincón de la República Dominicana.
            </p>
          </div>
        </div>
      </section>

      {/* Methods Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methods.map((method, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-xl hover:shadow-primary/5 transition-all group">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  {method.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{method.title}</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {method.description}
                </p>
                <ul className="space-y-3">
                  {method.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium text-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-border/50 shadow-2xl flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Cobertura Total
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Llegamos a todas las <br />
                <span className="text-primary">provincias del país.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                No importa si estás en el Cibao, el Sur Profundo o el Este. Gracias a nuestras alianzas estratégicas, garantizamos que tu pedido llegue en tiempo récord.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="font-bold">Empaque Reforzado</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-bold">Despacho en 2h</span>
                </div>
              </div>
              <Button 
                size="lg" 
                className="h-16 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20" 
                render={<Link href="/catalogo" />}
              >
                Ver Equipos Disponibles
              </Button>
            </div>
            <div className="w-full lg:w-2/5 aspect-square relative rounded-[3rem] overflow-hidden bg-muted">
              <Image 
                src="/images/shipping-box.png" 
                alt="Morel Technology Shipping" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">¿Tienes dudas sobre el envío?</h2>
            <p className="text-muted-foreground">Escríbenos directamente y te daremos una cotización exacta del envío a tu localidad.</p>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-8 rounded-xl border-2 font-bold" 
              render={<Link href="/contacto" />}
            >
              Hablar con un asesor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
