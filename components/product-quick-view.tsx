"use client";

import Image from "next/image";
import { Product } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  HardDrive,
  MemoryStick,
  ShieldCheck,
  Truck,
  ShoppingCart
} from "lucide-react";
import { WhatsAppDropdown } from "./whatsapp-dropdown";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductQuickViewProps {
  product: Product;
  children: React.ReactNode;
}

export function ProductQuickView({ product, children }: ProductQuickViewProps) {
  const { addItem } = useCart();
  const whatsappMessage = `Hola, me interesa la laptop ${product.name} que vi en la página web. ¿Podrían darme más detalles?`;

  return (
    <Dialog>
      <DialogTrigger render={children as any} />
      <DialogContent className="max-w-5xl w-[95vw] max-h-[85vh] overflow-hidden rounded-2xl p-0 border-none shadow-2xl bg-card">
        <div className="flex flex-col md:flex-row h-full">
          {/* Gallery Section */}
          <div className="w-full md:w-[50%] bg-muted/20 p-6 md:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-border/50 overflow-hidden">
            <Carousel className="w-full max-w-md mx-auto">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-square md:aspect-square rounded-[1.5rem] overflow-hidden shadow-2xl">
                      <Image
                        src={image}
                        alt={`${product.name} - Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {product.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 bg-background/80 backdrop-blur border-none hover:bg-primary hover:text-white transition-all" />
                  <CarouselNext className="right-2 bg-background/80 backdrop-blur border-none hover:bg-primary hover:text-white transition-all" />
                </>
              )}
            </Carousel>
          </div>

          {/* Info Section */}
          <div className="flex-1 p-8 md:p-12 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={product.condition === "Nuevo" ? "default" : "secondary"} className="rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest">
                  {product.condition}
                </Badge>
                <span className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em]">{product.brand}</span>
              </div>
              <DialogTitle className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                {product.name}
              </DialogTitle>
            </div>

            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through decoration-red-500/30 font-medium">
                  RD$ {product.originalPrice.toLocaleString()}
                </span>
              )}
              <div className="flex items-baseline gap-3">
                <span className={cn(
                  "text-4xl font-black transition-colors",
                  product.originalPrice ? "text-red-600" : "text-primary"
                )}>
                  RD$ {product.price.toLocaleString()}
                </span>
                <Badge variant="outline" className={cn(
                  "animate-pulse px-3 py-1 rounded-lg border-2",
                  product.originalPrice
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "bg-primary/5 text-primary border-primary/10"
                )}>
                  {product.originalPrice ? "¡OFERTA ESPECIAL!" : "PRECIO SMART"}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Descripción y Especificaciones</h4>
              <p className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/30 transition-colors">
                <div className="p-3 bg-background rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Procesador</span>
                  <span className="text-base font-bold">{product.processor}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/30 transition-colors">
                  <div className="p-3 bg-background rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <MemoryStick className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">RAM</span>
                    <span className="text-base font-bold">{product.ram}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/30 transition-colors">
                  <div className="p-3 bg-background rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <HardDrive className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Almacenamiento</span>
                    <span className="text-base font-bold">{product.ssd}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 py-4 border-y border-border/50">
              <div className="flex items-center gap-2 text-xs text-green-600 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5" />
                Garantía Local Morel
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600 font-bold uppercase tracking-widest">
                <Truck className="w-5 h-5" />
                Envío Asegurado
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-card pt-4 pb-2">
              <Button
                variant="outline"
                className="flex-1 h-14 rounded-2xl font-bold border-2 border-primary/20 hover:bg-primary/5 text-base"
                onClick={() => {
                  addItem(product);
                  toast.success(`${product.name} añadido al carrito`);
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Agregar al Carrito
              </Button>
              <WhatsAppDropdown
                message={whatsappMessage}
                className="flex-[1.5] h-14 text-lg rounded-2xl font-black shadow-2xl shadow-green-600/20"
              >
                Comprar por WhatsApp
              </WhatsAppDropdown>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
