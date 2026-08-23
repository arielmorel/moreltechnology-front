"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, CreditCard, Banknote, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WhatsAppDropdown } from "./whatsapp-dropdown";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 md:pt-24 pb-16 md:pb-32">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-60" />
        <div className="absolute top-40 -left-40 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-500/15 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] md:w-[800px] md:h-[400px] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] z-0" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col gap-6 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary w-fit text-sm font-bold backdrop-blur-sm border border-primary/20 animate-slide-left-delay-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Equipos nuevos y usados garantizados
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Las mejores laptops para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-blue-600">
                estudiar, trabajar y gaming
              </span>{" "}
              en RD.
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] leading-relaxed">
              Encuentra el equipo ideal para tus necesidades. Te asesoramos personalmente para que tomes la mejor decisión con total seguridad.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-3 mt-4">
              <Button
                size="lg"
                className="rounded-xl font-bold h-12 flex-1 px-4 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all text-sm group bg-primary text-primary-foreground hover:bg-primary/90"
                nativeButton={false}
                render={
                  <Link href="/catalogo/moreltechnology" className="flex items-center justify-center whitespace-nowrap" />
                }
                aria-label="Ver catálogo de laptops"
              >
                Ver catálogo
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <WhatsAppDropdown
                variant="outline"
                className="rounded-xl font-bold h-12 flex-1 px-4 border-2 border-green-700/30 hover:bg-green-50 dark:hover:bg-green-950/30 text-green-700 text-sm"
                showIcon={true}
              >
                WhatsApp
              </WhatsAppDropdown>
            </div>

          </div>

          {/* Right side - Image */}
          <div className="relative lg:ml-auto w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] aspect-square lg:aspect-auto lg:h-[600px] overflow-hidden animate-scale-in-delay-7">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-blue-500/20 to-transparent rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-overlay" />

            {/* Image container with glassmorphism */}
            <div className="relative w-full h-full">
              <div className="absolute inset-8 rounded-[3rem] bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/20 shadow-2xl" />
              <Image
                src="/laptop.jpeg"
                alt="Laptops Modernas"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain drop-shadow-2xl z-0 hover:scale-105 transition-transform duration-700 p-6 sm:p-12 md:p-16"
                priority
              />
            </div>

            {/* Floating badges */}
            <div className="absolute top-8 sm:top-12 left-0 bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-xl animate-slide-left-delay-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-sm font-bold">Garantía</div>
                  <div className="text-xs text-muted-foreground">6 meses mínimo</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 sm:bottom-12 right-0 bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-xl animate-slide-right-delay-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-bold">Financiamiento</div>
                  <div className="text-xs text-muted-foreground">Cuotas cómodas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Trust Bar */}
        <div className="mt-20 pt-10 border-t border-border/50 animate-slide-up-delay-5">
          <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Distribuidor Autorizado & Marcas Aliadas
          </p>
          <div className="grid grid-cols-3 justify-items-center gap-4 md:gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <Link href="/laptops/lenovo" className="flex flex-col items-center gap-2 hover:opacity-100 transition-opacity group">
              <span className="text-lg md:text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">LENOVO</span>
            </Link>
            <Link href="/laptops/dell" className="text-lg md:text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors">DELL</Link>
            <Link href="/laptops/hp" className="text-lg md:text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors">HP</Link>
            <Link href="/laptops/apple" className="text-lg md:text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors">APPLE</Link>
            <Link href="/laptops/asus" className="text-lg md:text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors">ASUS</Link>
            <Link href="/laptops/razer" className="text-lg md:text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors">RAZER</Link>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-10 mt-8 pt-8 border-t border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Banknote className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Efectivo</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Transferencia</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Tarjetas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
