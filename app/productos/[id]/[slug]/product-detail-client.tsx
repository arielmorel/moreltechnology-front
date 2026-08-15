"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { getProductById, getProducts } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  HardDrive,
  MemoryStick,
  ShieldCheck,
  Truck,
  ShoppingCart,
  ChevronLeft,
  MessageCircle,
  ArrowLeft,
  Share2
} from "lucide-react";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { cn, isMinioImage } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { ConditionGuide } from "@/components/condition-guide";

interface ProductDetailClientProps {
  id: string;
  initialProduct: Product | null;
}

export default function ProductDetailClient({ id, initialProduct }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();

  const handleShare = async () => {
    if (!product) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${product.name} - ${product.brand}`;
    const text = `${product.name} por ${product.brand} - Disponible en Morel Technology`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        await navigator.clipboard.writeText(url);
        toast.success("¡Enlace copiado!");
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("¡Enlace copiado!");
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        if (!initialProduct) {
          const fetchedProduct = await getProductById(id);
          setProduct(fetchedProduct);
        }

        const { products: allProducts } = await getProducts();
        const related = allProducts.filter(p =>
          p.id !== id && (p.category === product?.category || p.brand === product?.brand)
        ).slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id, initialProduct, product?.brand, product?.category]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast.success("Producto añadido al carrito", {
        description: `${product.name} se ha agregado correctamente.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-muted rounded" />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-muted rounded-3xl" />
              <div className="space-y-6">
                <div className="h-12 w-3/4 bg-muted rounded" />
                <div className="h-6 w-1/4 bg-muted rounded" />
                <div className="h-32 w-full bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Producto no encontrado</h1>
          <p className="text-muted-foreground text-lg">Lo sentimos, el producto que buscas no existe o fue retirado.</p>
          <Button
            nativeButton={false}
            render={<Link href="/catalogo" />}
            className="rounded-full px-8"
          >
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button
            onClick={() => window.history.back()}
            className="md:hidden flex items-center gap-1 hover:text-primary transition-colors -ml-1 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo/moreltechnology" className="hover:text-primary transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Images */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-muted border border-border/50">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                unoptimized={isMinioImage(product.images[activeImage])}
                className="object-contain p-8 md:p-12"
                priority
              />


              {/* Stock Urgency Badge */}
              <div className="absolute top-6 right-6">
                {product.quantity > 5 ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-200/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    En Stock
                  </Badge>
                ) : product.quantity > 0 ? (
                  <Badge className="bg-orange-500/10 text-orange-600 border-orange-200/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    ¡Solo {product.quantity} disponibles!
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/10 text-red-600 border-red-200/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    Agotado
                  </Badge>
                )}
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0",
                      activeImage === idx ? "border-primary shadow-lg scale-95" : "border-border/50 hover:border-primary/50"
                    )}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill unoptimized={isMinioImage(img)} className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-primary font-bold tracking-widest uppercase text-sm">{product.brand}</p>
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {product.condition}
                  </Badge>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                  {product.name}
                </h2>
              </div>

              {/* Prices */}
              <div className="flex flex-col gap-1">
                {(product.prices || []).filter(p => p.priceOut > 0).map((p) => {
                  const symbol = p.currency === "USD" ? "US$" : "RD$";
                  const hasDiscount = p.offerPrice != null && p.offerPrice > 0;
                  const displayPrice = hasDiscount ? p.offerPrice! : p.priceOut;
                  return (
                    <div key={p.currency} className="flex items-baseline gap-2">
                      <span className={cn(
                        "font-bold",
                        p.currency === "USD" ? "text-lg text-muted-foreground" : "text-3xl md:text-4xl text-foreground",
                        hasDiscount && "text-red-600"
                      )}>
                        {symbol} {displayPrice.toLocaleString("es-DO")}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          {symbol} {p.priceOut.toLocaleString("es-DO")}
                        </span>
                      )}
                      {p.currency === "USD" && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">USD</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 bg-primary/10 text-primary rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Button */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="rounded-xl h-10 w-10"
                  aria-label="Compartir producto"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground">Compartir</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-muted/50 p-3 md:p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <Cpu className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Procesador</p>
                  <p className="font-bold text-xs md:text-sm break-words">{product.processor}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-3 md:p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                  <MemoryStick className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">RAM</p>
                  <p className="font-bold text-xs md:text-sm">{product.ram}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-3 md:p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                  <HardDrive className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Almacenamiento</p>
                  <p className="font-bold text-xs md:text-sm">{product.ssd}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-3 md:p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Garantía</p>
                  <p className="font-bold text-xs md:text-sm">Certificada</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                Descripción
                <span className="w-8 h-1 bg-primary/20 rounded-full" />
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 md:pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="w-full h-13 md:h-14 rounded-2xl text-base md:text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-3"
              >
                <ShoppingCart className="w-5 h-5" />
                Añadir al carrito
              </Button>
              <WhatsAppDropdown
                message={`Hola, estoy interesado en la laptop ${product.name}.`}
                className="w-full h-13 md:h-14 rounded-2xl text-base md:text-lg font-semibold border-2"
                variant="outline"
              />
            </div>

            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">Envío Express Disponible</p>
                <p className="text-sm text-muted-foreground">Recibe tu equipo hoy mismo en Santo Domingo y Santiago.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 space-y-12">
            <div className="flex items-end justify-between border-b border-border/50 pb-8">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-4xl font-black tracking-tight">EQUIPOS RELACIONADOS</h2>
                <p className="text-muted-foreground">Otras opciones que podrían interesarte</p>
              </div>
              <Button
                variant="link"
                nativeButton={false}
                render={<Link href="/catalogo" className="text-primary font-bold p-0 text-lg group" />}
              >
                Ver todo el catálogo
                <ChevronLeft className="w-4 h-4 rotate-180 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
