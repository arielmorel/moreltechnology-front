import { ShieldCheck, FileText, CheckCircle2, XCircle, Clock, Search, Wrench, Package } from "lucide-react";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Garantía de Laptops - Morel Technology RD",
  description: "Conoce nuestras políticas de garantía: equipos nuevos con 12 meses, usados con 6 meses. Diagnóstico gratis, factura fiscal incluida.",
  alternates: {
    canonical: "/politicas/garantia",
  },
};

export default function GarantiaPage() {
  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            Compra Protegida
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Nuestras Políticas de <span className="text-primary">Garantía.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            En Morel Technology, tu inversión está segura. Entendemos que una laptop es una herramienta vital, por eso ofrecemos un soporte técnico de respuesta rápida y transparente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Clock,
              title: "Tiempos de Garantía",
              desc: "Nuevos: 12 meses. Usados Grado A: 6 meses. Usados Grado B: 3 meses. Todas las baterías tienen 1 mes de garantía.",
              iconClass: "bg-blue-500/10 text-blue-600"
            },
            {
              icon: Search,
              title: "Diagnóstico Gratis",
              desc: "Si el equipo presenta fallas dentro del periodo de garantía, el diagnóstico y la mano de obra son totalmente libres de costo.",
              iconClass: "bg-purple-500/10 text-purple-600"
            },
            {
              icon: FileText,
              title: "Factura Fiscal",
              desc: "Cada compra incluye una factura timbrada con el número de serie único del equipo para validar tu garantía legal.",
              iconClass: "bg-green-500/10 text-green-600"
            }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-card border border-border/50 rounded-3xl space-y-4 shadow-sm">
              <div className={cn("p-3 rounded-2xl w-fit", item.iconClass)}>
                <item.icon className="w-6 h-6" />
              </div>
               <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Coverage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-green-600">
              <CheckCircle2 className="w-8 h-8" />
              ¿Qué cubrimos?
            </h2>
            <ul className="space-y-4">
              {[
                "Defectos de fábrica en la placa madre (Motherboard).",
                "Fallas en el encendido o gestión de energía.",
                "Píxeles muertos o fallas gráficas en pantalla.",
                "Teclados con teclas que dejan de funcionar.",
                "Puertos USB o HDMI con fallas de conexión interna.",
                "Discos duros o memorias RAM con errores de lectura."
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-destructive">
              <XCircle className="w-8 h-8" />
              ¿Qué NO cubrimos?
            </h2>
            <ul className="space-y-4">
              {[
                "Daños físicos (golpes, pantallas rotas, bisagras forzadas).",
                "Derrame de líquidos de cualquier tipo.",
                "Equipos con sellos de seguridad rotos por terceros.",
                "Problemas de software (virus, actualizaciones mal instaladas).",
                "Uso de cargadores genéricos no suministrados por nosotros.",
                "Picos de voltaje o daños por desastres naturales."
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Warranty Details by Equipment Type */}
        <div className="mb-20 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Detalle de Cobertura por Tipo de Equipo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Conoce exactamente qué cubre tu garantía durante cada periodo de tiempo.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Used Equipment */}
            <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 bg-orange-500/5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-orange-500/10">
                    <Wrench className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Equipos Usados</h3>
                    <p className="text-sm text-muted-foreground">Reacondicionados (Refurbished)</p>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-sm font-bold">
                  <Clock className="w-4 h-4" />
                  6 Meses de Garantía
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">1-3</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-green-600">Piezas + Mano de Obra</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Si el equipo presenta una falla de hardware cubierta, se repara o reemplaza la pieza sin ningún costo para el cliente.</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border/50 pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <span className="text-xs font-bold text-orange-600 bg-orange-500/10 px-2 py-1 rounded-full">4-6</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-orange-600">Solo Mano de Obra</span>
                      </div>
                      <p className="text-sm text-muted-foreground">La reparación no tiene costo, pero las piezas de repuesto necesarias tienen un costo adicional para el cliente.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* New Equipment */}
            <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 bg-blue-500/5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-blue-500/10">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Equipos Nuevos</h3>
                    <p className="text-sm text-muted-foreground">Comprados como nuevos</p>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 text-sm font-bold">
                  <Clock className="w-4 h-4" />
                  12 Meses de Garantía
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">1-6</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-green-600">Piezas + Mano de Obra</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Si el equipo presenta una falla de hardware cubierta, se repara o reemplaza la pieza sin ningún costo para el cliente.</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border/50 pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <span className="text-xs font-bold text-orange-600 bg-orange-500/10 px-2 py-1 rounded-full">7-12</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-orange-600">Solo Mano de Obra</span>
                      </div>
                      <p className="text-sm text-muted-foreground">La reparación no tiene costo, pero las piezas de repuesto necesarias tienen un costo adicional para el cliente.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-muted/30 rounded-3xl p-8 md:p-16 border border-border/50">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-6">Proceso de Reclamación</h2>
            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-primary/20">
              {[
                { step: "1", title: "Reporte Inicial", desc: "Contáctanos por WhatsApp con tu número de factura y un video/foto de la falla." },
                { step: "2", title: "Evaluación Técnica", desc: "Trae el equipo a nuestra sucursal. El equipo técnico lo revisará en un plazo de 24-48 horas." },
                { step: "3", title: "Reparación o Cambio", desc: "Si la falla aplica, procederemos con la reparación. Si no es reparable, te entregamos un equipo de iguales o mejores specs." }
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
