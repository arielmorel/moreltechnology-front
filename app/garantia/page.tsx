import { ShieldCheck, FileText, CheckCircle2, XCircle, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GarantiaPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
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
              color: "blue"
            },
            {
              icon: Search,
              title: "Diagnóstico Gratis",
              desc: "Si el equipo presenta fallas dentro del periodo de garantía, el diagnóstico y la mano de obra son totalmente libres de costo.",
              color: "purple"
            },
            {
              icon: FileText,
              title: "Factura Fiscal",
              desc: "Cada compra incluye una factura timbrada con el número de serie único del equipo para validar tu garantía legal.",
              color: "green"
            }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-card border border-border/50 rounded-3xl space-y-4 shadow-sm">
              <div className={`p-3 bg-${item.color}-500/10 text-${item.color}-600 rounded-2xl w-fit`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
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
                  <h4 className="font-bold">{item.title}</h4>
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
