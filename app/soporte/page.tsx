import { HeadphonesIcon, Monitor, Settings, HardDrive, Cpu, HelpCircle, MessageCircle, Laptop, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";

export const metadata = {
  title: "Soporte Técnico | Morel Technology",
  description: "Asesoría y soporte técnico especializado para tu laptop. Configuración, mantenimiento y resolución de problemas.",
};

export default function SoportePage() {
  const services = [
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Optimización de Software",
      description: "Instalación de sistemas operativos, drivers y software esencial para que tu equipo vuele."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Diagnóstico de Hardware",
      description: "Pruebas de estrés y revisión de componentes para asegurar la salud de tu inversión."
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Soporte Remoto",
      description: "Resolvemos problemas de configuración al instante vía TeamViewer o AnyDesk sin que salgas de casa."
    },
    {
      icon: <HardDrive className="w-8 h-8" />,
      title: "Upgrades y Mejoras",
      description: "Asesoría en ampliación de memoria RAM y cambio a discos SSD de alta velocidad."
    }
  ];

  const faqs = [
    {
      q: "¿La garantía incluye soporte de software?",
      a: "Sí, asesoramos en configuraciones iniciales y resolución de problemas básicos de drivers durante el periodo de garantía."
    },
    {
      q: "¿Tienen taller físico para reparaciones?",
      a: "Contamos con laboratorios técnicos especializados en nuestras sucursales de Santo Domingo y Santiago."
    },
    {
      q: "¿Qué hago si mi laptop no enciende?",
      a: "Contáctanos de inmediato por WhatsApp. Nuestros técnicos te darán los pasos iniciales de diagnóstico antes de recibir el equipo."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-primary/50 to-transparent" />
          <Laptop className="w-full h-full scale-125 translate-x-1/4 rotate-12" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/30">
              <HeadphonesIcon className="w-4 h-4" />
              Soporte 24/7 vía Ticket
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
              No vendemos <br />
              <span className="text-primary text-glow">solo laptops.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-10">
              Vendemos tranquilidad. Nuestro equipo técnico certificado está listo para ayudarte con cualquier desafío que presente tu herramienta de trabajo.
            </p>
            <div className="flex flex-wrap gap-4">
              <WhatsAppDropdown variant="default" className="h-16 px-8 text-lg rounded-2xl font-black shadow-2xl shadow-primary/20">
                Contactar a un Técnico
              </WhatsAppDropdown>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div key={i} className="p-8 bg-card rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Remote Support Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-primary to-blue-700 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                  Soporte Remoto <br />
                  <span className="text-primary-foreground/60">Sin Moverte de Casa</span>
                </h2>
                <p className="text-lg text-primary-foreground/80 leading-relaxed">
                  ¿Problemas con los drivers? ¿Tu impresora no conecta? ¿O simplemente quieres optimizar tu sistema? Conéctate con nosotros en segundos.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm font-bold">
                    <Wrench className="w-4 h-4" /> TeamViewer
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm font-bold">
                    <Wrench className="w-4 h-4" /> AnyDesk
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/3">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] space-y-6">
                  <h4 className="font-bold text-center uppercase tracking-widest text-xs">Pasos para soporte</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-black text-xs shrink-0">1</div>
                      <p className="text-sm">Descarga e instala AnyDesk en tu laptop.</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-black text-xs shrink-0">2</div>
                      <p className="text-sm">Escríbenos por WhatsApp para agendar tu turno.</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-black text-xs shrink-0">3</div>
                      <p className="text-sm">Pásale el ID a nuestro técnico y ¡listo!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Preguntas Frecuentes</h2>
            <p className="text-muted-foreground">Todo lo que necesitas saber sobre nuestro servicio técnico.</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-8 bg-card border border-border/50 rounded-3xl hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
