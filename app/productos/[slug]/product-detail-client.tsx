"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/data";
import { getProductBySlug, getProducts } from "@/lib/api";
import { ArrowLeft, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProductCarousel } from "@/components/product-carousel";
import { AccessoriesCarousel } from "@/components/accessories-carousel";
import { ProductReviewForm } from "@/components/product-review-form";
import { getApprovedReviews } from "@/app/actions/reviews";
import { ProductImageGallery } from "@/components/product-detail/product-image-gallery";
import { ProductInfoCard } from "@/components/product-detail/product-info-card";
import { ProductReviewsSummary } from "@/components/product-detail/product-reviews-summary";
import { NotifyWhenAvailable } from "@/components/notify-when-available";

interface ProductDetailClientProps {
  slug: string;
  initialProduct: Product | null;
}

export default function ProductDetailClient({ slug, initialProduct }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [reviewsData, setReviewsData] = useState({
    reviews: [] as Array<{
      id: string;
      customerName: string;
      rating: number;
      title: string | null;
      comment: string;
      verifiedPurchase: boolean;
      createdAt: Date;
    }>,
    averageRating: 0,
    totalReviews: 0,
  });
  const { addItem } = useCart();

  const warrantyLabel = product?.warranty
    ? `${Math.round(product.warranty / 30)} ${Math.round(product.warranty / 30) === 1 ? "mes" : "meses"}`
    : "Certificada";

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
        const currentProduct = initialProduct || await getProductBySlug(slug);

        if (!initialProduct) {
          setProduct(currentProduct);
        }

        const { products: allProducts } = await getProducts();
        const related = currentProduct
          ? allProducts.filter(p =>
              p.slug !== slug && (p.category === currentProduct.category || p.brand === currentProduct.brand)
            ).slice(0, 8)
          : [];
        setRelatedProducts(related);

        if (currentProduct) {
          const productId = parseInt(currentProduct.id, 10);
          if (!isNaN(productId)) {
            const reviews = await getApprovedReviews(productId);
            setReviewsData(reviews);
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [slug, initialProduct]);

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
        <div className="min-h-screen pt-24 pb-16 animate-fade-in">
      <div className="container mx-auto px-3 md:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 md:mb-6 animate-slide-up">
          <button
            onClick={() => window.history.back()}
            className="md:hidden flex items-center hover:text-slate-900 transition-colors -ml-1 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <Link href="/" className="hover:text-slate-900 transition-colors">Inicio</Link>
          <span className="text-slate-300">/</span>
          <Link href="/catalogo/moreltechnology" className="hover:text-slate-900 transition-colors">Catálogo</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600 font-medium truncate max-w-[150px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-start">
          <div className="animate-slide-up-delay-1">
            <ProductImageGallery
              product={product}
              activeImage={activeImage}
              onActiveImageChange={setActiveImage}
              isImageViewerOpen={isImageViewerOpen}
              onImageViewerOpenChange={setIsImageViewerOpen}
            />
          </div>

          <div className="animate-slide-up-delay-2">
            <ProductInfoCard
              product={product}
              warrantyLabel={warrantyLabel}
              onAddToCart={handleAddToCart}
              onShare={handleShare}
            />
          </div>
        </div>

        {/* Accessories Carousel */}
        <div className="mt-8 md:mt-12 animate-slide-up-delay-3">
          <AccessoriesCarousel currentProductId={product.slug} />
        </div>

        {/* Reviews Summary Card */}
        <div className="animate-slide-up-delay-4">
          <ProductReviewsSummary
            reviews={reviewsData.reviews}
            averageRating={reviewsData.averageRating}
            totalReviews={reviewsData.totalReviews}
          />
        </div>

        {/* Review Form */}
        <div id="review-form" className="mt-6 scroll-mt-20 animate-slide-up-delay-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <ProductReviewForm productId={parseInt(product.id, 10)} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 md:mt-12 animate-slide-up-delay-6">
            <ProductCarousel
              type="related"
              products={relatedProducts}
              linkHref="/catalogo"
              linkText="Ver catálogo"
            />
          </div>
        )}
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 py-3 px-4 shadow-lg flex items-center gap-3 md:hidden safe-area-pb">
        {product.quantity === 0 ? (
          <div className="w-full">
            <NotifyWhenAvailable productId={product.id} productName={product.name} />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-start shrink-0">
              <span className="text-lg font-extrabold text-slate-900 leading-tight">
                RD$ {(product.prices?.[0]?.offerPrice || product.prices?.[0]?.priceOut || product.price).toLocaleString("es-DO")}
              </span>
              <span className="text-[9px] font-medium text-emerald-600 leading-none mt-0.5">
                Envío gratis
              </span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Agregar
              </button>
              <a
                href={`https://wa.me/18095551234?text=${encodeURIComponent(`Hola, estoy interesado en ${product.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors flex items-center justify-center shrink-0"
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
