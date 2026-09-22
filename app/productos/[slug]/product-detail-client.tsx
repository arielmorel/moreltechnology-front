"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Product, ProductVariant } from "@/lib/data";
import { getProductBySlug, getProducts, PAGE_SIZE_RAIL } from "@/lib/api";
import { MessageCircle, ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { ProductCarousel } from "@/components/product-carousel";
import { ModelCarousel } from "@/components/model-carousel";
import { AccessoriesCarousel } from "@/components/accessories-carousel";
import { ProductReviewForm } from "@/components/product-review-form";
import { ProductImageGallery } from "@/components/product-detail/product-image-gallery";
import { ProductInfoCard } from "@/components/product-detail/product-info-card";
import { NotifyWhenAvailable } from "@/components/notify-when-available";

interface ProductDetailClientProps {
  slug: string;
  initialProduct: Product | null;
  children?: React.ReactNode;
}

export default function ProductDetailClient({ slug, initialProduct, children }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [prevProductId, setPrevProductId] = useState(product?.id);
  const { addItem } = useCart();

  const warrantyLabel = product?.warranty
    ? `${Math.round(product.warranty / 30)} ${Math.round(product.warranty / 30) === 1 ? "mes" : "meses"}`
    : "Certificada";

  // Reset variant when product changes — start with primary (undefined = main product)
  if (prevProductId !== product?.id) {
    setPrevProductId(product?.id);
    setSelectedVariant(undefined);
  }

  const getDisplayPrice = (prices: Product["prices"]) => {
    const dop = prices?.find(p => p.currency === "DOP");
    if (dop) {
      return dop.offerPrice && dop.offerPrice > 0 ? dop.offerPrice : dop.priceOut;
    }
    return prices?.[0]?.offerPrice || prices?.[0]?.priceOut || 0;
  };

  const currentDisplayPrice = selectedVariant?.prices?.length
    ? getDisplayPrice(selectedVariant.prices)
    : product ? getDisplayPrice(product.prices) : 0;

  // Derive model search query: "Dell Latitude 7420" → "Latitude 7420"
  const modelQuery = product?.name
    ?.replace(new RegExp(`^${product.brand}\\s+`, "i"), "")
    .trim() ?? "";

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
    if (initialProduct) return;

    async function loadData() {
      try {
        const currentProduct = await getProductBySlug(slug);

        if (currentProduct) {
          setProduct(currentProduct);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [slug, initialProduct]);

  const fetchRelated = useCallback(
    async (page: number) => {
      const category = product?.category;
      if (!category) return { products: [], total: 0 };
      const { products, total } = await getProducts(page, PAGE_SIZE_RAIL, category);
      const excluded = products.filter(p => p.slug !== slug);
      return { products: excluded, total: Math.max(0, total - (products.length - excluded.length)) };
    },
    [product?.category, slug]
  );

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
              <div className="aspect-square md:aspect-[4/3] bg-muted rounded-3xl" />
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
    <div className="min-h-screen pt-16 md:pt-20 pb-24 md:pb-16 animate-fade-in">
      <div className="container mx-auto px-3 md:px-6">
        {/* Desktop Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground mb-4 md:mb-6 animate-slide-up">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/catalogo/moreltechnology" className="hover:text-foreground transition-colors">Catálogo</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground font-medium truncate max-w-[150px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-start">
          <div className="animate-slide-up-delay-1">
            <ProductImageGallery
              product={product}
              activeImage={activeImage}
              onActiveImageChange={setActiveImage}
            />
          </div>

          <div className="animate-slide-up-delay-2">
            <ProductInfoCard
              product={product}
              warrantyLabel={warrantyLabel}
              onAddToCart={handleAddToCart}
              onShare={handleShare}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />
          </div>
        </div>

        {/* Same Model Carousel */}
        <div className="animate-slide-up-delay-3">
          <ModelCarousel query={modelQuery} excludeSlug={product.slug} />
        </div>

        {/* Accessories Carousel */}
        <div className="mt-4 md:mt-8 animate-slide-up-delay-3">
          <AccessoriesCarousel currentProductId={product.slug} />
        </div>

        {/* Reviews Summary Card (streamed from server) */}
        <div className="animate-slide-up-delay-4">
          {children}
        </div>

        {/* Review Form - Collapsible on mobile */}
        <div id="review-form" className="mt-4 md:mt-6 scroll-mt-20 animate-slide-up-delay-5">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-sm font-semibold text-foreground">Dejar una reseña</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" />
            </summary>
            <div className="bg-card rounded-2xl border border-border p-4 mt-2 shadow-sm">
              <ProductReviewForm productId={parseInt(product.id, 10)} />
            </div>
          </details>
        </div>

        {/* Related Products */}
        <div className="mt-6 md:mt-10 animate-slide-up-delay-6">
          <ProductCarousel
            type="related"
            products={[]}
            fetchPage={fetchRelated}
            linkHref="/catalogo"
            linkText="Ver catálogo"
          />
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border py-3 px-4 shadow-lg flex items-center gap-3 md:hidden">
        {product.quantity === 0 ? (
          <div className="w-full">
            <NotifyWhenAvailable productId={product.id} productName={product.name} />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-start shrink-0">
              <span className="text-lg font-extrabold text-foreground leading-tight">
                RD$ {currentDisplayPrice.toLocaleString("es-DO")}
              </span>
              <span className="text-[9px] font-medium text-emerald-600 leading-none mt-0.5">
                Envío gratis
              </span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md active:scale-[0.97] flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Agregar
              </button>
              <a
                href={`https://wa.me/18095551234?text=${encodeURIComponent(`Hola, estoy interesado en ${product.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-200 active:scale-90 flex items-center justify-center shrink-0"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
