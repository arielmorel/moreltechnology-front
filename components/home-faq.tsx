"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const faqs = [
  {
    question: "¿Qué garantía tienen las laptops?",
    answer: "Ofrecemos 6 meses de garantía en laptops usadas certificadas y 1 año en laptops nuevas. Toda garantía es por escrito y cubre defectos de hardware. Puedes revisar nuestros <a href='/garantia' class='text-primary font-semibold hover:underline'>términos completos aquí</a>.",
  },
  {
    question: "¿Puedo pagar con tarjeta de crédito o débito?",
    answer: "Sí, aceptamos todas las tarjetas de crédito y débito (Visa, MasterCard, American Express). También puedes pagar en efectivo o por transferencia bancaria. Para pagos con tarjeta aplica un recargo del 5%.",
  },
  {
    question: "¿Hacen envíos a todo el país?",
    answer: "Sí, realizamos envíos a todas las provincias de la República Dominicana a través de MetroPac, Caribe Pack y BM Cargo. En Santo Domingo y Santiago también contamos con delivery por motorizado privado.",
  },
  {
    question: "¿Las laptops usadas están en buen estado?",
    answer: "Absolutamente. Todas nuestras laptops usadas pasan por un riguroso proceso de certificación que incluye diagnóstico de hardware, limpieza profunda, reinstalación del sistema operativo y pruebas de rendimiento. Cada equipo tiene su condición claramente etiquetada: Como Nuevo o Buen Estado.",
  },
  {
    question: "¿Puedo financiar mi compra?",
    answer: "Sí, contamos con opciones de financiamiento flexibles a través de varias entidades financieras. Solo necesitas tu cédula y comprobante de ingresos. <a href='/financiamiento' class='text-primary font-semibold hover:underline'>Consulta las opciones aquí</a>.",
  },
  {
    question: "¿Dónde están ubicados?",
    answer: "Tenemos dos sucursales: en Santo Domingo (El Edén de Villa Mella) y en Santiago (Plaza Pamela 3). Puedes <a href='/tienda-laptops-santo-domingo' class='text-primary font-semibold hover:underline'>ver ubicaciones con mapas aquí</a>.",
  },
];

export function HomeFAQ() {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Left side - Title */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 w-fit"
            >
              <HelpCircle className="w-4 h-4" />
              Preguntas Frecuentes
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black tracking-tight mb-6"
            >
              ¿Tienes dudas?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg leading-relaxed mb-8"
            >
              Resolvemos las preguntas más comunes de nuestros clientes. Si no encuentras lo que buscas, escríbenos por WhatsApp.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <a
                href="https://wa.me/18096175517"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Escribir por WhatsApp
              </a>
            </motion.div>
          </div>

          {/* Right side - FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Accordion className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border/50 rounded-2xl px-6 overflow-hidden"
                >
                  <AccordionTrigger className="py-5 text-base font-semibold hover:no-underline hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-6 text-center">
              <Link
                href="/faq"
                className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                Ver todas las preguntas frecuentes →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
