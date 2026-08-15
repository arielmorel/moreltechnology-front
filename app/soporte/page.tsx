"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeadphonesIcon, Monitor, Settings, HardDrive, Cpu, HelpCircle, MessageCircle, Laptop, Wrench, ChevronDown, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: <Monitor className="w-6 h-6" />,
    title: "Optimización de Software",
    description: "Instalación de sistemas operativos, drivers y software esencial para que tu equipo vuele.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Diagnóstico de Hardware",
    description: "Pruebas de estrés y revisión de componentes para asegurar la salud de tu inversión.",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "Soporte Remoto",
    description: "Resolvemos problemas de configuración al instante vía TeamViewer o AnyDesk sin que salgas de casa.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: <HardDrive className="w-6 h-6" />,
    title: "Upgrades y Mejoras",
    description: "Asesoría en ampliación de memoria RAM y cambio a discos SSD de alta velocidad.",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
  },
];

const faqs = [
  {
    q: "¿La garantía incluye soporte de software?",
    a: "Sí, asesoramos en configuraciones iniciales y resolución de problemas básicos de drivers durante el periodo de garantía.",
  },
  {
    q: "¿Tienen taller físico para reparaciones?",
    a: "Contamos con laboratorios técnicos especializados en nuestras sucursales de Santo Domingo y Santiago.",
  },
  {
    q: "¿Qué hago si mi laptop no enciende?",
    a: "Contáctanos de inmediato por WhatsApp. Nuestros técnicos te darán los pasos iniciales de diagnóstico antes de recibir el equipo.",
  },
  {
    q: "¿Cuánto tiempo tarda el soporte remoto?",
    a: "La mayoría de las sesiones de soporte remoto se resuelven en 30-60 minutos dependiendo de la complejidad del problema.",
  },
  {
    q: "¿Puedo llevar mi laptop a revisión sin cita?",
    a: "Sí, puedes acudir directamente a nuestras sucursales. Sin embargo, te recomendamos agendar previamente por WhatsApp para atención inmediata.",
  },
];

const stats = [
  { icon: <Clock className="w-5 h-5" />, value: "24/7", label: "Disponibilidad" },
  { icon: <Zap className="w-5 h-5" />, value: "30min", label: "Tiempo promedio" },
  { icon: <Shield className="w-5 h-5" />, value: "100%", label: "Satisfacción" },
];

export default function SoportePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-16 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Soporte Técnico 24/7
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                No vendemos{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-blue-600">
                  solo laptops.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
                Vendemos tranquilidad. Nuestro equipo técnico certificado está listo para ayudarte con cualquier desafío que presente tu herramienta de trabajo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <WhatsAppDropdown
                  variant="default"
                  className="h-14 px-8 text-base rounded-2xl font-bold shadow-xl shadow-primary/20"
                >
                  Contactar a un Técnico
                </WhatsAppDropdown>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base rounded-2xl font-bold border-2 border-primary/20 hover:bg-primary/5"
                  nativeButton={false}
                  render={<Link href="#servicios" />}
                >
                  Ver Servicios
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border/50">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="font-black text-xl">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-[500px] ml-auto">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-blue-500/20 to-transparent rounded-full blur-[80px]" />

                {/* Main card */}
                <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-[3rem] p-10 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-primary/10">
                      <HeadphonesIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">Soporte Premium</h2>
                      <p className="text-sm text-muted-foreground">Siempre contigo</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {services.map((service, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                        <div className={cn("p-2 rounded-lg", service.bgColor, service.color)}>
                          {service.icon}
                        </div>
                        <span className="text-sm font-medium">{service.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">WhatsApp</div>
                      <div className="text-xs text-green-500">En línea</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="servicios" className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Nuestros Servicios
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Soluciones completas
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Desde configuración básica hasta reparaciones complejas, tenemos la experiencia para resolverlo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", service.bgColor, service.color)}>
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Remote Support Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black rounded-[3rem] p-8 md:p-16 text-white shadow-2xl overflow-hidden relative"
          >
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-500/20 rounded-full blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-red-500/10 rounded-full blur-3xl" />

            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest border border-red-500/30">
                  <Wrench className="w-4 h-4" />
                  Soporte Remoto
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                  Sin Moverte de Casa
                </h2>
                <p className="text-lg text-neutral-400 leading-relaxed">
                  ¿Problemas con los drivers? ¿Tu impresora no conecta? ¿O simplemente quieres optimizar tu sistema? Conéctate con nosotros en segundos.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold">
                    <Wrench className="w-4 h-4" /> TeamViewer
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold">
                    <Wrench className="w-4 h-4" /> AnyDesk
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold">
                    <Monitor className="w-4 h-4" /> RustDesk
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[380px] shrink-0">
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] space-y-6">
                  <h3 className="font-bold text-center uppercase tracking-widest text-xs">Pasos para soporte</h3>
                  <div className="space-y-4">
                    {[
                      "Descarga e instala AnyDesk en tu laptop.",
                      "Escríbenos por WhatsApp para agendar tu turno.",
                      "Pásale el ID a nuestro técnico y ¡listo!",
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-xs shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm leading-relaxed text-neutral-300">{step}</p>
                      </div>
                    ))}
                  </div>
                  <WhatsAppDropdown
                    variant="default"
                    className="w-full h-12 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25"
                  >
                    Agendar Soporte
                  </WhatsAppDropdown>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-muted-foreground text-lg">
              Todo lo que necesitas saber sobre nuestro servicio técnico.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={cn(
                    "w-full p-6 bg-card border rounded-2xl text-left transition-all duration-200",
                    openFaq === i
                      ? "border-primary/30 shadow-lg shadow-primary/5"
                      : "border-border/50 hover:border-primary/20"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-base md:text-lg">{faq.q}</h3>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200",
                        openFaq === i && "rotate-180"
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-muted-foreground leading-relaxed mt-4 pt-4 border-t border-border/50">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
