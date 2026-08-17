"use client";

import { CheckCircle2, Store, Users, Package, Laptop, Truck, CreditCard, Shield, Star, Building2, Factory, Box, RotateCcw, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const trustSignals = [
  { icon: CheckCircle2, label: "Equipos probados", description: "Cada laptop pasa por test de calidad riguroso" },
  { icon: Shield, label: "Garantía escrita", description: "6-12 meses de garantía certificada por escrito" },
  { icon: CreditCard, label: "Factura fiscal", description: "Entregamos factura fiscal válida (NCF)" },
  { icon: Laptop, label: "Soporte técnico", description: "Asesoría antes, durante y después de tu compra" },
  { icon: Building2, label: "Financiamiento", description: "Opciones flexibles con entidades financieras" },
  { icon: Truck, label: "Envíos nacionales", description: "Entrega a todo el país por MetroPac, Caribe Pack y BM Cargo" },
  { icon: Store, label: "Dos sucursales", description: "Tiendas físicas en Santo Domingo y Santiago" },
  { icon: Users, label: "+500 clientes", description: "Miles de dominicanos confían en nosotros" },
  { icon: Star, label: "4.9 ⭐ en Google", description: "Calificación excepcional en reseñas verificadas" },
];

const galleryImages = [
  {
    src: "/images/trust/store.jpg",
    alt: "Nuestra tienda en Santo Domingo",
    caption: "Tienda física - Santo Domingo",
    category: "Tienda",
  },
  // {
  //   src: "/images/trust/team-working.jpg",
  //   alt: "Equipo MorelTechnology asesorando clientes",
  //   caption: "Nuestro equipo asesorando",
  //   category: "Empleados",
  // },
  // {
  //   src: "/images/trust/warehouse.jpg",
  //   alt: "Almacén de laptops MorelTechnology",
  //   caption: "Almacén principal",
  //   category: "Almacén",
  // },
  {
    src: "/images/trust/products-display.jpg",
    alt: "Laptops en exhibición",
    caption: "Productos en exhibición",
    category: "Productos",
  },
  // {
  //   src: "/images/trust/customer-pickup.jpg",
  //   alt: "Cliente recogiendo su laptop",
  //   caption: "Cliente feliz con su compra",
  //   category: "Clientes",
  // },
  {
    src: "/images/trust/packaging.jpg",
    alt: "Empaque seguro para envío",
    caption: "Empaque profesional",
    category: "Empaques",
  },
  // {
  //   src: "/images/trust/quality-check.jpg",
  //   alt: "Proceso de revisión técnica",
  //   caption: "Control de calidad",
  //   category: "Revisión",
  // },
];

export function TrustSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Shield className="w-4 h-4" />
            Por qué confiar en MorelTechnology
          </div>
          <h2 className="animate-slide-up-delay-1 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            Compra con <span className="text-primary">total confianza</span>
          </h2>
          <p className="animate-slide-up-delay-2 text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            No solo vendemos laptops. Te damos la tranquilidad de saber que tu inversión está protegida,
            respaldada por una empresa real, con tiendas físicas, equipo humano y miles de clientes satisfechos.
          </p>
        </div>

        {/* Trust Signals Grid */}
        <div className="animate-slide-up grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-20">
          {trustSignals.map((signal, index) => (
            <div
              key={signal.label}
              className="group flex items-start gap-4 p-5 bg-card border border-border/50 rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={cn(
                "flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-background"
              )}>
                <signal.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm tracking-tight">{signal.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{signal.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Gallery */}
        <div className="animate-slide-up-delay-3">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Fotos reales de nuestro día a día</h3>
              <p className="text-muted-foreground mt-1">Transparencia total: conoce nuestra tienda, equipo y procesos</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <ChevronLeftIcon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <ChevronRightIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="pl-3 md:basis-[350px] lg:basis-[400px]">
                  <div className="h-full group relative">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted/30 border border-border/50 shadow-lg">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <span className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded-full mb-2">
                          {image.category}
                        </span>
                        <p className="text-white text-sm font-medium">{image.caption}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full bg-background/80 backdrop-blur border border-border/50 shadow-lg hover:bg-background" />
            <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full bg-background/80 backdrop-blur border border-border/50 shadow-lg hover:bg-background" />
          </Carousel>

          {/* Stats bar below gallery */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border/50">
            {[
              { icon: Users, value: "10,000+", label: "Clientes atendidos" },
              { icon: Shield, value: "100%", label: "Equipos probados" },
              { icon: Star, value: "4.9/5", label: "Rating en Google" },
              { icon: Building2, value: "2", label: "Sucursales físicas" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}