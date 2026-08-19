"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, ShieldCheck, Users, Laptop, Banknote, Building2, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WhatsAppDropdown } from "./whatsapp-dropdown";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 md:pt-24 pb-32">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-60" />
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-blue-500/15 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] z-0" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary w-fit text-sm font-bold backdrop-blur-sm border border-primary/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Equipos nuevos y usados garantizados
            </motion.div>

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
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                size="lg"
                className="rounded-2xl font-bold h-14 px-8 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all text-base group bg-primary text-primary-foreground hover:bg-primary/90"
                nativeButton={false}
                render={
                  <Link href="/catalogo/moreltechnology" className="flex items-center justify-center whitespace-nowrap" />
                }
                aria-label="Ver catálogo de laptops"
              >
                Ver catálogo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <WhatsAppDropdown
                variant="outline"
                className="rounded-2xl font-bold h-14 px-8 border-2 border-primary/20 hover:bg-primary/5 text-base"
                showIcon={true}
              >
                Hablar por WhatsApp
              </WhatsAppDropdown>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-8 mt-8 pt-8 border-t border-border/50">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2 font-black text-2xl sm:text-3xl">
                  <Users className="w-5 h-5 text-primary" />
                  <span>500+</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium">Clientes felices</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2 font-black text-2xl sm:text-3xl">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>100%</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium">Garantía Real</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2 font-black text-2xl sm:text-3xl">
                  <Laptop className="w-5 h-5 text-blue-500" />
                  <span>100+</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium">Equipos en Stock</span>
              </motion.div>
            </div>
          </motion.div>



        </div>

        {/* Brand Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 pt-10 border-t border-border/50"
        >
          <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Distribuidor Autorizado & Marcas Aliadas
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <Link href="/laptops/lenovo" className="flex flex-col items-center gap-2 hover:opacity-100 transition-opacity group">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">LENOVO</span>
            </Link>
            <Link href="/laptops/dell" className="text-xl md:text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors">DELL</Link>
            <Link href="/laptops/hp" className="text-xl md:text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors">HP</Link>
            <Link href="/laptops/apple" className="text-xl md:text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors">APPLE</Link>
            <Link href="/laptops/asus" className="text-xl md:text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors">ASUS</Link>
            <Link href="/laptops/razer" className="text-xl md:text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors">RAZER</Link>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mt-8 pt-8 border-t border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Banknote className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Efectivo</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Transferencia Bancaria</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Tarjetas de Crédito/Débito</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
