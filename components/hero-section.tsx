"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, ShieldCheck, Users, Laptop } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WhatsAppDropdown } from "./whatsapp-dropdown";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 md:pt-24 pb-32">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-3xl rounded-full opacity-50" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full opacity-50" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary w-fit text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Equipos nuevos y usados garantizados
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Las mejores laptops para <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">estudiar, trabajar y gaming</span> en RD.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-[600px]">
              Encuentra el equipo ideal para tus necesidades. Te asesoramos personalmente para que tomes la mejor decisión con total seguridad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button 
                size="lg" 
                className="rounded-full font-medium h-12 px-8 shadow-lg hover:shadow-primary/25 transition-all text-base group" 
                render={
                  <Link href="/catalogo" className="flex items-center justify-center whitespace-nowrap" />
                }
                aria-label="Ver catálogo de laptops"
              >
                Ver catálogo
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <WhatsAppDropdown
                variant="outline"
                className="rounded-full font-medium h-12 px-8 border-primary/20 hover:bg-primary/5 text-base"
                showIcon={true}
              >
                Hablar por WhatsApp
              </WhatsAppDropdown>
            </div>

            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-border/50">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 font-bold text-2xl">
                  <Users className="w-5 h-5 text-primary" />
                  <span>500+</span>
                </div>
                <span className="text-sm text-muted-foreground">Clientes felices</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 font-bold text-2xl">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>100%</span>
                </div>
                <span className="text-sm text-muted-foreground">Garantía Real</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 font-bold text-2xl">
                  <Laptop className="w-5 h-5 text-primary" />
                  <span>100+</span>
                </div>
                <span className="text-sm text-muted-foreground">Equipos en Stock</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-[600px] aspect-square lg:aspect-auto lg:h-[600px]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl mix-blend-multiply dark:mix-blend-overlay" />
            <div className="relative w-full h-full">
              <Image
                src="/laptop.jpeg"
                alt="Laptops Modernas"
                fill
                className="object-contain drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-700"
                priority
              />
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
            <div className="flex flex-col items-center gap-2">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground">LENOVO</span>
              <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">AUTORIZADO</span>
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground">DELL</span>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground">HP</span>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground">APPLE</span>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground">ASUS</span>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground">RAZER</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
