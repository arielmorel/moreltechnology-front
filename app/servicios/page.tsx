import { Wrench, Laptop, HardDrive, Monitor, Keyboard, Cpu, Database, Search, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios Técnicos | MorelTechnology RD",
  description: "Servicios técnicos especializados para laptops y computadoras. Diagnóstico, mantenimiento, formateo, instalación de componentes y más.",
};

const services = [
  {
    icon: Search,
    name: "Diagnóstico",
    price: "RD$500",
    description: "Evaluación completa del estado de tu equipo para identificar problemas.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Laptop,
    name: "Mantenimiento Laptop",
    price: "RD$1,200",
    description: "Limpieza interna, cambio de pasta térmica y optimización del sistema.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Laptop,
    name: "Mantenimiento Laptop Gaming",
    price: "RD$1,500",
    description: "Mantenimiento especializado para laptops gaming con sistemas de enfriamiento avanzado.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: HardDrive,
    name: "Formateo + Windows",
    price: "RD$1,200",
    description: "Instalación limpia de Windows con controladores actualizados.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: Shield,
    name: "Formateo + Windows + Programas",
    price: "RD$1,500",
    description: "Formateo completo con Windows, office, antivirus y programas esenciales.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Cpu,
    name: "Instalación de SSD/RAM",
    price: "RD$500",
    description: "Instalación y configuración de memoria RAM o disco SSD.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Monitor,
    name: "Cambio de Pantalla",
    price: "RD$1,000",
    description: "Reemplazo de pantalla dañada (mano de obra).",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Keyboard,
    name: "Cambio de Teclado",
    price: "RD$1,000",
    description: "Reemplazo de teclado dañado o con teclas defectuosas (mano de obra).",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Cpu,
    name: "Reparación de Placa",
    price: "desde RD$2,000",
    description: "Reparación de placa base con componentes dañados.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Database,
    name: "Recuperación de Datos",
    price: "desde RD$1,500",
    description: "Recuperación de archivos perdidos de discos duros o SSD.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Wrench className="w-4 h-4" />
            Servicios Técnicos
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Servicios de <span className="text-amber-500">Reparación</span> y Mantenimiento
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Soluciones técnicas profesionales para tus equipos. Diagnosticamos, reparamos y optimizamos tu tecnología.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.name}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-xl ${service.bg} mb-4`}>
                    <Icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">{service.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Necesitas un servicio?</h2>
          <p className="text-amber-100 mb-6 max-w-xl mx-auto">
            Contáctanos para agendar tu cita o solicitar más información sobre nuestros servicios.
          </p>
          <a
            href="https://wa.me/18095551234"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-amber-600 font-bold px-6 py-3 rounded-full hover:bg-amber-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" className="fill-current">
              <path d="M380.9 97.1C339 55.14 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 110.8L0 480l119.7-31.4c32.5 17.8 68.9 27.1 106.5 27.1h.1c122.4 0 222.1-99.6 222.1-222 0-59.3-23.2-115.1-65-157zM223.8 438.3h-.1c-33.7 0-66.5-9-95.3-26.2l-6.8-4-70.8 18.6L69.1 356l-4.4-7c-18.5-29.4-28.2-63.1-28.2-98 0-101.8 82.8-184.6 184.6-184.6 49.3 0 95.6 19.2 130.4 54.1 34.9 34.9 54.1 81.2 54.1 130.5-.1 101.9-82.9 184.7-184.8 184.7zm101.3-138.4c-5.5-2.8-32.8-16.1-37.9-17.9-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 17.9-17.6 21.6-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66.1-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.3-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.9 83.8 35.2 15.2 49.1 16.5 66.7 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.2 3.2-26.4-1.3-2.3-5-3.7-10.5-6.5z"/>
            </svg>
            Contactar por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
