"use client";

import { needsCategories } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, GraduationCap, Code, Gamepad2, Palette, Briefcase } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  estudiantes: GraduationCap,
  programacion: Code,
  gaming: Gamepad2,
  diseno: Palette,
  oficina: Briefcase,
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  estudiantes: { bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500/20" },
  programacion: { bg: "bg-orange-500/10", text: "text-orange-600", border: "border-orange-500/20" },
  gaming: { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-500/20" },
  diseno: { bg: "bg-rose-500/10", text: "text-rose-600", border: "border-rose-500/20" },
  oficina: { bg: "bg-slate-500/10", text: "text-slate-600", border: "border-slate-500/20" },
};

export function ShopByNeed() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Comprar por Necesidad
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            ¿Qué necesitas?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Selecciona tu perfil y encuentra la laptop perfecta para ti.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {needsCategories.map((need, index) => {
            const Icon = iconMap[need.id];
            const colors = colorMap[need.id];
            return (
              <Link key={need.id} href={need.href}>
                <div
                  className="animate-slide-up group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className={`w-14 h-14 rounded-2xl ${colors?.bg || "bg-primary/10"} flex items-center justify-center mb-5 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    {Icon && <Icon className={`w-7 h-7 ${colors?.text || "text-primary"}`} />}
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {need.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {need.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border/30 text-primary font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar <ArrowRight className="w-3 h-3" />
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
