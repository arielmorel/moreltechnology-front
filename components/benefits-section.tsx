"use client";

import { motion } from "framer-motion";
import { Shield, Truck, HeadphonesIcon, CheckCircle2, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Garantía Real",
    description: "Todos nuestros equipos cuentan con garantía escrita para tu tranquilidad.",
    href: "/garantia",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Entrega Rápida",
    description: "Envíos seguros a todo el país o entrega presencial en Santo Domingo.",
    href: "/envios",
  },
  {
    icon: <CheckCircle2 className="w-8 h-8" />,
    title: "Equipos Probados",
    description: "Cada laptop pasa por un riguroso test de calidad antes de venderse.",
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8" />,
    title: "Soporte Técnico",
    description: "Te asesoramos antes, durante y después de tu compra.",
    href: "/soporte",
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Financiamiento",
    description: "Opciones de pago flexibles para que te lleves tu equipo hoy.",
    href: "/financiamiento",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">¿Por qué elegirnos?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nos comprometemos a brindarte la mejor experiencia de compra, con equipos de alta calidad y un servicio al cliente excepcional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {benefits.map((benefit, index) => {
            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "flex flex-col items-center text-center p-6 h-full bg-background rounded-3xl shadow-sm border border-border/50 transition-all duration-300",
                  benefit.href ? "hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 cursor-pointer group" : ""
                )}
              >
                <div className="p-4 bg-primary/10 text-primary rounded-2xl mb-6 transition-transform group-hover:scale-110">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {benefit.description}
                </p>
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
