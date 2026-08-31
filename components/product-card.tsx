"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, MemoryStick, Eye, ShoppingCart, ArrowRightLeft, BadgePercent } from "lucide-react";
import { motion } from "framer-motion";
import { WhatsAppDropdown } from "./whatsapp-dropdown";
import { Button } from "./ui/button";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { cn, isMinioImage, productUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { addItem, addToCompare, removeFromCompare, compareItems } = useCart();
  const whatsappMessage = `Hola, me interesa la laptop ${product.name} que vi en la página web.`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden border border-border/50 bg-card/50 py-0 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
        <Link href={productUrl(product.slug)} className="flex-1 flex flex-col">
          <CardHeader className="p-0 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                unoptimized={isMinioImage(product.images[0])}
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
            {variant === "compact" && product.originalPrice && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-red-600 text-white border-0 shadow-lg text-xs font-bold px-2.5 py-1">
                  <BadgePercent className="w-3 h-3 mr-1" />
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className={variant === "compact" ? "flex-1 p-4" : "flex-1 p-5"}>
            <div className="mb-2">
              <p className={variant === "compact" ? "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1" : "text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider"}>{product.brand}</p>
              <h3 className={variant === "compact" ? "min-w-0 font-semibold text-sm line-clamp-2 group-hover:text-red-600 transition-colors mb-3 min-h-[2.5rem]" : "min-w-0 font-semibold text-sm sm:text-lg line-clamp-2 mt-1 group-hover:text-primary transition-colors"}>{product.name} | {product.description}</h3>
            </div>
            {variant === "compact" ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      RD$ {product.originalPrice.toLocaleString("es-DO")}
                    </span>
                  )}
                  <span className="text-lg font-bold text-red-600">
                    RD$ {product.price.toLocaleString("es-DO")}
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-lg border-primary/20 shrink-0"
                  aria-label="Agregar al carrito"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addItem(product);
                    toast.success(`${product.name} añadido al carrito`);
                  }}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-2 mb-4">
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
                <div className="hidden sm:block space-y-2.5 mt-4">
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
                <div className="mt-4 flex flex-col sm:hidden">
                  {product.originalPrice && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      RD$ {product.originalPrice.toLocaleString("es-DO")}
                    </span>
                  )}
                  <span className={cn(
                    "whitespace-nowrap text-base font-bold leading-tight sm:text-lg",
                    product.originalPrice ? "text-red-600" : "text-primary"
                  )}>
                    RD$ {product.price.toLocaleString("es-DO")}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Link>
        {variant === "default" && <CardFooter className="p-3 pt-0 sm:p-5 sm:pt-0 flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-end sm:justify-between w-full">
            <div className="hidden sm:flex flex-col">
              {product.originalPrice && (
                <span className="text-[10px] text-muted-foreground line-through decoration-primary/30">
                  RD$ {product.originalPrice.toLocaleString("es-DO")}
                </span>
              )}
              <span className={cn(
                "text-lg sm:text-xl font-bold transition-colors break-words",
                product.originalPrice ? "text-red-600" : "text-primary"
              )}>
                RD$ {product.price.toLocaleString("es-DO")}
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant={compareItems.find(item => item.id === product.id) ? "default" : "outline"}
                className="rounded-xl border-primary/20 h-9 w-9 sm:h-10 sm:w-10 shrink-0"
                aria-label="Comparar producto"
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
                className="rounded-xl border-primary/20 hover:bg-primary/5 h-9 w-9 sm:h-10 sm:w-10 shrink-0"
                aria-label="Agregar al carrito"
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
            variant="outline"
            className="w-full rounded-xl border-green-700 text-green-700 shadow-sm transition-all hover:!bg-green-700 hover:!text-white hover:shadow-lg"
          >
            <span className="max-sm:hidden sm:inline-block">Contactar</span>
          </WhatsAppDropdown>
        </CardFooter>}
      </Card>
    </motion.div>
  );
}
