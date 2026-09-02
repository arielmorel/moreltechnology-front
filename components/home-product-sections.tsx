"use client";

import { Product } from "@/lib/data";
import { ProductCard } from "./product-card";
import { ProductCarousel } from "./product-carousel";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

interface HomeProductSectionsProps {
  newArrivals: Product[];
  featured: Product[];
}

function ProductSection({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  products,
  linkHref,
  linkText,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  products: Product[];
  linkHref: string;
  linkText: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
              {title}
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl">
              {subtitle}
            </p>
          </div>
          <Link
            href={linkHref}
            className="group h-11 px-6 rounded-xl bg-card border border-border/50 shadow-sm flex items-center gap-2 font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 shrink-0"
          >
            {linkText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeProductSections({
  newArrivals,
  featured,
}: HomeProductSectionsProps) {
  return (
    <>
      <ProductCarousel type="featured" products={featured} autoRotate />

      <ProductSection
        title="Recién Llegados"
        subtitle="Los últimos equipos que agregamos a nuestro inventario."
        icon={Clock}
        iconColor="text-blue-500"
        products={newArrivals}
        linkHref="/catalogo"
        linkText="Ver catálogo"
      />
    </>
  );
}
