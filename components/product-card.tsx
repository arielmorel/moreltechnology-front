"use client";

import Image from "next/image";
import { Product } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, MemoryStick, Eye, ShoppingCart, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import { WhatsAppDropdown } from "./whatsapp-dropdown";
import { ProductQuickView } from "./product-quick-view";
import { Button } from "./ui/button";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

import Link from "next/link";

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, addToCompare, removeFromCompare, compareItems } = useCart();
  const whatsappMessage = `Hola, me interesa la laptop ${product.name} que vi en la página web.`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
        <Link href={`/productos/${product.id}`} className="flex-1 flex flex-col">
          <CardHeader className="p-0 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" size="sm" className="gap-2 rounded-full shadow-lg pointer-events-none">
                  <Eye className="w-4 h-4" />
                  Ver Detalles
                </Button>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Badge variant={product.condition === "Nuevo" ? "default" : "secondary"} className="shadow-sm">
                {product.condition}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-5">
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</p>
              <h3 className="font-semibold text-lg line-clamp-2 mt-1 group-hover:text-primary transition-colors">{product.name}</h3>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                product.quantity > 5 ? "bg-green-500" : product.quantity > 0 ? "bg-orange-500" : "bg-red-500"
              )} />
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                product.quantity > 5 ? "text-green-600" : product.quantity > 0 ? "text-orange-600" : "text-red-600"
              )}>
                {product.quantity > 5 ? "Stock Disponible" : product.quantity > 0 ? `Solo ${product.quantity} disponibles` : "Agotado"}
              </span>
            </div>
            <div className="space-y-2.5 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Cpu className="w-4 h-4 text-primary/70" />
                <span className="truncate">{product.processor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MemoryStick className="w-4 h-4 text-primary/70" />
                <span>{product.ram}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HardDrive className="w-4 h-4 text-primary/70" />
                <span>{product.ssd}</span>
              </div>
            </div>
          </CardContent>
        </Link>
        <CardFooter className="p-5 pt-0 flex flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-[10px] text-muted-foreground line-through decoration-primary/30">
                  RD$ {product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className={cn(
                "text-xl font-bold transition-colors",
                product.originalPrice ? "text-red-600" : "text-primary"
              )}>
                RD$ {product.price.toLocaleString()}
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant={compareItems.find(item => item.id === product.id) ? "default" : "outline"}
                className="rounded-xl border-primary/20 h-10 w-10 shrink-0"
                onClick={() => {
                  if (compareItems.find(item => item.id === product.id)) {
                    removeFromCompare(product.id);
                  } else {
                    addToCompare(product);
                    if (compareItems.length >= 3) {
                      toast.error("Máximo 3 productos para comparar");
                    } else {
                      toast.success(`${product.name} añadido para comparar`);
                    }
                  }
                }}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="rounded-xl border-primary/20 hover:bg-primary/5 h-10 w-10 shrink-0"
                onClick={() => {
                  addItem(product);
                  toast.success(`${product.name} añadido al carrito`);
                }}
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <WhatsAppDropdown 
            message={whatsappMessage} 
            className="w-full rounded-xl shadow-md hover:shadow-lg transition-all" 
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
