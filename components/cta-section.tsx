"use client";

import { MessageCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Atención inmediata
          </div>

          <h2 className="animate-slide-up-delay-1 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
            ¿Listo para encontrar tu laptop ideal?
          </h2>

          <p className="animate-slide-up-delay-2 text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Nuestro equipo está listo para asesorarte. Escríbenos ahora y recibe atención personalizada en minutos.
          </p>

          <div className="animate-slide-up-delay-3 flex flex-col gap-4 justify-center">
            <a
              href="https://wa.me/18096175517"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-all hover:scale-105 shadow-xl shadow-green-500/25"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp Santo Domingo
            </a>
            <a
              href="https://wa.me/18094215517"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-all hover:scale-105 backdrop-blur-sm border border-white/20"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp Santiago
            </a>
          </div>

          <div className="animate-slide-up-delay-4 mt-12 flex flex-wrap justify-center gap-8 text-white/60 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Respuesta en minutos
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Asesoría personalizada
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sin compromiso
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
