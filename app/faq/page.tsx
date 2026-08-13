import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { WhatsApp } from "@/components/icons";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes - Morel Technology",
  description: "Resolvemos tus dudas sobre laptops, envíos, garantía, pagos y financiamiento en Morel Technology República Dominicana.",
  alternates: {
    canonical: "/faq",
  },
};

const faqs: { category: string; icon: React.ElementType; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    category: "Envíos",
    icon: Truck,
    items: [
      {
        q: "¿Hacen envíos a todo RD?",
        a: "Sí, realizamos envíos a todas las provincias de la República Dominicana a través de servicios de transporte como Metro Pac, Caribe Pack y BM Cargo. El tiempo de entrega suele ser de 24 a 48 horas laborables. También contamos con servicio de envío por motorizado privado en Santo Domingo y Santiago para entregas en el mismo día."
      },
      {
        q: "¿Cuál es el costo del envío?",
        a: "El envío es GRATIS dentro del Distrito Nacional y Santo Domingo. Para el interior, el costo depende del transporte elegido, pero suele oscilar entre RD$300 y RD$500."
      }
    ]
  },
  {
    category: "Garantía",
    icon: ShieldCheck,
    items: [
      {
        q: "¿Las laptops tienen garantía?",
        a: "Sí, todos nuestros equipos tienen garantía. Los equipos nuevos tienen hasta 1 año de garantía con el fabricante. Los equipos usados certificados incluyen 6 meses de garantía en piezas y servicios."
      },
      {
        q: "¿Qué cubre la garantía?",
        a: "Cubre cualquier defecto de fábrica en hardware (pantalla, teclado, batería, placa madre). No cubre daños físicos, derrames de líquidos o manipulación por terceros."
      }
    ]
  },
  {
    category: "Pagos y Financiamiento",
    icon: CreditCard,
    items: [
      {
        q: "¿Aceptan tarjetas?",
        a: "Sí, aceptamos tarjetas de crédito y débito (aplican comisiones de procesador de pago). También aceptamos transferencias bancarias (Banreservas, BHD, Popular) y efectivo."
      },
      {
        q: "¿Ofrecen financiamiento?",
        a: <>Sí, ofrecemos financiamiento con varias entidades financieras. Solo necesitas tu cédula, una cuenta bancaria activa y comprobante de ingresos. Puedes aplicar directamente en nuestra <Link href="/financiamiento" className="text-primary font-bold hover:underline">página de financiamiento</Link>.</>
      },
      {
        q: "¿Puedo comprar por WhatsApp?",
        a: "¡Por supuesto! Puedes hacer tu pedido directamente por WhatsApp. Te asesoramos, te enviamos fotos reales del equipo y coordinamos la entrega o recogida en sucursal."
      }
    ]
  }
];

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap(group =>
      group.items.map(item => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: typeof item.a === "string" ? item.a : "Sí, ofrecemos financiamiento. Visita nuestra página de financiamiento para más información.",
        },
      }))
    ),
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">

        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary mb-2">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Preguntas Frecuentes</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas saber antes de comprar tu próxima laptop en Morel Technology.
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((group, idx) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <group.icon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{group.category}</h2>
              </div>
              <Accordion className="w-full space-y-4">
                {group.items.map((item, itemIdx) => (
                  <AccordionItem
                    key={itemIdx}
                    value={`item-${idx}-${itemIdx}`}
                    className="border border-border/50 bg-card rounded-2xl px-6 overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-6 font-semibold text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 md:p-12 bg-primary/5 rounded-3xl border border-primary/10 text-center space-y-6">
          <h3 className="text-2xl font-bold">¿Aún tienes dudas?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Nuestro equipo técnico está listo para asesorarte personalmente. Escríbenos por WhatsApp y te responderemos de inmediato.
          </p>
          <div className="flex justify-center">
            <WhatsAppDropdown className="h-14 px-8 rounded-2xl text-lg shadow-xl shadow-green-600/20">
              Chatear con un experto
            </WhatsAppDropdown>
          </div>
        </div>

      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
