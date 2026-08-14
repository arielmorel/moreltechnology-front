"use client";

import { motion } from "framer-motion";
import { Shield, Truck, HeadphonesIcon, CheckCircle2, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: <Shield className="w-7 h-7" />,
    title: "Garantía Real",
    description: "Todos nuestros equipos cuentan con garantía escrita para tu tranquilidad.",
    href: "/garantia",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600",
  },
  {
    icon: <Truck className="w-7 h-7" />,
    title: "Entrega Rápida",
    description: "Envíos seguros a todo el país o entrega presencial en Santo Domingo.",
    href: "/envios",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600",
  },
  {
    icon: <CheckCircle2 className="w-7 h-7" />,
    title: "Equipos Probados",
    description: "Cada laptop pasa por un riguroso test de calidad antes de venderse.",
    color: "from-primary to-foreground",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
  },
  {
    icon: <HeadphonesIcon className="w-7 h-7" />,
    title: "Soporte Técnico",
    description: "Te asesoramos antes, durante y después de tu compra.",
    href: "/soporte",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-600",
  },
  {
    icon: <CreditCard className="w-7 h-7" />,
    title: "Financiamiento",
    description: "Opciones de pago flexibles para que te lleves tu equipo hoy.",
    href: "/financiamiento",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-600",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary" />
            ¿Por qué elegirnos?
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
          >
            Compra con confianza
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Nos comprometemos a brindarte la mejor experiencia de compra, con equipos de alta calidad y un servicio al cliente excepcional.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {benefits.map((benefit, index) => {
            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex flex-col items-center text-center p-6 h-full bg-card rounded-3xl border border-border/50 transition-all duration-300 group",
                  benefit.href ? "hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 cursor-pointer" : ""
                )}
              >
                {/* Icon */}
                <div className={cn("p-4 rounded-2xl mb-5 transition-transform group-hover:scale-110 group-hover:rotate-3", benefit.bgColor)}>
                  <div className={benefit.textColor}>{benefit.icon}</div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                  {benefit.description}
                </p>

                {/* Link */}
                {benefit.href && (
                  <div className="mt-auto pt-4 text-primary font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-3 transition-all">
                    Saber más
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );

            if (benefit.href) {
              return (
                <Link key={index} href={benefit.href}>
                  {CardContent}
                </Link>
              );
            }

            return <div key={index}>{CardContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
