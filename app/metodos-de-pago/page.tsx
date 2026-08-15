import { Metadata } from "next";
import { CreditCard, Banknote, Landmark, ShieldCheck, ArrowRight, CircleDollarSign } from "lucide-react";
import Link from "next/link";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Métodos de Pago - Morel Technology",
  description: "Conoce los métodos de pago aceptados en Morel Technology: transferencia bancaria, depósito, tarjeta de crédito y efectivo.",
  alternates: {
    canonical: "/metodos-de-pago",
  },
};

const paymentMethods = [
  {
    icon: Banknote,
    title: "Efectivo",
    description: "Pago en efectivo al momento de la compra en cualquiera de nuestras sucursales.",
    details: ["Sin comisiones adicionales", "Pago inmediato", "Disponible en sucursal"],
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: Landmark,
    title: "Transferencia Bancaria",
    description: "Realiza una transferencia directa desde tu banca en línea o app móvil. Envíanos el comprobante por WhatsApp.",
    details: ["Sin comisiones", "Confirmación en minutos", "Todo el día, todos los días"],
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: CreditCard,
    title: "Tarjeta de Crédito / Débito",
    description: "Aceptamos tarjetas Visa, Mastercard y American Express. Pago con terminal punto de venta en sucursal.",
    details: ["Visa, Mastercard, AmEx", "Cuotas disponibles", "Pago seguro y encriptado"],
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: CircleDollarSign,
    title: "Depósito",
    description: "Depósito directo en cuenta bancaria. Aceptamos depósitos en Banreservas, BHD, Popular y otros bancos.",
    details: ["Envía comprobante por WhatsApp", "Procesamiento rápido", "Disponible en cajero"],
    color: "bg-orange-500/10 text-orange-600",
  },
];

const banks = [
  { name: "Banreservas", type: "Cuenta Corriente / Ahorro" },
  { name: "BHD", type: "Cuenta Corriente / Ahorro" },
  { name: "Banco Popular", type: "Cuenta Corriente / Ahorro" },
  { name: "Banca Ademi", type: "Cuenta Corriente / Ahorro" },
  { name: "APAP", type: "Cuenta Corriente / Ahorro" },
  { name: "Qik", type: "Cuenta Corriente / Ahorro" },
  { name: "Scotiabank", type: "Cuenta Corriente / Ahorro" },
];

export default function MetodosDePagoPage() {
  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-4">
            <CircleDollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              Pagos
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Métodos de Pago
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            En Morel Technology aceptamos múltiples formas de pago para que elijas la que más te convenga. Monedas aceptadas: <strong className="text-foreground">DOP (Peso Dominicano)</strong> y <strong className="text-foreground">USD (Dólar Americano)</strong>.
          </p>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {paymentMethods.map((method, i) => (
            <div key={i} className="p-8 bg-card border border-border/50 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className={cn("p-3 rounded-2xl w-fit", method.color)}>
                <method.icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">{method.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{method.description}</p>
              <ul className="space-y-2 pt-2">
                {method.details.map((detail, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Banks */}
        <div className="mb-20">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Bancos Aceptados</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transferencias y depósitos disponibles en estos bancos. Todos los datos se envían por WhatsApp después de tu solicitud.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {banks.map((bank, i) => (
              <div key={i} className="p-5 bg-card border border-border/50 rounded-2xl text-center space-y-2 shadow-sm hover:border-primary/30 transition-colors">
                <Landmark className="w-5 h-5 text-primary mx-auto" />
                <p className="font-semibold text-sm">{bank.name}</p>
                <p className="text-[11px] text-muted-foreground">{bank.type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 md:p-12 bg-primary/5 rounded-3xl border border-primary/10 text-center space-y-6">
          <h3 className="text-2xl font-bold">¿Listo para comprar?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Solicita nuestros datos bancarios o recibe una cotización personalizada. Nuestro equipo te atiende al instante por WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <WhatsAppDropdown className="h-14 px-8 rounded-2xl text-lg shadow-xl shadow-green-600/20">
              Solicitar datos para transferencia
            </WhatsAppDropdown>
            <Link href="/catalogo">
              <button className="h-14 px-8 rounded-2xl text-lg font-semibold border border-border bg-card hover:bg-muted transition-colors flex items-center gap-2 justify-center w-full sm:w-auto">
                Ver catálogo
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
