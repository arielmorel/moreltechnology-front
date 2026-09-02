import { Truck, MapPin, CreditCard, AlertTriangle } from "lucide-react";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { GRAN_SANTO_DOMINGO_MUNICIPALITIES, SHIPPING_RATES } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Política de Envíos - Morel Technology RD",
  description: "Conoce nuestras tarifas de envío: Gran Santo Domingo RD$350, resto del país RD$800. Envíos a toda República Dominicana.",
  alternates: {
    canonical: "/politicas/envios",
  },
};

export default function PoliticaEnviosPage() {
  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header Section */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold uppercase tracking-widest">
            <Truck className="w-3 h-3" />
            Política de Envíos
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Política de <span className="text-primary">Envíos.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Realizamos envíos a toda República Dominicana. Las tarifas son fijas según la zona de entrega.
          </p>
        </div>

        {/* Tarifas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="p-8 bg-card border border-border/50 rounded-3xl space-y-4 shadow-sm">
            <div className={cn("p-3 rounded-2xl w-fit", "bg-blue-500/10 text-blue-600")}>
              <MapPin className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Gran Santo Domingo</h2>
            <div className="text-3xl font-black text-primary">
              RD$ {SHIPPING_RATES.GRAN_SANTO_DOMINGO.toLocaleString("es-DO")}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Aplica para direcciones en:
            </p>
            <div className="flex flex-wrap gap-2">
              {GRAN_SANTO_DOMINGO_MUNICIPALITIES.map((m) => (
                <span key={m} className="px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="p-8 bg-card border border-border/50 rounded-3xl space-y-4 shadow-sm">
            <div className={cn("p-3 rounded-2xl w-fit", "bg-amber-500/10 text-amber-600")}>
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Resto de República Dominicana</h2>
            <div className="text-3xl font-black text-primary">
              RD$ {SHIPPING_RATES.REST_OF_DR.toLocaleString("es-DO")}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Aplica para cualquier dirección fuera del Gran Santo Domingo: Santiago, La Romana, Puerto Plata, San Cristóbal, y todas las demás provincias.
            </p>
          </div>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="p-8 bg-card border border-border/50 rounded-3xl space-y-4 shadow-sm">
            <div className={cn("p-3 rounded-2xl w-fit", "bg-green-500/10 text-green-600")}>
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Cobro en Checkout</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              El costo de envío se calcula automáticamente en el checkout según la dirección ingresada. El monto mostrado al cliente coincide exactamente con estas tarifas.
            </p>
          </div>

          <div className="p-8 bg-card border border-border/50 rounded-3xl space-y-4 shadow-sm">
            <div className={cn("p-3 rounded-2xl w-fit", "bg-red-500/10 text-red-600")}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Importante</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Las tarifas son fijas y no cambian según el peso o tamaño del equipo. No hay costos ocultos adicionales. El costo mostrado en el checkout es el costo final que pagarás por envío.
            </p>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-muted/30 rounded-3xl p-8 md:p-16 border border-border/50">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-6">Resumen de Tarifas</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-bold text-sm">Gran Santo Domingo</p>
                    <p className="text-xs text-muted-foreground">Distrito Nacional, Sto. Dgo. Este/Oeste/Norte</p>
                  </div>
                </div>
                <span className="font-black text-primary">RD$ {SHIPPING_RATES.GRAN_SANTO_DOMINGO.toLocaleString("es-DO")}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="font-bold text-sm">Resto del País</p>
                    <p className="text-xs text-muted-foreground">Todas las demás provincias</p>
                  </div>
                </div>
                <span className="font-black text-primary">RD$ {SHIPPING_RATES.REST_OF_DR.toLocaleString("es-DO")}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
