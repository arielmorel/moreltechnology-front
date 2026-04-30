import { FinancingForm } from "@/components/financing-form";
import { Metadata } from "next";
import { ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Solicitar Financiamiento - Morel Technology",
  description: "Aplica en línea para el financiamiento de tu próxima laptop. Aprobación rápida, requisitos simples y cuotas cómodas.",
};

export default function FinanciamientoPage() {
  return (
    <div className="min-h-screen bg-muted/20 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Llévate tu laptop hoy, <span className="text-primary">págala al paso.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Llena este breve formulario para pre-evaluar tu perfil. Te respondemos por WhatsApp en tiempo récord con las mejores opciones de cuotas para ti.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="flex flex-col gap-2 p-4 bg-background border border-border/50 rounded-xl">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Respuesta Rápida</h3>
              <p className="text-sm text-muted-foreground">Evaluamos tu solicitud en menos de 24 horas laborables.</p>
            </div>
            <div className="flex flex-col gap-2 p-4 bg-background border border-border/50 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold">Sin Papeleo Físico</h3>
              <p className="text-sm text-muted-foreground">Todo el proceso inicial se hace digital vía WhatsApp.</p>
            </div>
            <div className="flex flex-col gap-2 p-4 bg-background border border-border/50 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold">Seguridad Total</h3>
              <p className="text-sm text-muted-foreground">Tus datos están protegidos y solo se usan para evaluación.</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <FinancingForm />

      </div>
    </div>
  );
}
