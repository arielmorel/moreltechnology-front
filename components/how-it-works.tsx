"use client";

import { Search, ShoppingCart, Truck, MessageCircle, Shield, CreditCard } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Explora",
    description: "Navega por nuestro catálogo con +100 laptops de todas las marcas y encuentra la ideal para ti.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
    link: "/catalogo",
    linkText: "Ver catálogo",
  },
  {
    number: "02",
    icon: MessageCircle,
    title: "Asesorate",
    description: "¿Tienes dudas? Escríbenos por WhatsApp y te ayudamos a elegir la laptop perfecta para tu presupuesto.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600",
    link: "https://wa.me/18096175517",
    linkText: "Hablar con un asesor",
    external: true,
  },
  {
    number: "03",
    icon: Shield,
    title: "Recibe con garantía",
    description: "Recibe tu laptop con garantía certificada, factura fiscal y soporte técnico. Paga como prefieras.",
    color: "from-primary to-foreground",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    link: "/garantia",
    linkText: "Ver garantía",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Proceso Simple
          </div>
          <h2 className="animate-slide-up-delay-1 text-4xl md:text-5xl font-black tracking-tight mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="animate-slide-up-delay-2 text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprar tu laptop ideal es fácil. Solo 3 pasos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`animate-slide-up relative`}
              style={{ animationDelay: `${0.1 + index * 0.15}s` }}
            >
              <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 text-center hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group h-full flex flex-col">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-black text-muted-foreground">
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${step.bgColor} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <step.icon className={`w-8 h-8 ${step.textColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  {step.description}
                </p>

                {/* Link */}
                {step.external ? (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 ${step.bgColor} ${step.textColor}`}
                  >
                    {step.linkText}
                  </a>
                ) : (
                  <Link
                    href={step.link}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 ${step.bgColor} ${step.textColor}`}
                  >
                    {step.linkText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust indicators */}
        <div className="animate-slide-up-delay-4 flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-border/50">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CreditCard className="w-5 h-5 text-primary" />
            <span><strong className="text-foreground">Aceptamos</strong> todas las tarjetas</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Truck className="w-5 h-5 text-primary" />
            <span><strong className="text-foreground">Envío</strong> a todo el país</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield className="w-5 h-5 text-primary" />
            <span><strong className="text-foreground">Garantía</strong> certificada</span>
          </div>
        </div>
      </div>
    </section>
  );
}
