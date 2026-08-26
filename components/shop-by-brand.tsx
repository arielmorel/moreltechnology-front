"use client";

import { brands } from "@/lib/data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ShopByBrand() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Comprar por Marca
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Marcas que respaldamos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Distribuidor autorizado de las mejores marcas de tecnología.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {brands.map((brand, index) => (
            <Link key={brand.slug} href={`/laptops/${brand.slug}`}>
              <div
                className="animate-scale-in group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 text-center hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className="text-2xl md:text-3xl font-black tracking-tighter mb-3 transition-transform group-hover:scale-110"
                  style={{ color: brand.color }}
                >
                  {brand.name}
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Ver laptops
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
          >
            Ver todas las marcas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
