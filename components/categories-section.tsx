"use client";

import { homeCategories } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, Laptop, Gamepad2, GraduationCap, Code, Briefcase, Palette, Monitor, Mouse } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop,
  Gamepad2,
  GraduationCap,
  Code,
  Briefcase,
  Palette,
  Monitor,
  Mouse,
};

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="animate-slide-up text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Explora por Categoría
            </h2>
            <p className="animate-slide-up-delay-1 text-muted-foreground text-lg max-w-2xl">
              Encuentra el equipo ideal según lo que necesites.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Ver todo el catálogo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {homeCategories.map((category, index) => {
            const Icon = iconMap[category.icon];
            return (
              <Link key={category.id} href={category.href}>
                <div
                  className="animate-scale-in group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 h-full"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    {Icon && <Icon className={`w-6 h-6 ${category.textColor}`} />}
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                  <div className="mt-4 text-primary font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver opciones <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
