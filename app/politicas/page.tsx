import Link from "next/link";
import { ShieldCheck, RotateCcw, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Políticas - Morel Technology RD",
  description: "Consulta nuestras políticas de garantía, devoluciones y condiciones de compra en Morel Technology.",
  alternates: {
    canonical: "/politicas",
  },
};

const policies = [
  {
    icon: ShieldCheck,
    title: "Garantía",
    description: "Conoce nuestros tiempos de cobertura, qué cubre la garantía y el proceso de reclamación para equipos nuevos y usados.",
    href: "/politicas/garantia",
    iconClass: "bg-green-500/10 text-green-600",
  },
  {
    icon: RotateCcw,
    title: "Devoluciones",
    description: "Consulta nuestra política de devoluciones, notas de crédito y condiciones de gestión ante problemas con productos.",
    href: "/politicas/devoluciones",
    iconClass: "bg-amber-500/10 text-amber-600",
  },
];

export default function PoliticasPage() {
  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Nuestras <span className="text-primary">Políticas.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Transparencia y claridad en cada aspecto de tu compra. Conoce nuestras condiciones para garantía, devoluciones y más.
          </p>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {policies.map((policy) => (
            <Link
              key={policy.href}
              href={policy.href}
              className="group p-8 bg-card border border-border/50 rounded-3xl space-y-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className={cn("p-3 rounded-2xl w-fit", policy.iconClass)}>
                <policy.icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                {policy.title}
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {policy.description}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
