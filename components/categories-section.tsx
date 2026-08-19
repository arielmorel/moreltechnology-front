"use client";

import { categories } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="animate-slide-up text-3xl md:text-4xl font-bold tracking-tight mb-4">Categorías Destacadas</h2>
            <p className="animate-slide-up-delay-1 text-muted-foreground text-lg max-w-2xl">
              Explora nuestra selección de laptops según tus necesidades específicas.
            </p>
          </div>
          <Link href="/catalogo" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            Ver todo el catálogo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link key={category.id} href={`/catalogo?categoria=${category.id}`}>
              <div
                className={`animate-scale-in relative overflow-hidden rounded-3xl group cursor-pointer aspect-[4/3] ${
                  index === 0 || index === 3 ? "md:col-span-2 lg:col-span-2" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 duration-500" />
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 p-5 sm:p-8 z-20 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-white/80 line-clamp-2">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
