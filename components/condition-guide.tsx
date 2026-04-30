"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, CheckCircle2, Star, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConditionGuide() {
  const conditions = [
    {
      grade: "Nuevo",
      title: "Sellado de Fábrica",
      description: "Equipo totalmente nuevo en su caja original con todos sus sellos intactos.",
      benefits: ["Garantía completa", "Batería 100%", "Accesorios originales"],
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      grade: "A+ (Como Nuevo)",
      title: "Estado Impecable",
      description: "Equipos Open Box o con uso mínimo. No presentan ningún rastro de desgaste estético.",
      benefits: ["Pantalla perfecta", "Batería 90%+", "Cero rayones"],
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
    {
      grade: "A (Excelente)",
      title: "Uso Normal",
      description: "Equipos con muy poco uso. Pueden tener alguna marca cosmética casi imperceptible.",
      benefits: ["Excelente estética", "Batería 80%+", "100% funcional"],
      color: "text-orange-600",
      bg: "bg-orange-500/10",
    },
    {
      grade: "B (Buen Estado)",
      title: "Precio de Oportunidad",
      description: "Equipos con detalles estéticos visibles (rayoncitos o desgaste de uso), pero perfectos por dentro.",
      benefits: ["El mejor ahorro", "Hardware probado", "Ideal para trabajo rudo"],
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    }
  ];

  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-full border border-border/50 group">
        <Info className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
        ¿Qué significa el estado?
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-primary p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-3xl font-black tracking-tight">Guía de Condiciones</DialogTitle>
            <DialogDescription className="text-primary-foreground/80 text-lg">
              En Morel Technology somos transparentes. Cada equipo es inspeccionado en más de 20 puntos antes de ponerse a la venta.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-background">
          {conditions.map((c) => (
            <div key={c.grade} className="p-5 rounded-3xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className={cn("text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest", c.bg, c.color)}>
                  {c.grade}
                </span>
                <CheckCircle2 className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </div>
              <h4 className="font-bold text-lg mb-2">{c.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {c.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {c.benefits.map((b) => (
                  <span key={b} className="text-[9px] font-bold bg-muted px-2 py-1 rounded-lg">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-muted/30 border-t border-border/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Garantía Morel</p>
            <p className="text-xs text-muted-foreground">Todos nuestros estados incluyen garantía por escrito.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
