"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

const clientImages = Array.from({ length: 15 }, (_, i) => ({
  src: `/images/happy-clients/client-${i + 1}.jpg`,
  alt: "Cliente Morel Technology",
}));

export function HappyClients() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (clientImages.length === 0) return null;

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Clientes Felices</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Miles de clientes satisfechos confían en Morel Technology para sus laptops.
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Heart className="w-5 h-5 fill-primary" />
            <span className="font-bold text-lg">10,000+ clientes</span>
          </div>
        </div>

        {/* Auto-scrolling gallery */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-hidden"
          >
            <div
              className="flex gap-4 shrink-0"
              style={{
                animation: "scroll 40s linear infinite",
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {/* First set */}
              {clientImages.map((img, index) => (
                <div
                  key={`first-${index}`}
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shrink-0 group"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 256px, 320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {clientImages.map((img, index) => (
                <div
                  key={`second-${index}`}
                  className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shrink-0 group"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, 320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 8px));
          }
        }
      `}</style>
    </section>
  );
}
