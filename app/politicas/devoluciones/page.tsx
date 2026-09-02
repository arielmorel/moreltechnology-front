import { RotateCcw, AlertTriangle, CreditCard, ShieldCheck } from "lucide-react";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Política de Devoluciones - Morel Technology RD",
  description: "Conoce nuestra política de devoluciones. No se realizan devoluciones de dinero. Los problemas se gestionan bajo garantía.",
  alternates: {
    canonical: "/politicas/devoluciones",
  },
};

export default function DevolucionesPage() {
  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-widest">
            <RotateCcw className="w-3 h-3" />
            Política de Devoluciones
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Política de <span className="text-primary">Devoluciones.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            En Morel Technology, cada venta es definitiva. A continuación encontrarás los términos que aplican para cualquier situación relacionada con tu compra.
          </p>
        </div>

        {/* Key Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="p-8 bg-card border border-border/50 rounded-3xl space-y-4 shadow-sm">
            <div className={cn("p-3 rounded-2xl w-fit", "bg-red-500/10 text-red-600")}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">No se realizan devoluciones de dinero</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Después de realizada la compra, no se efectúan reembolsos ni devoluciones de dinero bajo ninguna circunstancia.
            </p>
          </div>

          <div className="p-8 bg-card border border-border/50 rounded-3xl space-y-4 shadow-sm">
            <div className={cn("p-3 rounded-2xl w-fit", "bg-blue-500/10 text-blue-600")}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Gestión bajo garantía</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Los problemas relacionados con productos deben gestionarse bajo las condiciones de garantía. Dependiendo del caso, puede existir cambio de equipo, reparación u otra solución aplicable.
            </p>
          </div>

          <div className="p-8 bg-card border border-border/50 rounded-3xl space-y-4 shadow-sm">
            <div className={cn("p-3 rounded-2xl w-fit", "bg-green-500/10 text-green-600")}>
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Notas de crédito</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Cuando corresponda, puede emitirse una nota de crédito. Esta nota de crédito no constituye un reembolso de dinero.
            </p>
          </div>
        </div>

        {/* Process */}
        <div className="bg-muted/30 rounded-3xl p-8 md:p-16 border border-border/50">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-6">¿Tienes un problema con tu equipo?</h2>
            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-primary/20">
              {[
                { step: "1", title: "Contacta soporte", desc: "Contáctanos por WhatsApp o acude a nuestra sucursal con tu factura de compra." },
                { step: "2", title: "Evaluación técnica", desc: "Nuestro equipo técnico diagnosticará el problema y determinará si aplica bajo garantía." },
                { step: "3", title: "Solución aplicable", desc: "Según el caso, se realizará una reparación, cambio de equipo o se emitirá una nota de crédito." }
              ].map((item, i) => (
                <div key={i} className="relative pl-10 space-y-1">
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                   <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
