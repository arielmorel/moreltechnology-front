"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ShieldCheck, Truck, CreditCard, MessageCircle, Navigation, Star, Package, ArrowRight } from "lucide-react";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { ProductCard } from "@/components/product-card";
import { branches, Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";


const branch = branches.find(b => b.id === "moreltechnology")!;

const infoCards = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Dirección",
    value: branch.address,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Teléfono",
    value: "809-617-5517",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Horario",
    value: "Lun - Sáb: 9:00 AM - 7:00 PM",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "WhatsApp",
    value: "Respuesta inmediata",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
  },
];

const benefits = [
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Garantía Certificada",
    description: "Todos nuestros equipos incluyen garantía real. Los usados tienen 6 meses; los nuevos hasta 1 año.",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: <Truck className="w-7 h-7" />,
    title: "Envío Express",
    description: "Recibe tu equipo hoy mismo en Santo Domingo. Servicio de delivery en el mismo día.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: <CreditCard className="w-7 h-7" />,
    title: "Financiamiento",
    description: "Aparta tu laptop con cuotas cómodas. Aprobación rápida con solo tu cédula.",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
  },
];

const faqs = [
  {
    q: "¿Dónde están ubicados en Santo Domingo?",
    a: "Estamos en El Edén de Villa Mella, Calle Ceuta frente a la Calle 7. Una ubicación estratégica con fácil acceso y parqueo.",
  },
  {
    q: "¿Tienen laptops usadas en Santo Domingo?",
    a: "Sí, contamos con una amplia selección de laptops usadas certificadas (Grado A) de marcas como Lenovo, Dell y HP. Todas con garantía de 6 meses.",
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

interface TiendaSantoDomingoClientProps {
  products: Product[];
}

export function TiendaSantoDomingoClient({ products }: TiendaSantoDomingoClientProps) {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
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
                <MapPin className="w-4 h-4" />
                Santo Domingo
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                Tienda de{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                  Laptops
                </span>{" "}
                en Santo Domingo
              </h1>

              <p className="text-lg md:text-xl text-neutral-400 leading-relaxed mb-10 max-w-lg">
                Tu tienda de tecnología de confianza en el Distrito Nacional. Equipos nuevos y usados con garantía real, financiamiento accesible y atención personalizada.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <WhatsAppDropdown
                  message="Hola, estoy interesado en una laptop en la sucursal de Santo Domingo."
                  className="h-14 px-8 text-base rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-500/25"
                >
                  Consultar por WhatsApp
                </WhatsAppDropdown>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base rounded-2xl font-bold border-2 border-white/20 text-white hover:bg-white/10"
                  nativeButton={false}
                  render={<Link href="#productos" />}
                >
                  Ver Productos
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/10">
                {[
                  { icon: <Star className="w-4 h-4" />, text: "4.9 Google Reviews" },
                  { icon: <Package className="w-4 h-4" />, text: "+500 clientes" },
                  { icon: <ShieldCheck className="w-4 h-4" />, text: "Garantía real" },
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

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full max-w-[480px] ml-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 via-red-500/10 to-transparent rounded-full blur-[80px]" />

                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-red-500/20">
                      <Navigation className="w-7 h-7 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">Morel Technology</h3>
                      <p className="text-sm text-neutral-400">Santo Domingo</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                      <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-neutral-300">{branch.address}</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                      <p className="text-sm text-neutral-300">Lun - Sáb: 9:00 AM - 7:00 PM</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <Phone className="w-4 h-4 text-green-400 shrink-0" />
                      <p className="text-sm text-neutral-300">809-617-5517</p>
                    </div>
                  </div>

                  <div className="bg-red-500/20 rounded-xl p-4 text-center">
                    <p className="text-sm font-bold text-red-400">Visítanos hoy</p>
                    <p className="text-xs text-neutral-400 mt-1">Asesoría personalizada sin cita previa</p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">WhatsApp</div>
                      <div className="text-xs text-green-400">24/7</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {infoCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-card border border-border/50 rounded-2xl hover:shadow-lg hover:border-primary/20 transition-all group"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", card.bgColor, card.color)}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-sm mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] overflow-hidden border border-border/50 shadow-xl"
          >
            <iframe
              src={branch.embedLink}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Morel Technology Santo Domingo"
            />
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
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
              ¿Por qué elegirnos?
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Compra con confianza
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Más de 500 clientes satisfechos en Santo Domingo confían en nosotros.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-card rounded-3xl border border-border/50 text-center space-y-4 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform", benefit.bgColor, benefit.color)}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="productos" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Package className="w-4 h-4" />
              Stock Disponible
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Laptops disponibles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Equipos disponibles para recogida inmediata en sucursal o envío express.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-base rounded-2xl font-bold border-2 border-primary/20 hover:bg-primary/5"
              nativeButton={false}
              render={<Link href="/catalogo" />}
            >
              Ver todo el catálogo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
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
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Preguntas frecuentes
            </h2>
            <p className="text-muted-foreground text-lg">
              Todo lo que necesitas saber sobre nuestra sucursal en Santo Domingo.
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
                <div className="p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/20 transition-all">
                  <h4 className="font-bold text-base mb-3">{faq.q}</h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black rounded-[3rem] p-8 md:p-16 text-white shadow-2xl overflow-hidden relative text-center"
          >
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-500/20 rounded-full blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-red-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest">
                <MapPin className="w-4 h-4" />
                Visítanos
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                Te esperamos en{" "}
                <span className="text-red-400">Santo Domingo</span>
              </h2>
              <p className="text-lg text-neutral-400">
                Nuestro equipo está listo para asesorarte y ayudarte a encontrar la laptop perfecta para ti.
              </p>
              <WhatsAppDropdown
                message="Hola, quiero visitar la sucursal de Santo Domingo. ¿Cuál es el horario?"
                className="h-14 px-8 rounded-2xl text-lg font-bold bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-500/25"
              >
                Chatear con un asesor
              </WhatsAppDropdown>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
