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
  MessageCircle
} from "lucide-react";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
      <div className="min-h-screen pt-24 pb-16">
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
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Images */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-muted border border-border/50">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-contain p-8 md:p-12"
                priority
              />

              {/* Condition Badge */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  {product.condition}
                </Badge>
                <ConditionGuide />
              </div>

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
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-primary font-bold tracking-widest uppercase text-sm">{product.brand}</p>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-foreground leading-none">
                  {product.name.toUpperCase()}
                </h1>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">
                ${product.price.toLocaleString()}
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through ml-4 font-medium">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-2xl border border-border/50 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Procesador</p>
                  <p className="font-bold text-sm truncate">{product.processor}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-2xl border border-border/50 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <MemoryStick className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">RAM</p>
                  <p className="font-bold text-sm">{product.ram}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-2xl border border-border/50 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Almacenamiento</p>
                  <p className="font-bold text-sm">{product.ssd}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-2xl border border-border/50 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Garantía</p>
                  <p className="font-bold text-sm">Certificada</p>
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

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="flex-1 h-14 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                AÑADIR AL CARRITO
              </Button>
              <WhatsAppDropdown
                message={`Hola, estoy interesado en la laptop ${product.name}.`}
                className="flex-1 h-14 rounded-2xl text-lg font-bold border-2"
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
                <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter">EQUIPOS RELACIONADOS</h2>
                <p className="text-muted-foreground">Otras opciones que podrían interesarte</p>
              </div>
              <Button
                variant="link"
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
