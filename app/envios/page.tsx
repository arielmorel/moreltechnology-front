"use client";

import { motion } from "framer-motion";
import { Truck, MapPin, ShieldCheck, Clock, Package, Globe, Phone, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { cn } from "@/lib/utils";

const methods = [
  {
    icon: <Truck className="w-7 h-7" />,
    title: "Envíos Nacionales",
    description: "Utilizamos los servicios más confiables como MetroPac, Caribe Pack y BM Cargo para asegurar que tu equipo llegue intacto.",
    details: ["Llega en 24-48 horas", "Número de seguimiento", "Seguro incluido opcional"],
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    dotColor: "bg-blue-500",
    borderColor: "hover:border-blue-500/30",
  },
  {
    icon: <MapPin className="w-7 h-7" />,
    title: "Delivery en Santo Domingo",
    description: "Servicio de mensajería privada para entregas en el mismo día dentro del Gran Santo Domingo.",
    details: ["Entrega express (2-4 horas)", "Pago contra entrega disponible", "Personal capacitado"],
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
    dotColor: "bg-green-500",
    borderColor: "hover:border-green-500/30",
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Recogida en Sucursal",
    description: "Visítanos en nuestras tiendas físicas en Santo Domingo o Santiago para probar y retirar tu equipo personalmente.",
    details: ["Sin costo adicional", "Asesoría técnica presencial", "Configuración inicial gratis"],
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
    dotColor: "bg-red-500",
    borderColor: "hover:border-red-500/30",
  },
];

const provinces = [
  "Santo Domingo", "Santiago", "San Cristóbal", "La Vega", "Puerto Plata",
  "San Pedro de Macorís", "La Romana", "Hato Mayor", "Monte Plata", "Duarte",
  "Valverde", "Santiago Rodríguez", "Monte Cristi", "Espaillat", "Samaná",
  "María Trinidad Sánchez", "Hermanas Mirabal", "La Altagracia", "Elías Piña",
  "San Juan", "Independencia", "Azua", "Barahona", "Bahoruco",
  "Pedernales", "Peravia", "San José de Ocoa", "Monseñor Nouel", "San Francisco de Macorís",
];

export default function EnviosPage() {
  return (
    <div className="min-h-screen pt-16 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-6 border border-red-500/30">
                <Truck className="w-4 h-4" />
                Envíos a Todo el País
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                Tu equipo,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                  donde lo necesites.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-neutral-400 leading-relaxed mb-10 max-w-lg">
                En Morel Technology entendemos que tu tiempo es dinero. Por eso, hemos optimizado nuestra logística para que recibas tu herramienta de trabajo de forma rápida y segura.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <WhatsAppDropdown
                  variant="default"
                  className="h-14 px-8 text-base rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-500/25"
                >
                  Cotizar Envío
                </WhatsAppDropdown>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base rounded-2xl font-bold border-2 border-white/20 text-white hover:bg-white/10"
                  nativeButton={false}
                  render={<Link href="#metodos" />}
                >
                  Ver Métodos
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/10">
                {[
                  { icon: <Package className="w-4 h-4" />, text: "Empaque reforzado" },
                  { icon: <Clock className="w-4 h-4" />, text: "Despacho en 2h" },
                  { icon: <ShieldCheck className="w-4 h-4" />, text: "Seguro incluido" },
                ].map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2 text-neutral-400 text-sm"
                  >
                    <div className="text-red-400">{badge.icon}</div>
                    {badge.text}
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
              <div className="relative w-full aspect-square max-w-[480px] ml-auto">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 via-red-500/10 to-transparent rounded-full blur-[80px]" />

                {/* Main card */}
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-red-500/20">
                      <Globe className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-white">Cobertura Nacional</h2>
                      <p className="text-sm text-neutral-400">32 provincias</p>
                    </div>
                  </div>

                  {/* Mini map representation */}
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-3 rounded-sm transition-colors",
                          i < 14 ? "bg-red-500/60" : "bg-white/10"
                        )}
                      />
                    ))}
                  </div>

                  <div className="text-center text-sm text-neutral-400">
                    <span className="text-white font-bold">14/32</span> provincias con entrega directa
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Entrega</div>
                      <div className="text-xs text-green-400">Garantizada</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Methods Grid */}
      <section id="metodos" className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Métodos de Envío
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Elige cómo recibir tu equipo
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tres opciones flexibles para que recibas tu laptop de la forma que más te convenga.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methods.map((method, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300",
                  method.borderColor
                )}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", method.bgColor, method.color)}>
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{method.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                  {method.description}
                </p>
                <ul className="space-y-3">
                  {method.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium text-foreground">
                      <div className={cn("w-1.5 h-1.5 rounded-full", method.dotColor)} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-[3rem] p-8 md:p-16 border border-border/50 shadow-xl overflow-hidden relative"
          >
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-red-500/5 rounded-full blur-3xl" />

            <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  Cobertura Total
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                  Llegamos a todas las{" "}
                  <span className="text-primary">provincias del país.</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  No importa si estás en el Cibao, el Sur Profundo o el Este. Gracias a nuestras alianzas estratégicas, garantizamos que tu pedido llegue en tiempo récord.
                </p>

                {/* Province tags */}
                <div className="flex flex-wrap gap-2">
                  {provinces.slice(0, 12).map((province) => (
                    <span
                      key={province}
                      className="px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground"
                    >
                      {province}
                    </span>
                  ))}
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 text-xs font-bold text-primary">
                    +{provinces.length - 12} más
                  </span>
                </div>

                <Button
                  size="lg"
                  className="h-14 px-8 rounded-2xl text-base font-bold shadow-xl shadow-primary/20"
                  nativeButton={false}
                  render={<Link href="/catalogo" />}
                >
                  Ver Equipos Disponibles
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              {/* Stats card */}
              <div className="w-full lg:w-[380px] shrink-0">
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-[2rem] p-8 text-white space-y-6">
                  <h3 className="font-bold text-center uppercase tracking-widest text-xs text-neutral-400">Números que hablan</h3>
                  <div className="space-y-4">
                    {[
                      { value: "32", label: "Provincias cubiertas", icon: <Globe className="w-5 h-5" /> },
                      { value: "24-48h", label: "Tiempo promedio de entrega", icon: <Clock className="w-5 h-5" /> },
                      { value: "99%", label: "Entregas a tiempo", icon: <CheckCircle2 className="w-5 h-5" /> },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                        <div className="text-red-400">{stat.icon}</div>
                        <div>
                          <div className="font-black text-xl">{stat.value}</div>
                          <div className="text-xs text-neutral-400">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Phone className="w-4 h-4" />
              ¿Tienes dudas?
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Cotización personalizada
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Escríbenos directamente y te daremos una cotización exacta del envío a tu localidad sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppDropdown
                variant="default"
                className="h-14 px-8 text-base rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-500/25"
              >
                Cotizar por WhatsApp
              </WhatsAppDropdown>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base rounded-2xl font-bold border-2 border-primary/20 hover:bg-primary/5"
                nativeButton={false}
                render={<Link href="/contacto" />}
              >
                Llamar ahora
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
